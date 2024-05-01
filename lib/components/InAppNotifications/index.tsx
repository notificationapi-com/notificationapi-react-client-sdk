import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { NotificationAPIContext } from "../Provider";
import { Avatar, Badge, Button, List, Popover, Typography } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { api } from "../../api";
import VirtualList from "rc-virtual-list";

export enum InAppNotificationType {
  CORNER = "CORNER",
  POPUP = "POPUP",
  INLINE = "INLINE",
}

export type InAppNotificationsProps = {
  type?: InAppNotificationType;
  width?: number | string;
  maxHeight?: number | string;
  unreadCountOffset?: [number, number];
  loadingAnimation?: boolean | React.ReactNode;
  imageShape?: "circle" | "square";
  pagination: "infinite_scroll" | "paginated";
  callbacks?: {
    onWebsocketConnected?: () => any;
    onWebsocketDisconnected?: () => any;
    onNewNotification?: (notification: any) => any;
  };
};

interface WS_NewNotification {
  route: "inapp_web/new_notifications";
  payload: {
    notifications: any[];
  };
}

export function InAppNotifications(props: InAppNotificationsProps) {
  // defaults
  const type = props.type ?? InAppNotificationType.CORNER;
  const width = props.width ?? 320;
  const maxHeight = props.maxHeight ?? 600;
  const unreadCountOffset =
    props.unreadCountOffset ??
    (type === InAppNotificationType.CORNER ? [-6, 5] : [-8, 7]);
  const loadingAnimation =
    props.loadingAnimation === true || props.loadingAnimation === undefined ? (
      <LoadingOutlined />
    ) : (
      props.loadingAnimation
    );
  const imageShape = props.imageShape ?? "circle";
  const pagination = props.pagination ?? "infinite_scroll";
  const onWebSocketOpen =
    props.callbacks?.onWebsocketConnected ??
    ((websocket: WebSocket) => {
      console.log("Connected");
      return websocket;
    });

  // states
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number | undefined>();
  const context = useContext(NotificationAPIContext);

  if (!context) {
    return null;
  }

  // const fetchUnreadCount = async (): Promise<number> => {
  //   const res = await api(
  //     context.apiURL,
  //     "GET",
  //     `unread/INAPP_WEB`,
  //     context.clientId,
  //     context.userId
  //   );
  //   return res.count || 5;
  // };

  const getNotifications = async (
    count: number,
    before: number
  ): Promise<any[]> => {
    const res = await api(
      context.apiURL,
      "GET",
      `notifications/INAPP_WEB?count=${count}&before=${before}`,
      context.clientId,
      context.userId
    );
    return res.notifications;
  };

  const fetchLastNotifications = async (max: number): Promise<any[]> => {
    let result: any[] = [];
    let count = 0;
    let before = new Date().toISOString();
    do {
      const res = await getNotifications(1000, new Date(before).getTime());
      const newRes = res.filter((n) => !result.find((nn) => nn.id === n.id));
      count = newRes.length;
      before = res.reduce((min, n) => (min < n.date ? min : n.date), before);
      result = [
        ...result,
        ...res.filter((n) => !result.find((nn) => nn.id === n.id)),
      ];

      console.log(count, before);
    } while (count > 100000 && result.length < max);
    return result;
  };

  useEffect(() => {
    fetchLastNotifications(1000).then((res) => {
      addNotificationsToState(res);
    });

    const websocket = new WebSocket(
      `${context.wsURL}?userId=${context.userId}&envId=${context.clientId}`
    );

    websocket.onopen = () => onWebSocketOpen(websocket);
    websocket.onmessage = (m) => {
      console.log("WebSocket message", m);

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

  const addNotificationsToState = (notis: any[]) => {
    // filter out duplicates
    const notisWithoutDups = notis.filter(
      (n) => !notifications.find((nn) => nn.id === n.id)
    );

    // calculate unread ones
    const newNotificationsState = [...notisWithoutDups, ...notifications];

    // calculate unread
    const newUnreadState = newNotificationsState.filter((n) => !n.seen).length;

    setNotifications(newNotificationsState);
    setUnreadCount(newUnreadState);
  };

  const Notification = (props: { notification: any }) => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          padding: "4px 0",
          background: props.notification.read ? "#f0f0f0" : "white",
        }}
      >
        <Avatar
          src={props.notification.imageURL}
          size="large"
          style={{
            marginRight: 8,
          }}
          shape={imageShape}
        />
        <Typography.Text>{props.notification.title}</Typography.Text>
      </div>
    );
  };

  const InboxHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography.Text strong>Notifications</Typography.Text>
        <div>
          <Popover content="Mark all as read">
            <Button icon={<CheckCircleOutlined />} size="small" type="text" />
          </Popover>
          <Popover content="Notification Preferences">
            <Button icon={<SettingOutlined />} size="small" type="text" />
          </Popover>
        </div>
      </div>
    );
  };

  const InboxInfiniteScroll = (props: {
    children: React.ReactNode;
  }): JSX.Element => {
    if (pagination === "infinite_scroll") {
      return (
        <VirtualList
          data={notifications}
          height={maxHeight}
          itemKey="id"
          onScroll={() => {
            console.log("scrolled");
          }}
        >
          {props.children}
        </VirtualList>
      );
    } else {
      return <>{props.children}</>;
    }
  };

  const Inbox = (notifications: any[]) => {
    return (
      <div
        style={{
          width,
          borderRadius: 8,
          background: "#fff",
          padding: type === InAppNotificationType.INLINE ? 12 : 0,
        }}
      >
        <List header={<InboxHeader />} dataSource={notifications}>
          <VirtualList
            data={notifications}
            height={maxHeight}
            itemHeight={47}
            itemKey="id"
            onScroll={(e) => {
              // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
              if (
                Math.abs(
                  e.currentTarget.scrollHeight -
                    e.currentTarget.scrollTop -
                    maxHeight
                ) <= 1
              ) {
                console.log("scrolled to the bottom");
              }
            }}
          >
            {(n: any) => (
              <List.Item key={n.id}>
                <Notification notification={n} />
              </List.Item>
            )}
          </VirtualList>
        </List>
      </div>
    );
  };

  const UnreadCount: React.FunctionComponent<PropsWithChildren> = (props) => {
    return (
      <Badge
        count={
          unreadCount === undefined && loadingAnimation
            ? loadingAnimation
            : unreadCount
        }
        size="small"
        offset={unreadCountOffset}
      >
        {props.children}
      </Badge>
    );
  };

  return (
    <div>
      <Popover
        trigger="click"
        content={Inbox(notifications)}
        arrow={false}
        overlayStyle={{
          padding: "0 16px",
        }}
        overlayInnerStyle={{
          maxHeight: "80vh",
        }}
      >
        {type === InAppNotificationType.CORNER ? (
          <div
            style={{
              position: "fixed",
              right: 16,
              bottom: 16,
            }}
          >
            <UnreadCount>
              <Button size="large" icon={<BellOutlined />} shape="circle" />
            </UnreadCount>
          </div>
        ) : type === InAppNotificationType.POPUP ? (
          <div
            style={{
              display: "inline-block",
            }}
          >
            <UnreadCount>
              <Button icon={<BellOutlined />} shape="circle" type="text" />
            </UnreadCount>
          </div>
        ) : null}
      </Popover>

      {type === InAppNotificationType.INLINE && (
        <div>{Inbox(notifications)}</div>
      )}
    </div>
  );
}
