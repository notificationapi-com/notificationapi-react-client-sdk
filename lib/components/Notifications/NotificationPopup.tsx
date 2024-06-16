import { Button, Popover } from "antd";
import { Inbox, Pagination } from "./Inbox";
import { BellOutlined } from "@ant-design/icons";
import { UnreadBadge, UnreadBadgeProps } from "./UnreadBadge";
import { ImageShape, NotificationProps } from "./Notification";
import { NotificationAPIContext } from "../Provider";
import { useContext } from "react";
import { InAppNotification } from "../../interface";

export enum Filter {
  ALL = "ALL",
  UNARCHIVED = "UNARCHIVED",
}

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
  count?: UnreadBadgeProps["count"];
  filter?: keyof typeof Filter | ((n: InAppNotification) => boolean);
  renderers?: {
    notification?: NotificationProps["renderer"];
  };
};

export const NotificationPopup: React.FC<NotificationPopupProps> = (props) => {
  const context = useContext(NotificationAPIContext);

  if (!context) {
    return null;
  }

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
    count: props.count || "COUNT_UNOPENED_NOTIFICATIONS",
    filter: props.filter || Filter.ALL,
    renderers: {
      notification: props.renderers?.notification,
    },
  };

  return (
    <Popover
      autoAdjustOverflow
      trigger="click"
      content={
        <Inbox
          maxHeight={500}
          pagination={config.pagination}
          filter={config.filter}
          imageShape={config.imageShape}
          pageSize={config.pageSize}
          pagePosition={config.pagePosition}
          notificationRenderer={config.renderers.notification}
        />
      }
      onOpenChange={(visible) => {
        if (visible) {
          context.markAsOpened();
        }
      }}
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
          count={config.count}
          filter={config.filter}
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
