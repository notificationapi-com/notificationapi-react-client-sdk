import { CheckOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Typography } from "antd";
import { styled } from "styled-components";

export enum ImageShape {
  square = "square",
  circle = "circle",
}

const NotificationDiv = styled.div<{
  $redirect: boolean;
}>`
  cursor: ${(props) => (props.$redirect ? "pointer" : "default")};

  &:hover {
    background: #eee !important;
  }

  &:hover .notification-highlight {
    display: none;
  }

  & .notification-action {
    display: none;
  }

  &:hover .notification-action {
    display: flex;
  }
`;

export const Notification = (props: {
  notification: any;
  markAsRead: (id: string) => void;
  imageShape: keyof typeof ImageShape;
}) => {
  return (
    <NotificationDiv
      $redirect={props.notification.redirectURL ? true : false}
      style={{
        padding: "16px 6px 16px 0",
        background: "#fff",
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div>
        <Avatar
          src={props.notification.imageURL}
          size="large"
          style={{
            marginRight: 8,
          }}
          shape={props.imageShape}
        />
      </div>

      <div
        style={{
          flexGrow: 1,
        }}
      >
        <Typography.Text>{props.notification.title}</Typography.Text>
      </div>

      <div
        style={{
          position: "relative",
        }}
      >
        <Badge
          dot
          className="notification-highlight"
          style={{
            display: props.notification.seen ? "none" : "block",
            marginRight: 12,
            marginTop: 7,
          }}
        />
        <div
          className="notification-action"
          style={{
            position: "absolute",
            top: "calc(50% - 9px)",
            right: 0,
          }}
        >
          <Button
            icon={<CheckOutlined />}
            size="small"
            type="text"
            shape="circle"
            onClick={() => {
              props.markAsRead(props.notification.id);
            }}
          />
        </div>
      </div>
    </NotificationDiv>
  );
};
