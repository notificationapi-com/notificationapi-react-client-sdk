import { PropsWithChildren } from "react";
import { UnreadBadge, UnreadBadgeProps } from "./UnreadBadge";

export type NotificationCounterProps = Omit<UnreadBadgeProps, "count"> & {
  counting?: UnreadBadgeProps["counting"];
};

export const NotificationCounter: React.FC<
  PropsWithChildren<NotificationCounterProps>
> = (props) => {
  const counting = props.counting || "COUNT_UNTOUCHED_NOTIFICATIONS";
  return <UnreadBadge {...props} counting={counting}></UnreadBadge>;
};
