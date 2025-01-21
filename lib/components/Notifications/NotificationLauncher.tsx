import { useContext, useState } from 'react';
import { Inbox } from './Inbox';
import { UnreadBadge } from './UnreadBadge';
import { NotificationPopupProps } from './NotificationPopup';
import { NotificationAPIContext } from '../Provider/context';
import { NotificationPreferencesPopup } from '../Preferences';
import { Position } from './interface';
import { LanguageOutlined, NotificationsOutlined } from '@mui/icons-material';
import { Divider, IconButton, Popover } from '@mui/material';
import WebPushOptInMessage from '../WebPush/WebPushOptInMessage';

type NotificationLaucherProps = NotificationPopupProps & {
  position?: keyof typeof Position;
  offsetX?: number | string;
  offsetY?: number | string;
  buttonStyles?: React.CSSProperties;
};

export const NotificationLauncher: React.FC<NotificationLaucherProps> = (
  props
) => {
  const [openPreferences, setOpenPreferences] = useState(false);
  const [open, setOpen] = useState(false);
  const context = useContext(NotificationAPIContext);

  if (!context) {
    return null;
  }

  const config: Required<NotificationLaucherProps> = {
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
    pagePosition: props.pagePosition || 'top',
    popupZIndex: props.popupZIndex || 1030,
    unreadBadgeProps: props.unreadBadgeProps ?? {},
    offsetX: props.offsetX || 16,
    offsetY: props.offsetY || 16,
    position: props.position || 'BOTTOM_RIGHT',
    count: props.count || 'COUNT_UNOPENED_NOTIFICATIONS',
    filter: props.filter || 'ALL',
    header: {
      title: props.header?.title,
      button1ClickHandler:
        props.header?.button1ClickHandler ?? context.markAsArchived,
      button2ClickHandler:
        props.header?.button2ClickHandler ?? (() => setOpenPreferences(true))
    },
    renderers: {
      notification: props.renderers?.notification
    }
  };

  const handleClick = () => {
    setOpen(!open);
    if (open) {
      context.markAsOpened();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: config.offsetX,
        bottom: config.offsetY,
        zIndex: 9999
      }}
    >
      <div
        style={{
          display: 'inline-block'
        }}
      >
        <UnreadBadge {...props.unreadBadgeProps} count={config.count}>
          <IconButton style={config.buttonStyles} onClick={handleClick}>
            {config.buttonIcon}
          </IconButton>
        </UnreadBadge>
      </div>
      <Popover
        open={open}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: window.innerHeight / 2,
          left: window.innerWidth / 2
        }}
        transformOrigin={{ horizontal: 'center', vertical: 'center' }}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            style: {
              width: config.popupWidth,
              padding: '0 16px',
              borderRadius: 8
            }
          }
        }}
      >
        <Inbox
          maxHeight={500}
          pagination={config.pagination}
          filter={config.filter}
          pageSize={config.pageSize}
          pagePosition={config.pagePosition}
          notificationRenderer={config.renderers.notification}
          header={config.header}
        />
        {context.webPushOptInMessage &&
          localStorage.getItem('hideWebPushOptInMessage') !== 'true' && (
            <div>
              <Divider style={{ margin: '10px 0' }} />
              <WebPushOptInMessage
                hideAfterInteraction={true}
                icon={
                  <LanguageOutlined type="text" style={{ marginLeft: '9px' }} />
                }
                alertContainerStyle={{ maxWidth: '345px' }}
              />
            </div>
          )}
      </Popover>
      <NotificationPreferencesPopup
        open={openPreferences}
        onClose={() => setOpenPreferences(false)}
      />
    </div>
  );
};
