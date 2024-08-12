import {
  Collapse,
  CollapseProps,
  Divider,
  Radio,
  Space,
  Switch,
  Typography
} from 'antd';
import { Channels, DeliveryOptions, NotificationAPIContext } from '../Provider';
import { getChannelIcon, getChannelLabel } from './Preferences';
import { useContext } from 'react';

const Text = Typography.Text;

type PreferenceGroupProps = {
  subNotificationId?: string;
  title: string;
};

const getDeliveryLabel = (d: DeliveryOptions) => {
  const labels = {
    off: 'Off',
    instant: 'Instant',
    hourly: 'Hourly',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly'
  };
  return labels[d];
};

const sortChannels = (a: Channels, b: Channels) => {
  const order = [
    Channels.EMAIL,
    Channels.INAPP_WEB,
    Channels.SMS,
    Channels.CALL,
    Channels.PUSH,
    Channels.WEB_PUSH
  ];
  return order.indexOf(a) - order.indexOf(b);
};

const sortDeliveries = (a: DeliveryOptions, b: DeliveryOptions) => {
  const order = [
    DeliveryOptions.OFF,
    DeliveryOptions.INSTANT,
    DeliveryOptions.HOURLY,
    DeliveryOptions.DAILY,
    DeliveryOptions.WEEKLY,
    DeliveryOptions.MONTHLY
  ];
  return order.indexOf(a) - order.indexOf(b);
};

export const PreferenceGroup: React.FC<PreferenceGroupProps> = () => {
  const context = useContext(NotificationAPIContext);

  if (!context || !context.preferences) {
    return null;
  }

  const prefs = context.preferences.preferences;
  const notifications = context.preferences.notifications;

  const items: CollapseProps['items'] = notifications.map((n) => {
    const onChannels = Array.from(
      new Set(
        prefs
          .filter(
            (p) =>
              p.notificationId === n.notificationId &&
              p.delivery !== DeliveryOptions.OFF
          )
          .map((p) => p.channel)
      )
    );
    return {
      label: n.notificationId,
      key: n.notificationId,
      extra: (
        <Text type="secondary">
          {onChannels.map((c) => getChannelLabel(c)).join(', ')}
        </Text>
      ),
      children: (
        <div key={n.notificationId}>
          {n.channels.sort(sortChannels).map((c, i) => {
            const p = prefs.find(
              (p) => p.channel === c && p.notificationId === n.notificationId
            )!;

            if (p.notificationId === n.notificationId) {
              const name = getChannelLabel(c);
              const icon = getChannelIcon(c);

              const deliveries = Object.keys(n.options![c]!).filter(
                (o) =>
                  o !== 'defaultDeliveryOption' && o !== 'defaultDeliverOption'
              ) as DeliveryOptions[];

              let selector;
              if (deliveries.length === 1) {
                selector = <Text>{getDeliveryLabel(p.delivery)}</Text>;
              } else if (
                deliveries.length === 2 &&
                deliveries.includes(DeliveryOptions.OFF)
              ) {
                selector = (
                  <Switch
                    checked={p.delivery !== DeliveryOptions.OFF}
                    onChange={(state) => {
                      if (state) {
                        const delivery = deliveries.find(
                          (d) => d !== DeliveryOptions.OFF
                        )!;
                        context.updateDelivery(n.notificationId, c, delivery);
                      } else {
                        context.updateDelivery(
                          n.notificationId,
                          c,
                          DeliveryOptions.OFF
                        );
                      }
                    }}
                  />
                );
              } else {
                selector = (
                  <>
                    <Switch
                      checked={p.delivery !== DeliveryOptions.OFF}
                      onChange={(state) => {
                        if (state) {
                          const delivery = deliveries
                            .sort(sortDeliveries)
                            .find((d) => d !== DeliveryOptions.OFF)!;
                          context.updateDelivery(n.notificationId, c, delivery);
                        } else {
                          context.updateDelivery(
                            n.notificationId,
                            c,
                            DeliveryOptions.OFF
                          );
                        }
                      }}
                    />
                    <div
                      style={{
                        width: '100%',
                        marginTop: 8,
                        maxHeight:
                          p.delivery !== DeliveryOptions.OFF ? 1000 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease'
                      }}
                    >
                      <div>
                        <div style={{ marginTop: 20 }}>
                          <Text strong>Choose frequency:</Text>
                        </div>
                        <Radio.Group
                          value={p.delivery}
                          onChange={(e) => {
                            context.updateDelivery(
                              n.notificationId,
                              c,
                              e.target.value
                            );
                          }}
                        >
                          <Space
                            direction="vertical"
                            style={{ paddingTop: 10 }}
                          >
                            {deliveries
                              .filter((d) => d !== DeliveryOptions.OFF)
                              .sort(sortDeliveries)
                              .map((d) => (
                                <Radio value={d} key={d}>
                                  <Text>{getDeliveryLabel(d)}</Text>
                                </Radio>
                              ))}
                          </Space>
                        </Radio.Group>
                      </div>
                    </div>
                  </>
                );
              }
              return (
                <>
                  <div
                    key={c}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      marginTop: i === 0 ? 12 : 0,
                      marginBottom: i === n.channels.length - 1 ? 12 : 0
                    }}
                  >
                    <Text>
                      {icon} {name}
                    </Text>
                    {selector}
                  </div>
                  {i !== n.channels.length - 1 && <Divider />}
                </>
              );
            }
          })}
        </div>
      )
    };
  });

  return <Collapse items={items} defaultActiveKey={[]} />;
};
