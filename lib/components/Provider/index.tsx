import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { NotificationAPIClientSDK } from '@notificationapi/core';
import {
  GetPreferencesResponse,
  InAppNotification
} from '@notificationapi/core/dist/interfaces';
import {
  BaseDeliveryOptions,
  Channels,
  DeliveryOptionsForEmail,
  DeliveryOptionsForInappWeb
} from '@notificationapi/core/dist/interfaces';

export type Context = {
  notifications?: InAppNotification[];
  preferences?: GetPreferencesResponse;
  loadNotifications: (initial?: boolean) => void;
  markAsOpened: () => void;
  markAsArchived: (ids: string[] | 'ALL') => void;
  markAsUnarchived: (ids: string[] | 'ALL') => void;
  markAsClicked: (ids: string[]) => void;
  updateDelivery: (
    notificationId: string,
    channel: Channels,
    delivery:
      | DeliveryOptionsForEmail
      | DeliveryOptionsForInappWeb
      | BaseDeliveryOptions,
    subNotificationId?: string
  ) => void;
};

export const NotificationAPIContext = createContext<Context | undefined>(
  undefined
);

type Props = {
  clientId: string;
  userId: string;
  hashedUserId?: string;
  apiURL?: string;
  wsURL?: string;
  initialLoadMaxCount?: number;
  initialLoadMaxAge?: Date;
};

export const NotificationAPIProvider: React.FunctionComponent<
  PropsWithChildren<Props>
