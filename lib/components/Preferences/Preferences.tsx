import { Collapse, CollapseProps } from 'antd';
import { NotificationAPIContext } from '../Provider';
import { useContext } from 'react';
import { PreferenceInput } from './PreferenceInput';

export function Preferences() {
  const context = useContext(NotificationAPIContext);

  if (!context || !context.preferences) {
    return null;
  }

  const items: CollapseProps['items'] = context.preferences.notifications.map(
    (n) => {
      const mainPreferences = context.preferences?.preferences.filter(
        (p) => p.notificationId === n.notificationId && !p.subNotificationId
      );

      const subPreferences = context.preferences?.preferences.filter(
        (sn) => sn.notificationId === n.notificationId && sn.subNotificationId
      );

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
                      )
                    }
                  ]}
                  defaultActiveKey={[]}
                />
              );
            })}
          </>
        )
      };
    }
  );

  return (
    <>
      <Collapse items={items} defaultActiveKey={[]} />
    </>
  );
}
