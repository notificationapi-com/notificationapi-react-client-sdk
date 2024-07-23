import { CheckOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Typography } from "antd";
import { styled } from "styled-components";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";
import { Liquid } from "liquidjs";
import { InAppNotification } from "@notificationapi/core/dist/interfaces";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

export enum ImageShape {
  square = "square",
  circle = "circle",
}

const NotificationDiv = styled.div<{
  $redirect: boolean;
  $seen: boolean;
  $archived: boolean;
}>`
  cursor: ${(props) => (props.$redirect ? "pointer" : "default")};

  &:hover {
    background: #eee !important;
  }

  & .notification-archive-button {
    visibility: hidden;
    transition: visibility 0s;
  }

  &:hover .notification-archive-button {
    visibility: ${(props) => (props.$archived ? "hidden" : "visible")};
  }
`;

export type NotificationProps = {
  notifications: InAppNotification[];
  markAsArchived: (ids: string[] | "ALL") => void;
  markAsClicked: (ids: string[]) => void;
  imageShape: keyof typeof ImageShape;
  renderer?: (notification: InAppNotification[]) => JSX.Element;
};

export const Notification = (props: NotificationProps) => {
  if (props.renderer) {
    return props.renderer(props.notifications);
  }

  const liquid = new Liquid();
  const groupSize = props.notifications.length;
  const lastNotification = props.notifications[groupSize - 1];
  const template = lastNotification.deliveryOptions?.["instant"]?.batching
    ? lastNotification.template?.batch
    : lastNotification.template?.instant;
  let parameters: {
    [key: string]: unknown;
    _items: unknown[];
  } = { _items: [] };

  props.notifications.forEach((n) => {
    parameters = {
      ...parameters,
      ...n.parameters,
    };
  });

  parameters._items = props.notifications.map((n) => {
    return { ...n.parameters, _items: undefined };
  });

  const title = liquid.parseAndRenderSync(template?.title ?? "", parameters);
  const redirectURL = liquid.parseAndRenderSync(
    template?.redirectURL ?? "",
    parameters
  );
  const imageURL = liquid.parseAndRenderSync(
    template?.imageURL ?? "",
    parameters
  );
  const seen = props.notifications.every((n) => n.seen);
  const opened = props.notifications.every((n) => n.opened);
  const archived = props.notifications.every((n) => n.archived);
  const date = props.notifications[groupSize - 1].date;
  const ids = props.notifications.map((n) => n.id);

  return (
    <NotificationDiv
      $redirect={redirectURL ? true : false}
      $seen={seen || (opened ? true : false)}
      $archived={archived ? true : false}
      onClick={() => {
        props.markAsClicked(ids);
        if (redirectURL) {
          window.location.href = redirectURL;
        }
      }}
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
          src={imageURL}
          size="large"
          style={{
            marginRight: 8,
            marginLeft: 12,
          }}
          shape={props.imageShape}
        />
      </div>

      <div
        style={{
          flexGrow: 1,
        }}
      >
        <div>
          <Typography.Text
            style={{
              whiteSpace: "pre-line",
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: title as string }}></span>
          </Typography.Text>
        </div>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            <ReactTimeAgo date={new Date(date).getTime()} locale="en-US" />
          </Typography.Text>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: 48,
          height: 32,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          className="notification-archive-button"
          icon={<CheckOutlined />}
          size="small"
          type="text"
          shape="circle"
          onClick={(e) => {
            props.markAsArchived(ids);
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
        />
        <Badge
          dot
          className="notification-highlight"
          style={{
            visibility: archived ? "hidden" : "visible",
            marginRight: 10,
            marginLeft: 8,
            marginTop: 6,
            right: 0,
          }}
        />
      </div>
    </NotificationDiv>
  );
};
