import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { NotificationAPIContext } from "../Provider";
import { Avatar, Badge, Button, List, Popover, Typography } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { api } from "../../api";
import VirtualList from "rc-virtual-list";
import styled from "styled-components";

const NotificationDiv = styled.div<{
  seen: boolean;
  redirect: boolean;
}>`
  cursor: ${(props) => (props.redirect ? "pointer" : "default")};

  &:hover {
    background: red;
  }
`;

export enum Type {
  CORNER = "CORNER",
  POPUP = "POPUP",
  INLINE = "INLINE",
}

export enum Pagination {
  INFINITE_SCROLL = "infinite_scroll",
  PAGINATED = "paginated",
}

export enum ImageShape {
  square = "square",
  circle = "circle",
}

export type InAppNotificationsProps = {
  type?: keyof typeof Type;
  buttonWidth?: number;
  buttonHeight?: number;
  buttonIcon?: React.ReactNode;
  width?: number;
  maxHeight?: number;
  unreadCountOffset?: [number, number];
  imageShape?: keyof typeof ImageShape;
  pagination?: keyof typeof Pagination;
  pageSize?: number;
  pagePosition?: "top" | "bottom";
  onWebsocketConnected?: () => any;
  onWebsocketDisconnected?: () => any;
  onNewNotification?: (notification: any) => any;
};

interface WS_NewNotification {
  route: "inapp_web/new_notifications";
  payload: {
    notifications: any[];
  };
}

export function InAppNotifications(props: InAppNotificationsProps) {
  // defaults
  const defaultConfigs: Required<InAppNotificationsProps> = {
    type: Type.CORNER,
    buttonWidth: props.type === Type.POPUP ? 32 : 48,
    buttonHeight: props.type === Type.POPUP ? 32 : 48,
    buttonIcon: <BellOutlined />,
    width: 320,
    maxHeight: 600,
    unreadCountOffset: props.type === Type.CORNER ? [-6, 5] : [-8, 7],
    imageShape: "circle",
    pagination: "INFINITE_SCROLL",
    pageSize: 5,
    pagePosition: "top",
    onWebsocketConnected: () => {},
    onWebsocketDisconnected: () => {},
    onNewNotification: () => {},
  };

  const config = {
    ...defaultConfigs,
    ...props,
  };

  // states
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number | undefined>();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [oldestNotificationDate, setOldestNotificationDate] = useState<string>(
    new Date().toISOString()
  );
  const [loadingNotifications, setLoadingNotifications] =
    useState<boolean>(false);

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

  const fetchNotificationsBeforeDate = async (
    count: number,
    before: string
  ): Promise<{
    notifications: any[];
    couldLoadMore: boolean;
    nextBefore: string;
  }> => {
    let result: any[] = [];
    let couldLoadMore = true;
    let nextBefore = before;
    do {
      const notis = await getNotifications(
        count,
        new Date(nextBefore).getTime()
      );
      const notisWithoutDuplicates = notis.filter(
        (n: any) => !result.find((nn) => nn.id === n.id)
      );
      nextBefore = notisWithoutDuplicates.reduce(
        (min: string, n: any) => (min < n.date ? min : n.date),
        oldestNotificationDate
      );
      result = [...result, ...notisWithoutDuplicates];

      couldLoadMore = notisWithoutDuplicates.length > 0;
    } while (couldLoadMore && result.length < count);
    return {
      notifications: result,
      couldLoadMore,
      nextBefore,
    };
  };

  const loadMoreNotifications = async () => {
    if (!hasMore) return;
    if (loadingNotifications) return;
    setLoadingNotifications(true);
    const res = await fetchNotificationsBeforeDate(
      1000,
      oldestNotificationDate
    );
    setOldestNotificationDate(res.nextBefore);
    setHasMore(res.couldLoadMore);
    addNotificationsToState(res.notifications);
    setLoadingNotifications(false);
  };

  useEffect(() => {
    loadMoreNotifications();

    const websocket = new WebSocket(
      `${context.wsURL}?userId=${context.userId}&envId=${context.clientId}`
    );

    websocket.onopen = () => config.onWebsocketConnected();
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

  const Notification = ({ notification }: { notification: any }) => {
    return (
      <NotificationDiv
        seen={notification.seen}
        redirect={notification.redirectURL}
        style={{
          padding: "16px 6px 16px 0",
          background: "#fff",
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div>
          <Avatar
            src={notification.imageURL}
            size="large"
            style={{
              marginRight: 8,
            }}
            shape={config.imageShape}
          />
        </div>

        <div
          style={{
            flexGrow: 1,
          }}
        >
          <Typography.Text>{notification.title}</Typography.Text>
        </div>

        <Badge
          dot
          style={{
            marginRight: 6,
            marginTop: 6,
          }}
        />
      </NotificationDiv>
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

  const Inbox = (notifications: any[]) => {
    return (
      <div
        style={{
          width: config.width,
          borderRadius: 8,
          background: "#fff",
          padding: config.type === Type.INLINE ? 12 : 0,
        }}
      >
        {config.pagination === "INFINITE_SCROLL" ? (
          <List header={<InboxHeader />} dataSource={notifications}>
            <VirtualList
              data={notifications}
              height={config.maxHeight}
              itemHeight={47}
              itemKey="id"
              onScroll={(e) => {
                // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
                if (
                  Math.abs(
                    e.currentTarget.scrollHeight -
                      e.currentTarget.scrollTop -
                      config.maxHeight
                  ) <= 1
                ) {
                  loadMoreNotifications();
                }
              }}
            >
              {(n: any) => (
                <List.Item key={n.id} style={{ padding: 0 }}>
                  <Notification notification={n} />
                </List.Item>
              )}
            </VirtualList>
          </List>
        ) : (
          <List
            header={<InboxHeader />}
            dataSource={notifications}
            renderItem={(n: any) => (
              <List.Item key={n.id} style={{ padding: 0 }}>
                <Notification notification={n} />
              </List.Item>
            )}
            pagination={{
              pageSize: config.pageSize,
              align: "center",
              position: config.pagePosition,
              showSizeChanger: false,
              simple: true,
              onChange(page, pageSize) {
                if (page >= Math.floor(notifications.length / pageSize)) {
                  loadMoreNotifications();
                }
              },
            }}
          ></List>
        )}
      </div>
    );
  };

  const UnreadCount: React.FunctionComponent<PropsWithChildren> = (props) => {
    return (
      <Badge count={unreadCount} size="small" offset={config.unreadCountOffset}>
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
        {config.type === Type.CORNER ? (
          <div
            style={{
              position: "fixed",
              right: 16,
              bottom: 16,
            }}
          >
            <UnreadCount>
              <Button
                style={{
                  width: config.buttonWidth,
                  height: config.buttonHeight,
                }}
                icon={
                  <BellOutlined
                    style={{
                      fontSize: config.buttonHeight / 3,
                    }}
                  />
                }
                shape="circle"
              />
            </UnreadCount>
          </div>
        ) : config.type === Type.POPUP ? (
          <div
            style={{
              display: "inline-block",
            }}
          >
            <UnreadCount>
              <Button
                icon={
                  <BellOutlined
                    style={{
                      fontSize: config.buttonHeight / 2,
                    }}
                  />
                }
                style={{
                  width: config.buttonWidth,
                  height: config.buttonHeight,
                }}
                shape="circle"
                type="text"
              />
            </UnreadCount>
          </div>
        ) : null}
      </Popover>

      {config.type === Type.INLINE && <div>{Inbox(notifications)}</div>}
    </div>
  );
}
