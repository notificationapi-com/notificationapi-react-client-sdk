import { PropsWithChildren } from "react";
import { UnreadBadge, UnreadBadgeProps } from "./UnreadBadge";

export type NotificationCounterProps = Omit<UnreadBadgeProps, "count">;

export const NotificationCounter: React.FC<
  PropsWithChildren<NotificationCounterProps>
> = (props) => {
  return <UnreadBadge {...props}></UnreadBadge>;
};
