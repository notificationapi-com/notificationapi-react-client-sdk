import { Badge } from "antd";
import { PropsWithChildren, useContext } from "react";
import { NotificationAPIContext } from "../Provider";

export type UnreadBadgeProps = {
  color?:
    | "blue"
    | "purple"
    | "cyan"
    | "green"
    | "magenta"
    | "pink"
    | "red"
    | "orange"
    | "yellow"
    | "volcano"
    | "geekblue"
    | "lime"
    | "gold"
    | undefined;
  overflowCount?: number;
  dot?: boolean;
  showZero?: boolean;
  size?: "default" | "small";
  style?: React.CSSProperties;
  counting?: keyof typeof COUNTING_TYPE | ((notifications: any[]) => number);
};

export enum COUNTING_TYPE {
  COUNT_UNSEEN_NOTIFICATIONS = "COUNT_UNSEEN_NOTIFICATIONS",
  COUNT_UNTOUCHED_NOTIFICATIONS = "COUNT_UNTOUCHED_NOTIFICATIONS",
}

export const UnreadBadge: React.FunctionComponent<
  PropsWithChildren<UnreadBadgeProps>
> = (props) => {
  const context = useContext(NotificationAPIContext);

  const countingFunction = (notifications: any[]) => {
    if (
      props.counting === "COUNT_UNSEEN_NOTIFICATIONS" ||
      props.counting === undefined
    ) {
      return notifications.filter((n) => !n.opened && !n.seen).length;
    } else if (props.counting === "COUNT_UNTOUCHED_NOTIFICATIONS") {
      return notifications.filter(
        (n) =>
          !n.archived &&
          !n.clicked &&
          !n.replied &&
          !n.actioned1 &&
          !n.actioned2
      ).length;
    } else {
      return props.counting(notifications);
    }
  };

  return (
    <Badge
      count={countingFunction(context?.notifications || [])}
      color={props.color}
      overflowCount={props.overflowCount}
      dot={props.dot}
      showZero={props.showZero}
      size={props.size}
      style={{
        ...props.style,
      }}
    >
      {props.children}
    </Badge>
  );
};
