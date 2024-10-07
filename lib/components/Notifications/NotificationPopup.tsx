import { Button, Popover } from 'antd';
import { Inbox } from './Inbox';
import { BellOutlined } from '@ant-design/icons';
import { UnreadBadge, UnreadBadgeProps } from './UnreadBadge';
import { NotificationProps } from './Notification';
import { NotificationAPIContext } from '../Provider';
import { useContext, useState } from 'react';
import { InAppNotification } from '@notificationapi/core/dist/interfaces';
import { NotificationPreferencesPopup } from '../Preferences';
import { InboxHeaderProps } from './InboxHeader';
import { Filter, ImageShape, Pagination } from './interface';

export type NotificationPopupProps = {
  buttonIcon?: React.ReactNode;
  buttonIconSize?: number;
  buttonWidth?: number;
  buttonHeight?: number;
  popupWidth?: number | string;
  popupHeight?: number;
  imageShape?: keyof typeof ImageShape;
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
  customStyle?: React.CSSProperties;
};

export const NotificationPopup: React.FC<NotificationPopupProps> = (props) => {
  const [openPreferences, setOpenPreferences] = useState(false);
  const context = useContext(NotificationAPIContext);

  if (!context) {
    return null;
  }

  const config: Required<NotificationPopupProps> = {
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
    customStyle: props.customStyle || {}
  };

  return (
    <>
      <Popover
        autoAdjustOverflow
        trigger="click"
        content={
          <Inbox
            maxHeight={config.popupHeight - 73}
            pagination={config.pagination}
            filter={config.filter}
            imageShape={config.imageShape}
            pageSize={config.pageSize}
            pagePosition={config.pagePosition}
            notificationRenderer={config.renderers.notification}
            header={config.header}
          />
        }
        onOpenChange={(visible) => {
          if (visible) {
            context.markAsOpened();
          }
        }}
        arrow={false}
        overlayStyle={{
          padding: '0 16px',
          width: config.popupWidth,
          ...config.customStyle
        }}
        zIndex={props.popupZIndex}
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
            filter={config.filter}
          >
            <Button
              icon={config.buttonIcon}
              style={{
                width: config.buttonWidth,
                height: config.buttonHeight
              }}
              shape="circle"
              type="text"
            />
          </UnreadBadge>
        </div>
      </Popover>
      <NotificationPreferencesPopup
        open={openPreferences}
        onClose={() => setOpenPreferences(false)}
      />
    </>
  );
};
