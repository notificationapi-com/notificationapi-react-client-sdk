import { ReactElement, ReactNode } from 'react';
import { Liquid } from 'liquidjs';
import { InAppNotification } from '@notificationapi/core/dist/interfaces';
import { Avatar, Badge, IconButton, Typography, useTheme } from '@mui/material';
import { Check } from '@mui/icons-material';
import styled from '@emotion/styled';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';
import { getThemeColors } from '../../utils/theme';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

const NotificationDiv = styled.div<{
  $redirect: boolean;
  $seen: boolean;
  $archived: boolean;
  $hoverBackground: string;
}>`
  cursor: ${(props) => (props.$redirect ? 'pointer' : 'default')};

  &:hover {
    background: ${(props) => props.$hoverBackground} !important;
    border-radius: 8px !important;
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
  imageShape?: 'circle' | 'square';
  newTab?: boolean;
};

export const Notification = (props: NotificationProps) => {
  const theme = useTheme();
  const themeColors = getThemeColors(theme);

  if (props.renderer) {
    return props.renderer(props.notifications) as ReactElement;
  }

  const liquid = new Liquid();
  const groupSize = props.notifications.length;
  const lastNotification = props.notifications[groupSize - 1];
  const template = lastNotification.deliveryOptions?.['instant']?.batching
    ? lastNotification.template?.batch
    : (lastNotification.template?.instant ?? {
        title: lastNotification.title,
        redirectURL: lastNotification.redirectURL,
        imageURL: lastNotification.imageURL
      }); // moving towards simplifying the template object (one set of title, redirectURL, imageURL vs. two)

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

  // Calculate hover background (slightly lighter/darker than paper)
  const hoverBackground =
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.04)';

  return (
    <NotificationDiv
      $redirect={redirectURL ? true : false}
      $seen={seen || (opened ? true : false)}
      $archived={archived ? true : false}
      $hoverBackground={hoverBackground}
      onClick={() => {
        props.markAsClicked(ids);
        if (redirectURL) {
          if (props.newTab) {
            window.open(redirectURL, '_blank');
          } else {
            window.location.href = redirectURL;
          }
        }
      }}
      style={{
        padding: '16px 6px 16px 0',
        background: themeColors.paper,
        color: themeColors.text,
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
          variant={props.imageShape === 'circle' ? 'circular' : 'rounded'}
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
              whiteSpace: 'pre-line',
              color: themeColors.text
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: title as string }}></span>
          </Typography>
        </div>
        <div>
          <Typography
            variant="body2"
            fontWeight={300}
            style={{
              fontSize: 12,
              color: themeColors.textSecondary
            }}
          >
            <ReactTimeAgo date={new Date(date).getTime()} locale="en-US" />
          </Typography>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          minWidth: 52,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 12
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
          style={{
            position: 'absolute',
            left: 0
          }}
        >
          <Check fontSize="small" />
        </IconButton>
        <Badge
          variant="dot"
          color="error"
          className="notification-highlight"
          style={{
            visibility: archived ? 'hidden' : 'visible'
          }}
        />
      </div>
    </NotificationDiv>
  );
};
