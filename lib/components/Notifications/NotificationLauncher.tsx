import { Button, Popover } from "antd";
import { Inbox } from "./Inbox";
import { BellOutlined } from "@ant-design/icons";
import { UnreadBadge } from "./UnreadBadge";
import { NotificationPopupProps } from "./NotificationPopup";

export enum Position {
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right",
}

type NotificationLaucherProps = NotificationPopupProps & {
  position?: keyof typeof Position;
  offsetX?: number | string;
  offsetY?: number | string;
};

export const NotificationLauncher: React.FC<NotificationLaucherProps> = (
  props
) => {
  const config: Required<NotificationLaucherProps> = {
    buttonWidth: props.buttonWidth || 40,
    buttonHeight: props.buttonHeight || 40,
    popupWidth: props.popupWidth || 400,
    popupHeight: props.popupHeight || 600,
    buttonIconSize:
      props.buttonIconSize || (props.buttonWidth ? props.buttonWidth / 2 : 20),
    imageShape: props.imageShape || "circle",
    pagination: props.pagination || "INFINITE_SCROLL",
    pageSize: props.pageSize || 10,
    pagePosition: props.pagePosition || "top",
    style: {
      zIndex: 999,
      ...props.style,
    },
    unreadBadgeProps: props.unreadBadgeProps ?? {},
    offsetX: props.offsetX || 16,
    offsetY: props.offsetY || 16,
    position: props.position || "BOTTOM_RIGHT",
  };

  return (
    <div
      style={{
        position: "fixed",
        right: config.offsetX,
        bottom: config.offsetY,
        ...config.style,
      }}
    >
      <Popover
        autoAdjustOverflow
        trigger="click"
        content={<Inbox maxHeight={500} pagination={config.pagination} />}
        arrow={false}
        overlayStyle={{
          padding: "0 16px",
          minWidth: config.popupWidth,
        }}
      >
        <div
          style={{
            display: "inline-block",
          }}
        >
          <UnreadBadge {...props.unreadBadgeProps}>
            <Button
              icon={
                <BellOutlined
                  style={{
                    fontSize: config.buttonIconSize,
                  }}
                />
              }
              style={{
                width: config.buttonWidth,
                height: config.buttonHeight,
              }}
              shape="circle"
              type="default"
            />
          </UnreadBadge>
        </div>
      </Popover>
    </div>
  );
};
