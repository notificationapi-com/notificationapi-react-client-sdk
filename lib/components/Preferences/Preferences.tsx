import { Typography } from 'antd';
import { NotificationAPIContext } from '../Provider';
import { useContext } from 'react';
import { PreferenceGroup } from './PreferenceGroup';

const Text = Typography.Text;

export function Preferences() {
  const context = useContext(NotificationAPIContext);

  if (!context || !context.preferences) {
    return null;
  }

  const prefs = context.preferences.preferences;
  console.log(prefs);
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
        title: sn.title
      });
    }
  });

  return (
    <>
      <Text strong>General Notifications</Text>
      <PreferenceGroup
        title="General Notifications"
        subNotificationId={undefined}
      />

      {uniqueSubNotifications.map((sn) => (
        <>
          <Text strong>{sn.title}</Text>
          <PreferenceGroup
            title={sn.title}
            subNotificationId={sn.subNotificationId}
          />
        </>
      ))}
    </>
  );
}
