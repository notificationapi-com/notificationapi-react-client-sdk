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
  InAppNotification,
  User,
  UserAccountMetadata,
  PushSubscription
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
  userAccountMetaData?: { userAccountMetadata: UserAccountMetadata };
  webPushOptInMessage?: 'AUTOMATIC' | boolean;
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
  updateDeliveries: (
    params: {
      notificationId: string;
      channel: Channels;
      delivery:
        | DeliveryOptionsForEmail
        | DeliveryOptionsForInappWeb
        | BaseDeliveryOptions;
      subNotificationId?: string;
    }[]
  ) => void;
  getClient: () => typeof NotificationAPIClientSDK;
  setWebPushOptInMessage: React.Dispatch<
    React.SetStateAction<'AUTOMATIC' | boolean>
  >;
  setWebPushOptIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NotificationAPIContext = createContext<Context | undefined>(
  undefined
);

type Props = (
  | {
      userId: string;
    }
  | {
      user: Omit<User, 'createdAt' | 'updatedAt' | 'lastSeenTime'>;
    }
) & {
  clientId: string;
  hashedUserId?: string;
  apiURL?: string;
  wsURL?: string;
  initialLoadMaxCount?: number;
  initialLoadMaxAge?: Date;
  playSoundOnNewNotification?: boolean;
  newNotificationSoundPath?: string;
  client?: typeof NotificationAPIClientSDK;
  webPushOptInMessage?: 'AUTOMATIC' | boolean;
  customServiceWorkerPath?: string;
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
    initialLoadMaxAge: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    playSoundOnNewNotification: false,
    newNotificationSoundPath:
      'https://proxy.notificationsounds.com/notification-sounds/elegant-notification-sound/download/file-sounds-1233-elegant.mp3',
    webPushOptInMessage: 'AUTOMATIC' as 'AUTOMATIC' | boolean,
    customServiceWorkerPath: '/notificationapi-service-worker.js'
  };

  const config = {
    ...defaultConfigs,
    ...props,
    user: 'userId' in props ? { id: props.userId } : props.user
  };

  const [notifications, setNotifications] = useState<InAppNotification[]>();
  const [preferences, setPreferences] = useState<GetPreferencesResponse>();
  const [userAccountMetaData, setUserAccountMetaData] = useState<{
    userAccountMetadata: UserAccountMetadata;
  }>();
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [oldestLoaded, setOldestLoaded] = useState(new Date().toISOString());
  const [hasMore, setHasMore] = useState(true);
  const [webPushOptInMessage, setWebPushOptInMessage] = useState<
    'AUTOMATIC' | boolean
  >(config.webPushOptInMessage);
  const [webPushOptIn, setWebPushOptIn] = useState<boolean>(false);

  const playSound = useCallback(() => {
    if (config.playSoundOnNewNotification) {
      const audio = new Audio(config.newNotificationSoundPath);
      audio.play().catch((e) => {
        console.log('Failed to play new notification sound:', e);
      });
    }
  }, [config.newNotificationSoundPath, config.playSoundOnNewNotification]);

  const addNotificationsToState = useCallback((notis: InAppNotification[]) => {
    const now = new Date().toISOString();
    setNotifications((prev) => {
      notis = notis.filter((n) => {
        const isExpired =
          n.expDate && new Date(n.expDate * 1000).toISOString() < now;
        const isFuture =
          new Date(n.date).getTime() > new Date(now).getTime() + 1000; // Allow for 1 second margin
        return !isExpired && !isFuture;
      });

      if (!prev) return notis; // if no existing notifications in state, just return the new ones

      const updatedNotifications = [
        ...notis.filter((n) => {
          const isDuplicate = prev.find((p) => p.id === n.id);
          return !isDuplicate;
        }),
        ...prev
      ];

      return updatedNotifications;
    });
  }, []);

  const client = useMemo(() => {
    const client = props.client
      ? props.client
      : NotificationAPIClientSDK.init({
          clientId: config.clientId,
          userId: config.user.id,
          hashedUserId: config.hashedUserId,
          onNewInAppNotifications: (notifications) => {
            playSound();
            addNotificationsToState(notifications);
          }
        });

    //  identify user
    client.identify({
      email: config.user.email,
      number: config.user.number
    });

    return client;
  }, [
    config.clientId,
    config.user.id,
    config.user.email,
    config.user.number,
    config.hashedUserId,
    addNotificationsToState,
    playSound,
    props.client
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
    return updateDeliveries([
      {
        notificationId,
        channel,
        delivery,
        subNotificationId
      }
    ]);
  };

  const updateDeliveries = (
    params: {
      notificationId: string;
      channel: Channels;
      delivery:
        | DeliveryOptionsForEmail
        | DeliveryOptionsForInappWeb
        | BaseDeliveryOptions;
      subNotificationId?: string;
    }[]
  ) => {
    client.rest.postPreferences(params).then(() => {
      client.getPreferences().then((res) => {
        setPreferences(res);
      });
    });
  };

  /**
   * Asks the user for permission to send web push notifications and subscribes to the push service if granted.
   *
   * @callback askForWebPushPermission
   *
   * @throws Will log an error code if the service worker registration or push subscription fails.
   *
   * Possible error codes:
   * - `18`: The operation is insecure. This typically occurs if the code is run in an insecure context (e.g., not over HTTPS).
   * - `19`: The operation is aborted. This can happen if the user denies the permission request.
   * - `20`: The operation is invalid. This can occur if the provided application server key is invalid.
   * - `21`: The operation is not allowed. This can happen if the user has blocked notifications for the site.
   * - `22`: The operation is not supported. This can occur if the browser does not support the required features.
   *
   * @dependencies
   * - `client`: The client instance used to identify the user with the web push tokens.
   * - `config.customServiceWorkerPath`: The path to the custom service worker script.
   * - `userAccountMetaData?.userAccountMetadata.environmentVapidPublicKey`: The VAPID public key for the environment.
   */
  const askForWebPushPermission = useCallback((): void => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(config.customServiceWorkerPath)
        .then(async (registration) => {
          setWebPushOptInMessage(false);
          if ('Notification' in window) {
            Notification.requestPermission().then(async (permission) => {
              if (permission === 'granted') {
                await registration.pushManager
                  .subscribe({
                    userVisibleOnly: true,
                    applicationServerKey:
                      userAccountMetaData?.userAccountMetadata
                        .environmentVapidPublicKey
                  })
                  .then(async (res) => {
                    const body = {
                      webPushTokens: [
                        {
                          sub: {
                            endpoint: res.toJSON().endpoint as string,
                            keys: res.toJSON().keys as PushSubscription['keys']
                          }
                        }
                      ]
                    };
                    await client.identify(body);
                    console.log('index');
                    localStorage.setItem('hideWebPushOptInMessage', 'true');
                  });
              } else if (permission === 'denied') {
                console.log('Permission for notifications was denied');
              }
            });
          }
        })
        .catch((e) => {
          if (e.code === 18) {
            console.error(
              'NotificationAPI guide: Probably you are not setup the service worker correctly. Please check the documentation at https://docs.notificationapi.com/guides/web-push#step-by-step-implementation Step 3: Service Worker Setup.'
            );
          } else if (e.code === 19) {
            console.error(
              'The operation is aborted. This can happen if the user denies the permission request.'
            );
          } else if (e.code === 20) {
            console.error(
              'The operation is invalid. This can occur if the provided application server key is invalid. Please contact NotificationAPI support.'
            );
          } else if (e.code === 21) {
            console.error(
              'The operation is not allowed. This can happen if the user has blocked notifications for the site. Please check your browser site settings Notifications part.'
            );
          } else if (e.code === 22) {
            console.error(
              'The operation is not supported. This can occur if the browser does not support the required features.'
            );
          } else {
            console.error(e);
          }
        });
    }
  }, [
    client,
    config.customServiceWorkerPath,
    userAccountMetaData?.userAccountMetadata.environmentVapidPublicKey
  ]);

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
  }, [client, loadNotifications, askForWebPushPermission]);

  useEffect(() => {
    if (Notification.permission !== 'default') {
      setWebPushOptInMessage(false);
    }

    if (webPushOptInMessage === 'AUTOMATIC') {
      setWebPushOptInMessage(
        localStorage.getItem('hideWebPushOptInMessage') !== 'true'
      );
      client.getUserAccountMetadata().then((res) => {
        setUserAccountMetaData(res);

        setWebPushOptInMessage(res.userAccountMetadata.hasWebPushEnabled);
      });
    }
  }, [client, webPushOptInMessage]);
  useEffect(() => {
    if (webPushOptIn) {
      askForWebPushPermission();
    }
  }, [webPushOptIn, askForWebPushPermission]);
  const value: Context = {
    notifications,
    preferences,
    userAccountMetaData,
    webPushOptInMessage,
    loadNotifications,
    markAsOpened,
    markAsArchived,
    markAsUnarchived,
    markAsClicked,
    updateDelivery,
    updateDeliveries,
    getClient: () => client,
    setWebPushOptInMessage,
    setWebPushOptIn
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
