import { PropsWithChildren } from 'react';
import { UnreadBadge, UnreadBadgeProps } from './UnreadBadge';

export type NotificationCounterProps = Omit<UnreadBadgeProps, 'count'> & {
  count?: UnreadBadgeProps['count'];
};

export const NotificationCounter: React.FC<
  PropsWithChildren<NotificationCounterProps>
> = (props) => {
  const count = props.count || 'COUNT_UNOPENED_NOTIFICATIONS';
  return (
    <UnreadBadge
      {...props}
      count={count}
      offset={{
        top: 0,
        right: 0
      }}
    ></UnreadBadge>
  );
};
