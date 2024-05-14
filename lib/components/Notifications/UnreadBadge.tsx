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
  counting?: keyof typeof COUNTING_TYPE | ((notifications: any[]) => number);
  style?: React.CSSProperties;
};

export enum COUNTING_TYPE {
  COUNT_NOT_OPENED = "count_not_opened",
  COUNT_NOT_RESOLVED = "count_not_resolved",
}

export const UnreadBadge: React.FunctionComponent<
  PropsWithChildren<UnreadBadgeProps>
> = (props) => {
  const context = useContext(NotificationAPIContext);

  const countingFunction = (notifications: any[]) => {
    if (props.counting === "COUNT_NOT_OPENED" || props.counting === undefined) {
      return notifications.filter((n) => !n.opened && !n.seen).length;
    } else if (props.counting === "COUNT_NOT_RESOLVED") {
      return notifications.filter((n) => !n.resolved).length;
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
