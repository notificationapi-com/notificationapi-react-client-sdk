import {
  MailOutlined,
  MessageOutlined,
  MobileOutlined,
  PhoneOutlined,
  BellOutlined,
  ChromeOutlined
} from '@ant-design/icons';
import { blue } from '@ant-design/colors';
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
      return <MailOutlined style={{ color: blue.primary }} />;
    case Channels.SMS:
      return <MessageOutlined style={{ color: blue.primary }} />;
    case Channels.PUSH:
      return <MobileOutlined style={{ color: blue.primary }} />;
    case Channels.CALL:
      return <PhoneOutlined style={{ color: blue.primary }} />;
    case Channels.INAPP_WEB:
      return <BellOutlined style={{ color: blue.primary }} />;
    case Channels.WEB_PUSH:
      return <ChromeOutlined style={{ color: blue.primary }} />;
    default:
      return <MailOutlined style={{ color: blue.primary }} />;
  }
};