> & {
  useNotificationAPIContext: typeof useNotificationAPIContext;
} = (props) => {
  const defaultConfigs = {
    apiURL: 'https://api.notificationapi.com',
    wsURL: 'wss://ws.notificationapi.com',
    initialLoadMaxCount: 1000,
    initialLoadMaxAge: new Date(new Date().setMonth(new Date().getMonth() - 3))
  };

  const config = {
    ...defaultConfigs,
    ...props
  };

  const [notifications, setNotifications] = useState<InAppNotification[]>();
  const [preferences, setPreferences] = useState<GetPreferencesResponse>();
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [oldestLoaded, setOldestLoaded] = useState(new Date().toISOString());
  const [hasMore, setHasMore] = useState(true);

  const addNotificationsToState = useCallback((notis: InAppNotification[]) => {
    const now = new Date().toISOString();
    setNotifications((prev) => {
      notis = notis.filter((n) => {
        if (n.expDate && new Date(n.expDate * 1000).toISOString() > now)
          return false;
        if (n.date > now) return false;
        return true;
      });

      if (!prev) return notis; // if no existing notifications in state, just return the new ones

      return [
        ...notis.filter((n) => {
          return !prev.find((p) => p.id === n.id);
        }),
        ...prev
      ];
    });
  }, []);

  const client = useMemo(() => {
    return NotificationAPIClientSDK.init({
      clientId: props.clientId,
      userId: props.userId,
      hashedUserId: props.hashedUserId,
      onNewInAppNotifications: (notifications) => {
        addNotificationsToState(notifications);
      }
    });
  }, [
    props.clientId,
    props.userId,
    props.hashedUserId,
    addNotificationsToState
  ]);

  // Notificaiton loading and state updates
  const fetchNotifications = useCallback(
    async (date: string, count: number) => {
      const res = await client.rest.getNotifications(date, count);
      setOldestLoaded(res.oldestReceived);
      setHasMore(res.couldLoadMore);
      addNotificationsToState(res.notifications);
    },
    [addNotificationsToState, client.rest]
  );
  const hasMoreRef = useRef(hasMore);
  const loadingNotificationsRef = useRef(loadingNotifications);
  const oldestLoadedRef = useRef(oldestLoaded);

  useEffect(() => {
    hasMoreRef.current = hasMore;
    loadingNotificationsRef.current = loadingNotifications;
    oldestLoadedRef.current = oldestLoaded;
  }, [hasMore, loadingNotifications, oldestLoaded]);
  const loadNotifications = useCallback(
    async (initial?: boolean) => {
      if (!initial && (!hasMoreRef.current || loadingNotificationsRef.current))
        return;

      setLoadingNotifications(true);

      try {
        await fetchNotifications(
          initial ? new Date().toISOString() : oldestLoadedRef.current,
          initial ? config.initialLoadMaxCount : 1000
        );
      } finally {
        setLoadingNotifications(false);
      }
    },
    [config.initialLoadMaxCount, fetchNotifications]
  );

  const markAsClicked = async (_ids: string[]) => {
    if (!notifications) return;

    const date = new Date().toISOString();
    const ids: string[] = notifications
      .filter((n) => _ids.includes(n.id) && !n.clicked)
      .map((n) => n.id);

    client.updateInAppNotifications({ ids, clicked: true });

    setNotifications((prev) => {
      if (!prev) return [];
      const newNotifications = [...prev];
      newNotifications
        .filter((n) => ids.includes(n.id))
        .forEach((n) => {
          n.clicked = date;
        });
      return newNotifications;
    });
  };

  const markAsOpened = async () => {
    if (!notifications) return;

    const date = new Date().toISOString();
    const ids: string[] = notifications
      .filter((n) => !n.opened || !n.seen)
      .map((n) => n.id);

    if (ids.length === 0) return;

    client.updateInAppNotifications({
      ids,
      opened: true
    });

    setNotifications((prev) => {
      if (!prev) return [];
      const newNotifications = [...prev];
      newNotifications
        .filter((n) => ids.includes(n.id))
        .forEach((n) => {
          n.opened = date;
          n.seen = true;
        });
      return newNotifications;
    });
  };

  const markAsUnarchived = async (_ids: string[] | 'ALL') => {
    if (!notifications) return;

    const ids: string[] = notifications
      .filter((n) => {
        return n.archived && (_ids === 'ALL' || _ids.includes(n.id));
      })
      .map((n) => n.id);

    if (ids.length === 0) return;

    client.updateInAppNotifications({
      ids,
      archived: false
    });

    setNotifications((prev) => {
      if (!prev) return [];
      const newNotifications = [...prev];
      newNotifications
        .filter((n) => ids.includes(n.id))
        .forEach((n) => {
          n.archived = undefined;
        });
      return newNotifications;
    });
  };

  const markAsArchived = async (_ids: string[] | 'ALL') => {
    if (!notifications) return;

    const date = new Date().toISOString();
    const ids: string[] = notifications
      .filter((n) => {
        return !n.archived && (_ids === 'ALL' || _ids.includes(n.id));
      })
      .map((n) => n.id);

    if (ids.length === 0) return;

    client.updateInAppNotifications({ ids, archived: true });

    setNotifications((prev) => {
      if (!prev) return [];
      const newNotifications = [...prev];
      newNotifications
        .filter((n) => ids.includes(n.id))
        .forEach((n) => {
          n.archived = date;
        });
      return newNotifications;
    });
  };

  const updateDelivery = (
    notificationId: string,
    channel: Channels,
    delivery:
      | DeliveryOptionsForEmail
      | DeliveryOptionsForInappWeb
      | BaseDeliveryOptions,
    subNotificationId?: string
  ) => {
    client
      .updateDeliveryOption({
        notificationId,
        channel,
        delivery,
        subNotificationId
      })
      .then(() => {
        client.getPreferences().then((res) => {
          setPreferences(res);
        });
      });
  };

  useEffect(() => {
    // reset state
    setNotifications([]);
    setLoadingNotifications(false);
    setPreferences(undefined);
    setOldestLoaded(new Date().toISOString());
    setHasMore(true);

    loadNotifications(true);

    client.openWebSocket();

    client.getPreferences().then((res) => {
      setPreferences(res);
    });
  }, [client, loadNotifications]);

  const value: Context = {
    notifications,
    preferences,
    loadNotifications,
    markAsOpened,
    markAsArchived,
    markAsUnarchived,
    markAsClicked,
    updateDelivery
  };

  return (
    <NotificationAPIContext.Provider value={value}>
      {props.children}
    </NotificationAPIContext.Provider>
  );
};

const useNotificationAPIContext = (): Context => {
  const context = useContext(NotificationAPIContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};
NotificationAPIProvider.useNotificationAPIContext = useNotificationAPIContext;
