import React from "react";
import { Badge } from "antd";
import { PropsWithChildren, useContext } from "react";
import { NotificationAPIContext } from "../Provider";
import { NotificationPopupProps } from "./NotificationPopup";

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
  count?: keyof typeof COUNT_TYPE | ((notification: any) => boolean);
  filter?: NotificationPopupProps["filter"];
};

export enum COUNT_TYPE {
  COUNT_UNOPENED_NOTIFICATIONS = "COUNT_UNOPENED_NOTIFICATIONS",
  COUNT_UNARCHIVED_NOTIFICATIONS = "COUNT_UNARCHIVED_NOTIFICATIONS",
}

export const UnreadBadge: React.FunctionComponent<
  PropsWithChildren<UnreadBadgeProps>
> = (props) => {
  const context = useContext(NotificationAPIContext);

  const countingFunction = (notifications: any[]) => {
    if (
      props.count === "COUNT_UNOPENED_NOTIFICATIONS" ||
      props.count === undefined
    ) {
      return notifications.filter((n) => !n.opened && !n.seen).length;
    } else if (props.count === "COUNT_UNARCHIVED_NOTIFICATIONS") {
      return notifications.filter(
        (n) =>
          !n.archived &&
          !n.clicked &&
          !n.replied &&
          !n.actioned1 &&
          !n.actioned2
      ).length;
    } else {
      return notifications.filter(props.count).length;
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
