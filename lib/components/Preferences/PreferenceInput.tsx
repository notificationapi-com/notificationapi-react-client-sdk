import { Divider, Radio, Space, Switch, Typography } from "antd";
import { getChannelIcon, getChannelLabel } from "./Preferences";
import {
  BaseDeliveryOptions,
  Channels,
  DeliveryOptionsForEmail,
  DeliveryOptionsForInappWeb,
  GetPreferencesResponse,
} from "@notificationapi/core/dist/interfaces";
const Text = Typography.Text;

const sortChannels = (a: Channels, b: Channels) => {
  const order = ["EMAIL", "INAPP_WEB", "SMS", "CALL", "PUSH", "WEB_PUSH"];
  return order.indexOf(a) - order.indexOf(b);
};

const sortDeliveries = (
  a: DeliveryOptionsForEmail | DeliveryOptionsForInappWeb | BaseDeliveryOptions,
  b: DeliveryOptionsForEmail | DeliveryOptionsForInappWeb | BaseDeliveryOptions
) => {
  const order = ["off", "instant", "hourly", "daily", "weekly", "monthly"];
  return order.indexOf(a) - order.indexOf(b);
};

const getDeliveryLabel = (
  d: DeliveryOptionsForEmail | DeliveryOptionsForInappWeb | BaseDeliveryOptions
) => {
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
  preferences: GetPreferencesResponse["preferences"];
  notification: GetPreferencesResponse["notifications"][0];
  updateDelivery: (
    notificationId: string,
    channel: Channels,
    delivery:
      | DeliveryOptionsForEmail
      | DeliveryOptionsForInappWeb
      | BaseDeliveryOptions,
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
        ) as
          | DeliveryOptionsForEmail[]
          | DeliveryOptionsForInappWeb[]
          | BaseDeliveryOptions[];

        let selector;
        if (deliveries.length === 1) {
          selector = <Text>{getDeliveryLabel(preference.delivery)}</Text>;
        } else if (deliveries.length === 2 && deliveries.includes("off")) {
          selector = (
            <Switch
              checked={preference.delivery !== "off"}
              onChange={(state) => {
                if (state) {
                  const delivery = deliveries.find((d) => d !== "off")!;
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
                    "off",
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
                checked={preference.delivery !== "off"}
                onChange={(state) => {
                  if (state) {
                    const delivery = deliveries
                      .sort(sortDeliveries)
                      .find((d) => d !== "off")!;
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
                      "off",
                      subNotificationId
                    );
                  }
                }}
              />
              <div
                style={{
                  width: "100%",
                  marginTop: 8,
                  maxHeight: preference.delivery !== "off" ? 1000 : 0,
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
                        .filter((d) => d !== "off")
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
