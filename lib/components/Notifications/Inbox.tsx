import { Empty, List } from "antd";
import { InboxHeader, InboxHeaderProps } from "./InboxHeader";
import VirtualList from "rc-virtual-list";
import { ImageShape, Notification } from "./Notification";
import { NotificationAPIContext } from "../Provider";
import { useContext } from "react";
import { Filter, NotificationPopupProps } from "./NotificationPopup";
import { Liquid } from "liquidjs";
import { InAppNotification } from "@notificationapi/core/dist/interfaces";

export enum Pagination {
  INFINITE_SCROLL = "infinite_scroll",
  PAGINATED = "paginated",
}

export type InboxProps = {
  pagination: keyof typeof Pagination;
  maxHeight: number;
  filter: NotificationPopupProps["filter"];
  imageShape: keyof typeof ImageShape;
  pageSize: number;
  pagePosition: NotificationPopupProps["pagePosition"];
  notificationRenderer:
    | ((notification: InAppNotification[]) => JSX.Element)
    | undefined;
  header?: InboxHeaderProps;
};

export const Inbox: React.FC<InboxProps> = (props) => {
  const context = useContext(NotificationAPIContext);
  if (!context) {
    return null;
  }

  const filterFunction = (notifications: InAppNotification[]) => {
    if (props.filter === Filter.ALL || !props.filter) {
      return notifications;
    } else if (props.filter === Filter.UNARCHIVED) {
      return notifications.filter((n) => !n.archived);
    } else {
      return notifications.filter(props.filter);
    }
  };

  if (context.notifications === undefined) return null;

  const filteredNotifications = filterFunction(context.notifications);
  const sortedNotifications = filteredNotifications.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  const batchedNotifications: Record<string, InAppNotification[]> = {};
  const liquid = new Liquid();
  sortedNotifications.forEach((n) => {
    if (n.deliveryOptions?.["instant"]?.batching) {
      const batchingKey = n.deliveryOptions["instant"].batchingKey;
      const batchingKeyValue = batchingKey
        ? liquid.parseAndRenderSync(`{{${batchingKey}}}`, n)
        : "";
      const groupKey = `${n.notificationId}-${batchingKeyValue}`;
      if (batchedNotifications[groupKey]) {
        batchedNotifications[groupKey].push(n);
      } else {
        batchedNotifications[groupKey] = [n];
      }
    } else {
      const groupKey = n.id;
      batchedNotifications[groupKey] = [n];
    }
  });

  const orderedNotifications = Object.values(batchedNotifications).sort(
    (a, b) => {
      return (
        new Date(b[b.length - 1].date).getTime() -
        new Date(a[a.length - 1].date).getTime()
      );
    }
  );

  return (
    <div>
      {props.pagination === "INFINITE_SCROLL" ? (
        <List
          header={
            <InboxHeader
              title={props.header?.title}
              button1ClickHandler={props.header?.button1ClickHandler}
              button2ClickHandler={props.header?.button2ClickHandler}
            />
          }
          dataSource={orderedNotifications}
        >
          {orderedNotifications.length === 0 && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="You are caught up!"
            />
          )}
          <VirtualList
            data={orderedNotifications}
            height={props.maxHeight}
            itemHeight={47}
            itemKey="id"
            onScroll={(e) => {
              // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
              if (
                Math.abs(
                  e.currentTarget.scrollHeight -
                    e.currentTarget.scrollTop -
                    props.maxHeight
                ) <= 1
              ) {
                context.loadNotifications();
              }
            }}
          >
            {(n) => (
              <List.Item key={n[0].id} style={{ padding: 0 }}>
                <Notification
                  imageShape={props.imageShape}
                  markAsArchived={context.markAsArchived}
                  notifications={n}
                  markAsClicked={context.markAsClicked}
                  renderer={props.notificationRenderer}
                />
              </List.Item>
            )}
          </VirtualList>
        </List>
      ) : (
        <List
          header={
            <InboxHeader
              title={props.header?.title}
              button1ClickHandler={props.header?.button1ClickHandler}
              button2ClickHandler={props.header?.button2ClickHandler}
            />
          }
          dataSource={orderedNotifications}
          renderItem={(n) => (
            <List.Item key={n[0].id} style={{ padding: 0 }}>
              <Notification
                imageShape={props.imageShape}
                markAsArchived={context.markAsArchived}
                notifications={n}
                markAsClicked={context.markAsClicked}
                renderer={props.notificationRenderer}
              />
            </List.Item>
          )}
          pagination={{
            pageSize: props.pageSize,
            align: "center",
            position: props.pagePosition,
            showSizeChanger: false,
            simple: true,
            onChange(page, pageSize) {
              if (
                page >= Math.floor(context.notifications!.length / pageSize)
              ) {
                context.loadNotifications();
              }
            },
          }}
        >
          {orderedNotifications.length === 0 && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="You are caught up!"
            />
          )}
        </List>
      )}
    </div>
  );
};
