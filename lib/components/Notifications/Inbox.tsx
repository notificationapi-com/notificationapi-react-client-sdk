import { InboxHeader, InboxHeaderProps } from './InboxHeader';
import VirtualList from 'rc-virtual-list';
import { Notification } from './Notification';

import React, { useContext } from 'react';
import { NotificationPopupProps } from './NotificationPopup';
import { Liquid } from 'liquidjs';
import { InAppNotification } from '@notificationapi/core/dist/interfaces';
import { Filter } from './interface';
import { NotificationAPIContext } from '../Provider/context';
import { List, ListItem, Pagination } from '@mui/material';
import { DefaultEmptyComponent } from './DefaultEmpty';

export type InboxProps = {
  pagination: unknown;
  maxHeight: number;
  filter: NotificationPopupProps['filter'];
  pageSize: number;
  pagePosition: NotificationPopupProps['pagePosition'];
  notificationRenderer:
    | ((notification: InAppNotification[]) => React.ReactNode)
    | undefined;
  header?: InboxHeaderProps;
  empty?: React.ReactNode;
};

export const Inbox: React.FC<InboxProps> = (props) => {
  // pagination
  const [page, setPage] = React.useState(1);

  const context = useContext(NotificationAPIContext);
  if (!context) {
    return null;
  }

  const filterFunction = (notifications: InAppNotification[]) => {
    if (props.filter === Filter.ALL || !props.filter) {
      return notifications;
    } else if (props.filter === Filter.UNARCHIVED) {
      return notifications.filter((n) => !n.archived);
    } else {
      return notifications.filter(props.filter);
    }
  };

  if (context.notifications === undefined) return null;

  const filteredNotifications = filterFunction(context.notifications);
  const sortedNotifications = filteredNotifications.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  const batchedNotifications: Record<string, InAppNotification[]> = {};
  const liquid = new Liquid();
  sortedNotifications.forEach((n) => {
    if (n.deliveryOptions?.['instant']?.batching) {
      const batchingKey = n.deliveryOptions['instant'].batchingKey;
      const batchingKeyValue = batchingKey
        ? liquid.parseAndRenderSync(`{{${batchingKey}}}`, n)
        : '';
      const groupKey = `${n.notificationId}-${batchingKeyValue}`;
      if (batchedNotifications[groupKey]) {
        batchedNotifications[groupKey].push(n);
      } else {
        batchedNotifications[groupKey] = [n];
      }
    } else {
      const groupKey = n.id;
      batchedNotifications[groupKey] = [n];
    }
  });

  const orderedNotifications = Object.values(batchedNotifications).sort(
    (a, b) => {
      return (
        new Date(b[b.length - 1].date).getTime() -
        new Date(a[a.length - 1].date).getTime()
      );
    }
  );

  const emptyComponent = props.empty ?? DefaultEmptyComponent;

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    if (value >= Math.floor(context.notifications!.length / props.pageSize)) {
      context.loadNotifications();
    }
    setPage(value);
  };

  return (
    <div>
      {props.pagination === 'INFINITE_SCROLL' ? (
        <List
          subheader={
            <InboxHeader
              title={props.header?.title}
              button1ClickHandler={props.header?.button1ClickHandler}
              button2ClickHandler={props.header?.button2ClickHandler}
            />
          }
        >
          {orderedNotifications.length === 0 && emptyComponent}
          <VirtualList
            data={orderedNotifications}
            height={props.maxHeight}
            itemHeight={47}
            itemKey={(item) => item[0].id}
            onScroll={(e) => {
              // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
              if (
                Math.abs(
                  e.currentTarget.scrollHeight -
                    e.currentTarget.scrollTop -
                    props.maxHeight
                ) <= 1
              ) {
                context.loadNotifications();
              }
            }}
          >
            {(n) => (
              <ListItem key={n[0].id} style={{ padding: 0 }}>
                <Notification
                  markAsArchived={context.markAsArchived}
                  notifications={n}
                  markAsClicked={context.markAsClicked}
                  renderer={props.notificationRenderer}
                />
              </ListItem>
            )}
          </VirtualList>
        </List>
      ) : (
        <List
          subheader={
            <InboxHeader
              title={props.header?.title}
              button1ClickHandler={props.header?.button1ClickHandler}
              button2ClickHandler={props.header?.button2ClickHandler}
            />
          }
        >
          {orderedNotifications
            .filter((_n, i) => {
              if (props.pagination === 'PAGINATED') {
                return (
                  i >= (page - 1) * props.pageSize && i < page * props.pageSize
                );
              } else {
                return true;
              }
            })
            .map((n) => (
              <ListItem key={n[0].id} style={{ padding: 0 }}>
                <Notification
                  markAsArchived={context.markAsArchived}
                  notifications={n}
                  markAsClicked={context.markAsClicked}
                  renderer={props.notificationRenderer}
                />
              </ListItem>
            ))}
          {orderedNotifications.length > 0 && (
            <Pagination
              count={Math.ceil(orderedNotifications.length / props.pageSize)}
              page={page}
              onChange={handlePageChange}
            />
          )}
          {orderedNotifications.length === 0 && emptyComponent}
        </List>
      )}
    </div>
  );
};
