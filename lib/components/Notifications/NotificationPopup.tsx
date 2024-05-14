import { Button, Popover } from "antd";
import { Inbox, Pagination } from "./Inbox";
import { BellOutlined } from "@ant-design/icons";
import { COUNTING_TYPE, UnreadBadge, UnreadBadgeProps } from "./UnreadBadge";
import { ImageShape } from "./Notification";
import { NotificationAPIContext } from "../Provider";
import { useContext } from "react";

export type NotificationPopupProps = {
  buttonIconSize?: number;
  buttonWidth?: number;
  buttonHeight?: number;
  popupWidth?: number | string;
  popupHeight?: number | string;
  imageShape?: keyof typeof ImageShape;
  pagination?: keyof typeof Pagination;
  pageSize?: number;
  pagePosition?: "top" | "bottom";
  style?: React.CSSProperties;
  unreadBadgeProps?: UnreadBadgeProps;
  counting?: keyof typeof COUNTING_TYPE | ((notifications: any[]) => number);
};

export const NotificationPopup: React.FC<NotificationPopupProps> = (props) => {
  const config: Required<NotificationPopupProps> = {
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
    style: props.style || {},
    unreadBadgeProps: props.unreadBadgeProps ?? {},
    counting: props.counting || "COUNT_NOT_OPENED",
  };

  const context = useContext(NotificationAPIContext);

  return (
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
        <UnreadBadge
          {...props.unreadBadgeProps}
          style={{
            top: 5,
            right: 5,
          }}
        >
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
            type="text"
          />
        </UnreadBadge>
      </div>
    </Popover>
  );
};
