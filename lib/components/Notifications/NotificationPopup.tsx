import React, { useContext, useState } from 'react';
import { Inbox } from './Inbox';
import { UnreadBadge, UnreadBadgeProps } from './UnreadBadge';
import { NotificationProps } from './Notification';
import { NotificationAPIContext } from '../Provider/context';
import { InAppNotification } from '@notificationapi/core/dist/interfaces';
import { NotificationPreferencesPopup } from '../Preferences';
import { InboxHeaderProps } from './InboxHeader';
import { Filter, Pagination } from './interface';
import { Divider, IconButton, Popover } from '@mui/material';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import WebPushOptInMessage from '../WebPush/WebPushOptInMessage';

export type NotificationPopupProps = {
  buttonIcon?: React.ReactNode;
  buttonIconSize?: number;
  buttonStyles?: React.CSSProperties;
  popupWidth?: number | string;
  popupHeight?: number;
  iconColor?: string;
  pagination?: keyof typeof Pagination;
  pageSize?: number;
  pagePosition?: 'top' | 'bottom';
  popupZIndex?: number;
  unreadBadgeProps?: UnreadBadgeProps;
  count?: UnreadBadgeProps['count'];
  filter?: keyof typeof Filter | ((n: InAppNotification) => boolean);
  renderers?: {
    notification?: NotificationProps['renderer'];
  };
  header?: InboxHeaderProps;
  popoverPosition?: {
    anchorOrigin?: {
      vertical: 'top' | 'center' | 'bottom';
      horizontal: 'left' | 'center' | 'right';
    };
  };
  newTab?: boolean;
};

export const NotificationPopup: React.FC<NotificationPopupProps> = (props) => {
  const [openPreferences, setOpenPreferences] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const context = useContext(NotificationAPIContext);

  if (!context) {
    return null;
  }

  const config: Required<NotificationPopupProps> = {
    buttonIcon: props.buttonIcon || (
      <NotificationsOutlined
        style={{
          fontSize: props.buttonIconSize || 20,
          color: props.iconColor || '#000000'
        }}
      />
    ),
    buttonStyles: {
      width: 40,
      height: 40,
      ...props.buttonStyles
    },
    popupWidth: props.popupWidth || 400,
    popupHeight: props.popupHeight || 600,
    buttonIconSize: props.buttonIconSize || 20,
    iconColor: props.iconColor || '#000000',
    pagination: props.pagination || 'INFINITE_SCROLL',
    pageSize: props.pageSize || 10,
    pagePosition: props.pagePosition || 'bottom',
    popupZIndex: props.popupZIndex || 1030,
    unreadBadgeProps: props.unreadBadgeProps ?? {},
    count: props.count || 'COUNT_UNOPENED_NOTIFICATIONS',
    filter: props.filter || Filter.ALL,
    header: {
      title: props.header?.title,
      button1ClickHandler:
        props.header?.button1ClickHandler ?? context.markAsArchived,
      button2ClickHandler:
        props.header?.button2ClickHandler ?? (() => setOpenPreferences(true))
    },
    renderers: {
      notification: props.renderers?.notification
    },
    popoverPosition: {
      anchorOrigin: {
        vertical: props.popoverPosition?.anchorOrigin?.vertical ?? 'top',
        horizontal: props.popoverPosition?.anchorOrigin?.horizontal ?? 'left'
      }
    },
    newTab: props.newTab ?? false
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    context.markAsOpened();
  };

  return (
    <>
      <div
        style={{
          display: 'inline-block'
        }}
      >
        <UnreadBadge
          {...props.unreadBadgeProps}
          count={config.count}
          filter={config.filter}
        >
          <IconButton onClick={handleClick} style={config.buttonStyles}>
            {config.buttonIcon}
          </IconButton>
        </UnreadBadge>
      </div>
      <Popover
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        slotProps={{
          paper: {
            style: {
              borderRadius: 8
            }
          }
        }}
        aria-hidden={!anchorEl}
        anchorOrigin={config.popoverPosition.anchorOrigin}
      >
        <div
          style={{
            width: config.popupWidth,
            padding: '0 16px',
            zIndex: props.popupZIndex,
            height: config.popupHeight
          }}
        >
          <Inbox
            maxHeight={config.popupHeight - 73}
            pagination={config.pagination}
            filter={config.filter}
            pageSize={config.pageSize}
            pagePosition={config.pagePosition}
            notificationRenderer={config.renderers.notification}
            header={config.header}
            newTab={config.newTab}
          />
          {context.webPushOptInMessage &&
            localStorage.getItem('hideWebPushOptInMessage') !== 'true' && (
              <div>
                <Divider style={{ margin: '10px 0' }} />
                <WebPushOptInMessage hideAfterInteraction={true} />
              </div>
            )}
        </div>
      </Popover>
      <NotificationPreferencesPopup
        open={openPreferences}
        onClose={() => setOpenPreferences(false)}
      />
    </>
  );
};
