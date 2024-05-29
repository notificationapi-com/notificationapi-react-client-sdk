import { Space, Typography } from "antd";
import { Channels, NotificationAPIContext } from "../Provider";
import { useContext } from "react";
import {
  BellOutlined,
  ChromeOutlined,
  MailOutlined,
  MessageOutlined,
  MobileOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { blue } from "@ant-design/colors";
import { PreferenceGroup } from "./PreferenceGroup";

const Text = Typography.Text;

export const getChannelLabel = (c: Channels) => {
  const labels = {
    EMAIL: "Email",
    INAPP_WEB: "In-App",
    SMS: "Text",
    CALL: "Automated Calling",
    PUSH: "Mobile",
    WEB_PUSH: "Browser",
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

export function Preferences() {
  const context = useContext(NotificationAPIContext);

  if (!context || !context.preferences) {
    return null;
  }

  const subNotifications = context.preferences.subNotifications;
  const uniqueSubNotifications: {
    subNotificationId: string;
    title: string;
  }[] = [];
  subNotifications.forEach((sn) => {
    if (
      !uniqueSubNotifications.find(
        (usn) => usn.subNotificationId === sn.subNotificationId
      )
    ) {
      uniqueSubNotifications.push({
        subNotificationId: sn.subNotificationId,
        title: sn.title,
      });
    }
  });

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <div style={{ marginTop: 12 }}>
        {uniqueSubNotifications.length > 0 && (
          <Text strong>General Notifications</Text>
        )}
        <PreferenceGroup
          title="General Settings"
          subNotificationId={undefined}
        />
      </div>
      {uniqueSubNotifications.map((sn) => (
        <div>
          <Text strong>{sn.title}</Text>
          <PreferenceGroup
            title={sn.title}
            subNotificationId={sn.subNotificationId}
          />
        </div>
      ))}
    </Space>
  );
}
