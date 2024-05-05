import { PropsWithChildren, useContext } from "react";
import { UnreadBadge, UnreadBadgeProps } from "./UnreadBadge";
import { NotificationAPIContext } from "../Provider";

export type NotificationCounterProps = Omit<UnreadBadgeProps, "count">;

export const NotificationCounter: React.FC<
  PropsWithChildren<NotificationCounterProps>
> = (props) => {
  const context = useContext(NotificationAPIContext);

  return (
    <UnreadBadge
      {...props}
      count={context?.notifications.filter((n) => !n.seen).length}
    ></UnreadBadge>
  );
};
