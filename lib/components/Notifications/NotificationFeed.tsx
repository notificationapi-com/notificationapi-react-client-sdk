import { Inbox, Pagination } from "./Inbox";
import { ImageShape } from "./Notification";

export type NotificationFeedProps = {
  imageShape?: keyof typeof ImageShape;
  pagination?: keyof typeof Pagination;
  pageSize?: number;
  pagePosition?: "top" | "bottom";
  infiniteScrollHeight?: number;
  style?: React.CSSProperties;
};

export const NotificationFeed: React.FC<NotificationFeedProps> = (props) => {
  const pagination = props.pagination || "INFINITE_SCROLL";
  const infiniteScrollHeight = props.infiniteScrollHeight
    ? props.infiniteScrollHeight
    : window.innerHeight * 0.75;

  return (
    <div
      style={{
        padding: 12,
        boxSizing: "border-box",
        background: "#fff",
        ...props.style,
      }}
    >
      <Inbox maxHeight={infiniteScrollHeight} pagination={pagination} />
    </div>
  );
};
