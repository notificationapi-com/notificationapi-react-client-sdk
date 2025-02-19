import { PropsWithChildren, useContext } from 'react';
import { NotificationAPIContext } from '../Provider/context';
import { NotificationPopupProps } from './NotificationPopup';
import { InAppNotification } from '@notificationapi/core/dist/interfaces';
import { COUNT_TYPE } from './interface';
import { Badge } from '@mui/material';

export type UnreadBadgeProps = {
  dot?: boolean;
  showZero?: boolean;
  max?: number;
  count?:
    | keyof typeof COUNT_TYPE
    | ((notification: InAppNotification) => boolean);
  filter?: NotificationPopupProps['filter'];
  offset?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  fontColor?: string;
  bubbleColor?: string;
};

export const UnreadBadge: React.FunctionComponent<
  PropsWithChildren<UnreadBadgeProps>
> = (props) => {
  const context = useContext(NotificationAPIContext);

  const countingFunction = (notifications: InAppNotification[]) => {
    if (
      props.count === 'COUNT_UNOPENED_NOTIFICATIONS' ||
      props.count === undefined
    ) {
      return notifications.filter((n) => !n.opened && !n.seen).length;
    } else if (props.count === 'COUNT_UNARCHIVED_NOTIFICATIONS') {
      return notifications.filter(
        (n) =>
          !n.archived &&
          !n.clicked &&
          !n.replies &&
          !n.actioned1 &&
          !n.actioned2
      ).length;
    } else {
      return notifications.filter(props.count).length;
    }
  };

  return (
    <Badge
      overlap="circular"
      badgeContent={countingFunction(context?.notifications || [])}
      max={props.max}
      variant={props.dot ? 'dot' : 'standard'}
      showZero={props.showZero}
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: props.bubbleColor || '#d32f2f',
          color: props.fontColor || '#FFF'
        }
      }}
      slotProps={{
        badge: {
          style: {
            top: props.offset?.top,
            right: props.offset?.right,
            bottom: props.offset?.bottom,
            left: props.offset?.left
          }
        }
      }}
    >
      {props.children}
    </Badge>
  );
};
