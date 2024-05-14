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

export type Context = {
  notifications: any[];
  loadNotifications: (initial?: boolean) => void;
  markAsRead: (trackingId?: string) => void;
};

export const NotificationAPIContext = createContext<Context | undefined>(
  undefined
);

export const NotificatinAPIProvider: React.FunctionComponent<
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

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [oldestLoaded, setOldestLoaded] = useState(new Date().toISOString());
  const [hasMore, setHasMore] = useState(true);

  const addNotificationsToState = (notis: any[]) => {
    setNotifications((prev) => [
      ...notis.filter((n) => {
        return !prev.find((p) => p.id === n.id);
      }),
      ...prev,
    ]);
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
      props.userId
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

  const markAsRead = async (trackingId?: string) => {
    const trackingIds = trackingId
      ? [trackingId]
      : notifications.map((n) => n.id);
    await api(
      config.apiURL,
      "PATCH",
      `notifications/INAPP_WEB`,
      props.clientId,
      props.userId,
      "",
      {
        trackingIds,
        opened: true,
      }
    );

    setNotifications((prev) => {
      const newNotifications = [...prev];
      newNotifications
        .filter((n) => trackingIds.includes(n.id))
        .forEach((n) => {
          n.opened = new Date().toISOString();
          n.seen = true;
        });
      return newNotifications;
    });
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
  }, []);

  const value: Context = {
    notifications,
    loadNotifications,
    markAsRead,
  };

  return (
    <NotificationAPIContext.Provider value={value}>
      {props.children}
    </NotificationAPIContext.Provider>
  );
};
