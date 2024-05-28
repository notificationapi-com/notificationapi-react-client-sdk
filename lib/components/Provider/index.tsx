import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { api } from "../../api";

type Props = {
  clientId: string;
  userId: string;
  hashedUserId?: string;
  apiURL?: string;
  wsURL?: string;
  initialLoadMaxCount?: number;
  initialLoadMaxAge?: Date;
};

interface WS_NewNotification {
  route: "inapp_web/new_notifications";
  payload: {
    notifications: any[];
  };
}

export const NOTIFICATION_ACTIONS = {
  opened: "opened",
  clicked: "clicked",
  archived: "archived",
  replied: "replied",
  actioned1: "actioned1",
  actioned2: "actioned2",
};

export enum Channels {
  EMAIL = "EMAIL",
  INAPP_WEB = "INAPP_WEB",
  SMS = "SMS",
  CALL = "CALL",
  PUSH = "PUSH",
  WEB_PUSH = "WEB_PUSH",
}

export enum DeliveryOptions {
  OFF = "off",
  INSTANT = "instant",
  HOURLY = "hourly",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

export interface Notification {
  envId: string;
  notificationId: string;
  title: string;
  channels: Channels[];
  enabled: boolean;
  deduplication?: {
    duration: number; // seconds
  };
  throttling?: {
    max: number;
    period: number;
    unit: "seconds" | "minutes" | "hours" | "days" | "months" | "years";
    forever: boolean;
    scope: ["userId", "notificationId"];
  };
  retention?: number;
  options?: {
    [key in Channels]?: {
      defaultDeliveryOption: DeliveryOptions;
      [DeliveryOptions.OFF]: {
        enabled: boolean;
      };
      [DeliveryOptions.INSTANT]: {
        enabled: boolean;
      };
      [DeliveryOptions.HOURLY]: {
        enabled: boolean;
      };
      [DeliveryOptions.DAILY]: {
        enabled: boolean;
        hour: string;
      };
      [DeliveryOptions.WEEKLY]: {
        enabled: boolean;
        hour: string;
        day: string;
      };
      [DeliveryOptions.MONTHLY]: {
        enabled: boolean;
        hour: string;
        date: "first" | "last";
      };
    };
  };
}

export interface InappNotification {
  id: string;
  seen: boolean;
  title: string;
  redirectURL?: string;
  imageURL?: string;
  date: Date;
  parameters?: Record<string, unknown>;
  expDate?: Date;
  opened?: string;
  clicked?: string;
  archived?: string;
  actioned1?: string;
  actioned2?: string;
  replies?: {
    date: string;
    message: string;
  }[];
}

export interface Preferences {
  preferences: {
    notificationId: string;
    channel: Channels;
    delivery: DeliveryOptions;
    subNotificationId?: string;
  }[];
  notifications: {
    notificationId: string;
    title: string;
    channels: Channels[];
    options: Notification["options"];
  }[];
  subNotifications: {
    notificationId: string;
    subNotificationId: string;
    title: string;
  }[];
}

export type Context = {
  notifications?: InappNotification[];
  preferences?: Preferences;
  loadNotifications: (initial?: boolean) => void;
  markAsOpened: () => void;
  markAsArchived: (ids: string[] | "ALL") => void;
  markAsClicked: (id: string) => void;
  updateDelivery: (
    notificationId: string,
    channel: Channels,
    delivery: DeliveryOptions,
    subNotificationId?: string
  ) => void;
};

export const NotificationAPIContext = createContext<Context | undefined>(
  undefined
);

export const NotificationAPIProvider: React.FunctionComponent<
  PropsWithChildren<Props>
> = (props) => {
  const defaultConfigs = {
    apiURL: "https://api.notificationapi.com",
    wsURL: "wss://ws.notificationapi.com",
    initialLoadMaxCount: 1000,
    initialLoadMaxAge: new Date(new Date().setMonth(new Date().getMonth() - 3)),
  };

  const config = {
    ...defaultConfigs,
    ...props,
  };

  const [notifications, setNotifications] = useState<InappNotification[]>();
  const [preferences, setPreferences] = useState<Preferences>();
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [oldestLoaded, setOldestLoaded] = useState(new Date().toISOString());
  const [hasMore, setHasMore] = useState(true);

  const addNotificationsToState = (notis: any[]) => {
    setNotifications((prev) => {
      if (!prev) return notis; // if no existing notifications in state, just return the new ones

      return [
        ...notis.filter((n) => {
          return !prev.find((p) => p.id === n.id);
        }),
        ...prev,
      ];
    });
  };

  const getNotifications = async (
    count: number,
    before: number
  ): Promise<any[]> => {
    const res = await api(
      config.apiURL,
      "GET",
      `notifications/INAPP_WEB?count=${count}&before=${before}`,
      props.clientId,
      props.userId,
      props.hashedUserId
    );
    return res.notifications;
  };

  const fetchNotificationsBeforeDate = async (
    before: string,
    maxCountNeeded: number,
    oldestNeeded?: string
  ): Promise<{
    notifications: any[];
    couldLoadMore: boolean;
    oldestReceived: string;
  }> => {
    let result: any[] = [];
    let oldestReceived = before;
    let couldLoadMore = true;
    let shouldLoadMore = true;
    while (shouldLoadMore) {
      const notis = await getNotifications(
        maxCountNeeded,
        new Date(oldestReceived).getTime()
      );
      const notisWithoutDuplicates = notis.filter(
        (n: any) => !result.find((nn) => nn.id === n.id)
      );
      oldestReceived = notisWithoutDuplicates.reduce(
        (min: string, n: any) => (min < n.date ? min : n.date),
        before
      );
      result = [...result, ...notisWithoutDuplicates];

      couldLoadMore = notisWithoutDuplicates.length > 0;
      shouldLoadMore = true;

      if (
        !couldLoadMore ||
        result.length >= maxCountNeeded ||
        (oldestNeeded && oldestReceived < oldestNeeded)
      ) {
        shouldLoadMore = false;
      }
    }
    console.log(result.length, couldLoadMore, oldestReceived);
    return {
      notifications: result,
      couldLoadMore,
      oldestReceived,
    };
  };

  const loadNotifications = async (initial?: boolean) => {
    if (!hasMore) return;
    if (loadingNotifications) return;
    setLoadingNotifications(true);
    const res = await fetchNotificationsBeforeDate(
      oldestLoaded,
      initial ? config.initialLoadMaxCount : 1000,
      initial ? config.initialLoadMaxAge.toISOString() : undefined
    );
    setOldestLoaded(res.oldestReceived);
    setHasMore(res.couldLoadMore);
    addNotificationsToState(res.notifications);
    setLoadingNotifications(false);
  };

  const markAsClicked = async (id: string) => {
    const date = new Date().toISOString();
    api(
      config.apiURL,
      "PATCH",
      `notifications/INAPP_WEB`,
      props.clientId,
      props.userId,
      props.hashedUserId,
      {
        trackingIds: [id],
        clicked: date,
      }
    );

    setNotifications((prev) => {
      if (!prev) return [];
      const newNotifications = [...prev];
      const n = newNotifications.find((n) => n.id === id);
      if (n) {
        n.clicked = date;
      }
      return newNotifications;
    });
  };

  const markAsOpened = async () => {
    if (!notifications) return;

    const date = new Date().toISOString();
    const trackingIds: string[] = notifications
      .filter((n) => !n.opened || !n.seen)
      .map((n) => n.id);

    if (trackingIds.length === 0) return;

    api(
      config.apiURL,
      "PATCH",
      `notifications/INAPP_WEB`,
      props.clientId,
      props.userId,
      props.hashedUserId,
      {
        trackingIds,
        opened: date,
      }
    );

    setNotifications((prev) => {
      if (!prev) return [];
      const newNotifications = [...prev];
      newNotifications
        .filter((n) => trackingIds.includes(n.id))
        .forEach((n) => {
          n.opened = date;
          n.seen = true;
        });
      return newNotifications;
    });
  };

  const markAsArchived = async (ids: string[] | "ALL") => {
    if (!notifications) return;

    const date = new Date().toISOString();
    const trackingIds: string[] = notifications
      .filter((n) => {
        return !n.archived && (ids === "ALL" || ids.includes(n.id));
      })
      .map((n) => n.id);

    if (trackingIds.length === 0) return;

    api(
      config.apiURL,
      "PATCH",
      `notifications/INAPP_WEB`,
      props.clientId,
      props.userId,
      props.hashedUserId,
      {
        trackingIds,
        archived: date,
      }
    );

    setNotifications((prev) => {
      if (!prev) return [];
      const newNotifications = [...prev];
      newNotifications
        .filter((n) => trackingIds.includes(n.id))
        .forEach((n) => {
          n.archived = date;
        });
      return newNotifications;
    });
  };

  const updateDelivery = (
    notificationId: string,
    channel: Channels,
    delivery: DeliveryOptions,
    subNotificationId?: string
  ) => {
    if (!preferences) return;
    const newPreferences = { ...preferences };
    const pref = newPreferences.preferences.find(
      (p) =>
        p.notificationId === notificationId &&
        p.subNotificationId === subNotificationId &&
        p.channel === channel
    );
    if (pref) pref.delivery = delivery;
    setPreferences(newPreferences);
  };

  useEffect(() => {
    loadNotifications(true);

    const websocket = new WebSocket(
      `${config.wsURL}?userId=${config.userId}&envId=${config.clientId}`
    );

    websocket.onmessage = (m) => {
      const body = JSON.parse(m.data);
      if (!body || !body.route) {
        return;
      }

      if (body.route === "inapp_web/new_notifications") {
        const message = body as WS_NewNotification;
        addNotificationsToState(message.payload.notifications);
      }
    };

    api(
      config.apiURL,
      "GET",
      `preferences`,
      props.clientId,
      props.userId,
      props.hashedUserId
    ).then((res) => {
      setPreferences(res);
    });
  }, []);

  const value: Context = {
    notifications,
    preferences,
    loadNotifications,
    markAsOpened,
    markAsArchived,
    markAsClicked,
    updateDelivery,
  };

  return (
    <NotificationAPIContext.Provider value={value}>
      {props.children}
    </NotificationAPIContext.Provider>
  );
};
