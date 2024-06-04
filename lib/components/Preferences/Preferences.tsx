import { Collapse, CollapseProps } from "antd";
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
import { PreferenceInput } from "./PreferenceInput";

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

  const items: CollapseProps["items"] = context.preferences.notifications.map(
    (n) => {
      const mainPreferences = context.preferences?.preferences.filter(
        (p) => p.notificationId === n.notificationId && !p.subNotificationId
      );

      const subPreferences = context.preferences?.preferences.filter(
        (sn) => sn.notificationId === n.notificationId && sn.subNotificationId
      );

      console.log("subPreferences", n.notificationId, subPreferences);

      const subNotifications = context.preferences?.subNotifications.filter(
        (sn) =>
          subPreferences?.find(
            (p) => p.subNotificationId === sn.subNotificationId
          )
      );

      return {
        label: n.title,
        key: n.notificationId,
        children: (
          <>
            <PreferenceInput
              key={n.notificationId}
              notification={n}
              preferences={mainPreferences || []}
              updateDelivery={context.updateDelivery}
            />

            {subNotifications?.map((sn) => {
              return (
                <Collapse
                  key={sn.subNotificationId}
                  bordered={false}
                  items={[
                    {
                      label: sn.title,
                      key: sn.subNotificationId,
                      children: (
                        <PreferenceInput
                          key={sn.subNotificationId}
                          notification={n}
                          preferences={subPreferences || []}
                          updateDelivery={context.updateDelivery}
                          subNotificationId={sn.subNotificationId}
                        />
                      ),
                    },
                  ]}
                  defaultActiveKey={[]}
                />
              );
            })}
          </>
        ),
      };
    }
  );

  return (
    <>
      <Collapse items={items} defaultActiveKey={[]} />
    </>
  );
}
