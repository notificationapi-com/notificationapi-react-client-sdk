import { CheckOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Typography } from 'antd';
import { styled } from 'styled-components';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';
import { InappNotification } from '../Provider';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

export enum ImageShape {
  square = 'square',
  circle = 'circle'
}

const NotificationDiv = styled.div<{
  $redirect: boolean;
  $seen: boolean;
  $archived: boolean;
}>`
  cursor: ${(props) => (props.$redirect ? 'pointer' : 'default')};

  &:hover {
    background: #eee !important;
  }

  & .notification-archive-button {
    visibility: hidden;
    transition: visibility 0s;
  }

  &:hover .notification-archive-button {
    visibility: ${(props) => (props.$archived ? 'hidden' : 'visible')};
  }
`;

export const Notification = (props: {
  notification: InappNotification;
  markAsArchived: (ids: string[] | 'ALL') => void;
  markAsClicked: (id: string) => void;
  imageShape: keyof typeof ImageShape;
}) => {
  return (
    <NotificationDiv
      $redirect={props.notification.redirectURL ? true : false}
      $seen={props.notification.seen || props.notification.opened}
      $archived={props.notification.archived}
      onClick={() => {
        props.markAsClicked(props.notification.id);
        if (props.notification.redirectURL) {
          window.location.href = props.notification.redirectURL;
        }
      }}
      style={{
        padding: '16px 6px 16px 0',
        background: '#fff',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <div>
        <Avatar
          src={props.notification.imageURL}
          size="large"
          style={{
            marginRight: 8,
            marginLeft: 12
          }}
          shape={props.imageShape}
        />
      </div>

      <div
        style={{
          flexGrow: 1
        }}
      >
        <div>
          <Typography.Text>{props.notification.title}</Typography.Text>
        </div>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            <ReactTimeAgo
              date={new Date(props.notification.date).getTime()}
              locale="en-US"
            />
          </Typography.Text>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          width: 48,
          height: 32,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Button
          className="notification-archive-button"
          icon={<CheckOutlined />}
          size="small"
          type="text"
          shape="circle"
          onClick={(e) => {
            props.markAsArchived([props.notification.id]);
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
        />
        <Badge
          dot
          className="notification-highlight"
          style={{
            visibility: props.notification.archived ? 'hidden' : 'visible',
            marginRight: 10,
            marginLeft: 8,
            marginTop: 6,
            right: 0
          }}
        />
      </div>
    </NotificationDiv>
  );
};
