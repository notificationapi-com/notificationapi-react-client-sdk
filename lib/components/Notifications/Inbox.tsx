import { Empty, List, notification } from "antd";
import { InboxHeader } from "./InboxHeader";
import VirtualList from "rc-virtual-list";
import { Notification } from "./Notification";
import { NotificationAPIContext } from "../Provider";
import { useContext } from "react";
import { Filter, NotificationPopupProps } from "./NotificationPopup";

export enum Pagination {
  INFINITE_SCROLL = "infinite_scroll",
  PAGINATED = "paginated",
}

type InboxProps = {
  pagination: keyof typeof Pagination;
  maxHeight: number;
  filter: NotificationPopupProps["filter"];
  imageShape: NotificationPopupProps["imageShape"];
  pageSize: number;
  pagePosition: NotificationPopupProps["pagePosition"];
};

export const Inbox: React.FC<InboxProps> = (props) => {
  const context = useContext(NotificationAPIContext);

  const filterFunction = (notifications: any[]) => {
    if (props.filter === Filter.ALL || !props.filter) {
      return notifications;
    } else if (props.filter === Filter.UNARCHIVED) {
      return notifications.filter((n) => !n.archived);
    } else {
      return notifications.filter(props.filter);
    }
  };

  if (!context) {
    return null;
  }

  return (
    <div>
      {props.pagination === "INFINITE_SCROLL" ? (
        <List
          header={<InboxHeader markAsArchived={context.markAsArchived} />}
          dataSource={filterFunction(context.notifications)}
        >
          {filterFunction(context.notifications).length === 0 && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="You are caught up!"
            />
          )}
          <VirtualList
            data={filterFunction(context.notifications)}
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
            {(n: any) => (
              <List.Item key={n.id} style={{ padding: 0 }}>
                <Notification
                  imageShape={props.imageShape}
                  markAsArchived={context.markAsArchived}
                  notification={n}
                  markAsClicked={context.markAsClicked}
                />
              </List.Item>
            )}
          </VirtualList>
        </List>
      ) : (
        <List
          header={<InboxHeader markAsArchived={context.markAsArchived} />}
          dataSource={filterFunction(context.notifications)}
          renderItem={(n: any) => (
            <List.Item key={n.id} style={{ padding: 0 }}>
              <Notification
                imageShape={props.imageShape}
                markAsArchived={context.markAsArchived}
                notification={n}
                markAsClicked={context.markAsClicked}
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
              if (page >= Math.floor(context.notifications.length / pageSize)) {
                context.loadNotifications();
              }
            },
          }}
        >
          {filterFunction(context.notifications).length === 0 && (
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
