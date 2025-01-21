import {
  Call,
  EmailOutlined,
  MarkChatUnread,
  NotificationsOutlined,
  PhoneIphone,
  Sms
} from '@mui/icons-material';
import { Channels } from '../Notifications/interface';

export const getChannelLabel = (c: Channels): string => {
  const labels: Record<Channels, string> = {
    EMAIL: 'Email',
    INAPP_WEB: 'In-App',
    SMS: 'Text',
    CALL: 'Automated Calling',
    PUSH: 'Mobile',
    WEB_PUSH: 'Browser'
  };
  return labels[c];
};

export const getChannelIcon = (channel: Channels): React.ReactElement => {
  switch (channel) {
    case Channels.EMAIL:
      return <EmailOutlined fontSize="small" color="primary" />;
    case Channels.SMS:
      return <Sms fontSize="small" color="primary" />;
    case Channels.PUSH:
      return <PhoneIphone fontSize="small" color="primary" />;
    case Channels.CALL:
      return <Call fontSize="small" color="primary" />;
    case Channels.INAPP_WEB:
      return <NotificationsOutlined fontSize="small" color="primary" />;
    case Channels.WEB_PUSH:
      return <MarkChatUnread fontSize="small" color="primary" />;
    default:
      return <EmailOutlined fontSize="small" color="primary" />;
  }
};
