import { Badge } from "antd";
import { PropsWithChildren } from "react";

export type UnreadBadgeProps = {
  count?: number;
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
};

export const UnreadBadge: React.FunctionComponent<
  PropsWithChildren<UnreadBadgeProps>
> = (props) => {
  return (
    <Badge
      count={props.count}
      color={props.color}
      overflowCount={props.overflowCount}
      dot={props.dot}
      showZero={props.showZero}
      size={props.size}
    >
      {props.children}
    </Badge>
  );
};
