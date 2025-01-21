import styled from '@emotion/styled';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';
import { Liquid } from 'liquidjs';
import { InAppNotification } from '@notificationapi/core/dist/interfaces';
import { ReactElement, ReactNode } from 'react';
import { Avatar, Badge, IconButton, Typography } from '@mui/material';
import { Check } from '@mui/icons-material';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

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

export type NotificationProps = {
  notifications: InAppNotification[];
  markAsArchived: (ids: string[] | 'ALL') => void;
  markAsClicked: (ids: string[]) => void;
  renderer?: (notification: InAppNotification[]) => ReactNode;
};

export const Notification = (props: NotificationProps) => {
  if (props.renderer) {
    return props.renderer(props.notifications) as ReactElement;
  }

  const liquid = new Liquid();
  const groupSize = props.notifications.length;
  const lastNotification = props.notifications[groupSize - 1];
  const template = lastNotification.deliveryOptions?.['instant']?.batching
    ? lastNotification.template?.batch
    : lastNotification.template?.instant;
  let parameters: {
    [key: string]: unknown;
    _items: unknown[];
  } = { _items: [] };

  props.notifications.forEach((n) => {
    parameters = {
      ...parameters,
      ...n.parameters
    };
  });

  parameters._items = props.notifications.map((n) => {
    return { ...n.parameters, _items: undefined };
  });

  const title = liquid.parseAndRenderSync(template?.title ?? '', parameters);
  const redirectURL = liquid.parseAndRenderSync(
    template?.redirectURL ?? '',
    parameters
  );
  const imageURL = liquid.parseAndRenderSync(
    template?.imageURL ?? '',
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
          src={imageURL}
          sizes="32"
          style={{
            marginRight: 8,
            marginLeft: 12
          }}
        />
      </div>

      <div
        style={{
          flexGrow: 1
        }}
      >
        <div>
          <Typography
            variant="body2"
            fontWeight={archived ? 300 : 400}
            style={{
              whiteSpace: 'pre-line'
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: title as string }}></span>
          </Typography>
        </div>
        <div>
          <Typography variant="body2" fontWeight={300} style={{ fontSize: 12 }}>
            <ReactTimeAgo date={new Date(date).getTime()} locale="en-US" />
          </Typography>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          width: 52,
          height: 32,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <IconButton
          className="notification-archive-button"
          size="small"
          onClick={(e) => {
            props.markAsArchived(ids);
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
        >
          <Check fontSize="small" />
        </IconButton>
        <Badge
          variant="dot"
          color="error"
          className="notification-highlight"
          style={{
            visibility: archived ? 'hidden' : 'visible',
            marginRight: 0,
            marginLeft: 12,
            marginTop: 6,
            bottom: 2,
            right: 0
          }}
        />
      </div>
    </NotificationDiv>
  );
};
