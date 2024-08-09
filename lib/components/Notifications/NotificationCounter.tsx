import { PropsWithChildren } from 'react';
import { UnreadBadge, UnreadBadgeProps } from './UnreadBadge';

export type NotificationCounterProps = Omit<UnreadBadgeProps, 'count'> & {
  counting?: UnreadBadgeProps['count'];
};

export const NotificationCounter: React.FC<
  PropsWithChildren<NotificationCounterProps>
> = (props) => {
  const counting = props.counting || 'COUNT_UNOPENED_NOTIFICATIONS';
  return <UnreadBadge {...props} count={counting}></UnreadBadge>;
};
