import { useContext, useEffect, useState } from 'react';
import { Inbox } from './Inbox';
import { NotificationProps } from './Notification';
import { NotificationAPIContext } from '../Provider';
import { InboxHeaderProps } from './InboxHeader';
import { NotificationPreferencesPopup } from '../Preferences';
import { InAppNotification } from '@notificationapi/core/dist/interfaces';
import { Filter, ImageShape, Pagination } from './interface';

export type NotificationFeedProps = {
  imageShape?: keyof typeof ImageShape;
  pagination?: keyof typeof Pagination;
  pageSize?: number;
  pagePosition?: 'top' | 'bottom';
  infiniteScrollHeight?: number;
  style?: React.CSSProperties;
  filter?: keyof typeof Filter | ((n: InAppNotification) => boolean);
  renderers?: {
    notification?: NotificationProps['renderer'];
  };
  header?: InboxHeaderProps;
};

export const NotificationFeed: React.FC<NotificationFeedProps> = (props) => {
  const [openPreferences, setOpenPreferences] = useState(false);
  const context = useContext(NotificationAPIContext);

  // every 5 seconds
  useEffect(() => {
    if (!context) return;

    context.markAsOpened();
    const interval = setInterval(() => {
      context.markAsOpened();
    }, 5000);

    return () => clearInterval(interval);
  }, [context]);
  if (!context) {
    return null;
  }

  const config: Required<NotificationFeedProps> = {
    imageShape: props.imageShape || 'circle',
    pagination: props.pagination || 'INFINITE_SCROLL',
    pageSize: props.pageSize || 10,
    pagePosition: props.pagePosition || 'top',
    style: props.style || {},
    filter: props.filter || Filter.ALL,
    infiniteScrollHeight: props.infiniteScrollHeight
      ? props.infiniteScrollHeight
      : window.innerHeight * 0.75,
    renderers: {
      notification: props.renderers?.notification
    },
    header: {
      title: props.header?.title,
      button1ClickHandler:
        props.header?.button1ClickHandler ?? context.markAsArchived,
      button2ClickHandler:
        props.header?.button2ClickHandler ?? (() => setOpenPreferences(true))
    }
  };

  return (
    <div
      style={{
        padding: 12,
        boxSizing: 'border-box',
        background: '#fff',
        ...props.style
      }}
    >
      <Inbox
        maxHeight={config.infiniteScrollHeight}
        pagination={config.pagination}
        filter={config.filter}
        imageShape={config.imageShape}
        pageSize={config.pageSize}
        pagePosition={config.pagePosition}
        notificationRenderer={config.renderers.notification}
        header={config.header}
      />
      <NotificationPreferencesPopup
        open={openPreferences}
        onClose={() => setOpenPreferences(false)}
      />
    </div>
  );
};
