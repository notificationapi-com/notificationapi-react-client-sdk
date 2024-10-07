import { Button, Popover } from 'antd';
import { Inbox } from './Inbox';
import { BellOutlined } from '@ant-design/icons';
import { UnreadBadge } from './UnreadBadge';
import { NotificationPopupProps } from './NotificationPopup';
import { useContext, useState } from 'react';
import { NotificationAPIContext } from '../Provider';
import { NotificationPreferencesPopup } from '../Preferences';
import { Position } from './interface';

type NotificationLauncherProps = NotificationPopupProps & {
  position?: keyof typeof Position;
  offsetX?: number | string;
  offsetY?: number | string;
  customStyle?: React.CSSProperties;
};

export const NotificationLauncher: React.FC<NotificationLauncherProps> = (
  props
) => {
  const [openPreferences, setOpenPreferences] = useState(false);
  const context = useContext(NotificationAPIContext);

  if (!context) {
    return null;
  }

  const config: Required<NotificationLauncherProps> = {
    buttonIcon: props.buttonIcon || (
      <BellOutlined
        style={{
          fontSize:
            props.buttonIconSize ||
            (props.buttonWidth ? props.buttonWidth / 2 : 20),
          color: props.iconColor || '#000000'
        }}
      />
    ),
    buttonWidth: props.buttonWidth || 40,
    buttonHeight: props.buttonHeight || 40,
    popupWidth: props.popupWidth || 400,
    popupHeight: props.popupHeight || 600,
    buttonIconSize:
      props.buttonIconSize || (props.buttonWidth ? props.buttonWidth / 2 : 20),
    imageShape: props.imageShape || 'circle',
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
    },
    customStyle: props.customStyle || {}
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
            header={config.header}
          />
        }
        arrow={false}
        overlayStyle={{
          padding: '0 16px',
          minWidth: config.popupWidth
        }}
        onOpenChange={(visible) => {
          if (visible) {
            context.markAsOpened();
          }
        }}
      >
        <div
          style={{
            display: 'inline-block'
          }}
        >
          <UnreadBadge
            {...props.unreadBadgeProps}
            style={{
              top: 5,
              right: 5
            }}
            count={config.count}
          >
            <Button
              icon={config.buttonIcon}
              style={{
                width: config.buttonWidth,
                height: config.buttonHeight
              }}
              shape="circle"
              type="default"
            />
          </UnreadBadge>
        </div>
      </Popover>
      <NotificationPreferencesPopup
        open={openPreferences}
        onClose={() => setOpenPreferences(false)}
      />
    </div>
  );
};
