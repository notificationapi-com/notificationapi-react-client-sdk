import {
  Call,
  EmailOutlined,
  MarkChatUnread,
  NotificationsOutlined,
  PhoneIphone,
  Sms
} from '@mui/icons-material';
import { SvgIcon } from '@mui/material';
import { Channels } from '../Notifications/interface';

export const getChannelLabel = (c: Channels): string => {
  const labels: Record<Channels, string> = {
    EMAIL: 'Email',
    INAPP_WEB: 'In-App',
    SMS: 'Text',
    CALL: 'Automated Calling',
    PUSH: 'Mobile',
    WEB_PUSH: 'Browser',
    SLACK: 'Slack'
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
    case Channels.SLACK:
      return (
        <SvgIcon fontSize="small" color="primary">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.521-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.523 2.521h-2.521V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.521A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.523v-2.521h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
        </SvgIcon>
      );
    default:
      return <EmailOutlined fontSize="small" color="primary" />;
  }
};
