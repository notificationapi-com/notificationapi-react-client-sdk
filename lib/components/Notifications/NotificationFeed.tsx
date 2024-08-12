import { useContext, useEffect } from 'react';
import { Inbox, Pagination } from './Inbox';
import { ImageShape } from './Notification';
import { InappNotification, NotificationAPIContext } from '../Provider';
import { Filter } from './NotificationPopup';

export type NotificationFeedProps = {
  imageShape?: keyof typeof ImageShape;
  pagination?: keyof typeof Pagination;
  pageSize?: number;
  pagePosition?: 'top' | 'bottom';
  infiniteScrollHeight?: number;
  style?: React.CSSProperties;
  filter?: keyof typeof Filter | ((n: InappNotification) => boolean);
};

export const NotificationFeed: React.FC<NotificationFeedProps> = (props) => {
  const config: Required<NotificationFeedProps> = {
    imageShape: props.imageShape || 'circle',
    pagination: props.pagination || 'INFINITE_SCROLL',
    pageSize: props.pageSize || 10,
    pagePosition: props.pagePosition || 'top',
    style: props.style || {},
    filter: props.filter || Filter.ALL,
    infiniteScrollHeight: props.infiniteScrollHeight
      ? props.infiniteScrollHeight
      : window.innerHeight * 0.75
  };

  const context = useContext(NotificationAPIContext);

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
      />
    </div>
  );
};
