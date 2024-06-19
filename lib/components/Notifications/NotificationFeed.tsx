import { useContext, useEffect } from "react";
import { Inbox, Pagination } from "./Inbox";
import { ImageShape, NotificationProps } from "./Notification";
import { NotificationAPIContext } from "../Provider";
import { Filter } from "./NotificationPopup";
import { InAppNotification } from "../../interface";

export type NotificationFeedProps = {
  imageShape?: keyof typeof ImageShape;
  pagination?: keyof typeof Pagination;
  pageSize?: number;
  pagePosition?: "top" | "bottom";
  infiniteScrollHeight?: number;
  style?: React.CSSProperties;
  filter?: keyof typeof Filter | ((n: InAppNotification) => boolean);
  renderers?: {
    notification?: NotificationProps["renderer"];
  };
  header?: {
    title?: JSX.Element;
  };
};

export const NotificationFeed: React.FC<NotificationFeedProps> = (props) => {
  const config: Required<NotificationFeedProps> = {
    imageShape: props.imageShape || "circle",
    pagination: props.pagination || "INFINITE_SCROLL",
    pageSize: props.pageSize || 10,
    pagePosition: props.pagePosition || "top",
    style: props.style || {},
    filter: props.filter || Filter.ALL,
    infiniteScrollHeight: props.infiniteScrollHeight
      ? props.infiniteScrollHeight
      : window.innerHeight * 0.75,
    renderers: {
      notification: props.renderers?.notification,
    },
    header: {
      title: props.header?.title,
    },
  };

  const context = useContext(NotificationAPIContext);

  if (!context) {
    return null;
  }

  // every 5 seconds
  useEffect(() => {
    context.markAsOpened();
    const interval = setInterval(() => {
      context.markAsOpened();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: 12,
        boxSizing: "border-box",
        background: "#fff",
        ...props.style,
      }}
    >
      <Inbox
        maxHeight={config.infiniteScrollHeight}
        pagination={config.pagination}
        filter={config.filter}
        imageShape={config.imageShape}
        pageSize={config.pageSize}
        pagePosition={config.pagePosition}
        notificationRenderer={config.renderers.notification}
        header={config.header}
      />
    </div>
  );
};
