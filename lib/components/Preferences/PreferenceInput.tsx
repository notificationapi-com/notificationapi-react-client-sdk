import { Divider, Radio, Space, Switch, Typography } from "antd";
import { Channels, DeliveryOptions, Preferences } from "../Provider";
import { getChannelIcon, getChannelLabel } from "./Preferences";
const Text = Typography.Text;

const sortChannels = (a: Channels, b: Channels) => {
  const order = [
    Channels.EMAIL,
    Channels.INAPP_WEB,
    Channels.SMS,
    Channels.CALL,
    Channels.PUSH,
    Channels.WEB_PUSH,
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
    DeliveryOptions.MONTHLY,
  ];
  return order.indexOf(a) - order.indexOf(b);
};

const getDeliveryLabel = (d: DeliveryOptions) => {
  const labels = {
    off: "Off",
    instant: "Instant",
    hourly: "Hourly",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
  };
  return labels[d];
};

type Props = {
  preferences: Preferences["preferences"];
  notification: Preferences["notifications"][0];
  updateDelivery: (
    notificationId: string,
    channel: Channels,
    delivery: DeliveryOptions,
    subNotificationId?: string
  ) => void;
  subNotificationId?: string;
};

export const PreferenceInput = ({
  notification,
  preferences,
  updateDelivery,
  subNotificationId,
}: Props) => {
  return (
    <>
      {notification.channels.sort(sortChannels).map((channel, i) => {
        const preference = preferences.find(
          (p) =>
            p.notificationId === notification.notificationId &&
            p.channel === channel
        );

        if (!preference) {
          return null;
        }

        let name = getChannelLabel(channel);
        let icon = getChannelIcon(channel);

        const deliveries = Object.keys(notification.options![channel]!).filter(
          (o) => o !== "defaultDeliveryOption" && o !== "defaultDeliverOption"
        ) as DeliveryOptions[];

        let selector;
        if (deliveries.length === 1) {
          selector = <Text>{getDeliveryLabel(preference.delivery)}</Text>;
        } else if (
          deliveries.length === 2 &&
          deliveries.includes(DeliveryOptions.OFF)
        ) {
          selector = (
            <Switch
              checked={preference.delivery !== DeliveryOptions.OFF}
              onChange={(state) => {
                if (state) {
                  const delivery = deliveries.find(
                    (d) => d !== DeliveryOptions.OFF
                  )!;
                  updateDelivery(
                    notification.notificationId,
                    channel,
                    delivery,
                    subNotificationId
                  );
                } else {
                  console.log({
                    notificationId: notification.notificationId,
                    channel,
                    delivery: "OFF",
                    subNotificationId,
                  });
                  updateDelivery(
                    notification.notificationId,
                    channel,
                    DeliveryOptions.OFF,
                    subNotificationId
                  );
                }
              }}
            />
          );
        } else {
          selector = (
            <>
              <Switch
                checked={preference.delivery !== DeliveryOptions.OFF}
                onChange={(state) => {
                  if (state) {
                    const delivery = deliveries
                      .sort(sortDeliveries)
                      .find((d) => d !== DeliveryOptions.OFF)!;
                    updateDelivery(
                      notification.notificationId,
                      channel,
                      delivery,
                      subNotificationId
                    );
                  } else {
                    updateDelivery(
                      notification.notificationId,
                      channel,
                      DeliveryOptions.OFF,
                      subNotificationId
                    );
                  }
                }}
              />
              <div
                style={{
                  width: "100%",
                  marginTop: 8,
                  maxHeight:
                    preference.delivery !== DeliveryOptions.OFF ? 1000 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <div>
                  <div style={{ marginTop: 20 }}>
                    <Text strong>Choose frequency:</Text>
                  </div>
                  <Radio.Group
                    value={preference.delivery}
                    onChange={(e) => {
                      updateDelivery(
                        notification.notificationId,
                        channel,
                        e.target.value,
                        subNotificationId
                      );
                    }}
                  >
                    <Space direction="vertical" style={{ paddingTop: 10 }}>
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
          <div key={channel}>
            <div
              key={channel}
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginTop: i === 0 ? 12 : 0,
                marginBottom: i === notification.channels.length - 1 ? 12 : 0,
              }}
            >
              <Text>
                {icon} {name}
              </Text>
              {selector}
            </div>
            {i !== notification.channels.length - 1 && <Divider />}
          </div>
        );
      })}
    </>
  );
};
