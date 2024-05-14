import { List } from "antd";
import { InboxHeader } from "./InboxHeader";
import VirtualList from "rc-virtual-list";
import { Notification } from "./Notification";
import { NotificationAPIContext } from "../Provider";
import { useContext } from "react";

export enum Pagination {
  INFINITE_SCROLL = "infinite_scroll",
  PAGINATED = "paginated",
}

type InboxProps = {
  pagination: keyof typeof Pagination;
  maxHeight: number;
};

export const Inbox: React.FC<InboxProps> = (props) => {
  const context = useContext(NotificationAPIContext);

  if (!context) {
    return null;
  }

  return (
    <div>
      {props.pagination === "INFINITE_SCROLL" ? (
        <List
          header={<InboxHeader markAsArchived={context.markAsArchived} />}
          dataSource={context.notifications}
        >
          <VirtualList
            data={context.notifications}
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
                />
              </List.Item>
            )}
          </VirtualList>
        </List>
      ) : (
        <List
          header={<InboxHeader {...props} />}
          dataSource={context.notifications}
          renderItem={(n: any) => (
            <List.Item key={n.id} style={{ padding: 0 }}>
              <Notification
                imageShape={props.imageShape}
                markAsArchived={context.markAsArchived}
                notification={n}
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
              if (page >= Math.floor(props.notifications.length / pageSize)) {
                context.loadNotifications();
              }
            },
          }}
        ></List>
      )}
    </div>
  );
};
