import { CheckOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Popover, Typography } from "antd";

export const InboxHeader = (props: { markAsRead: () => void }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingRight: 5,
      }}
    >
      <Typography.Text strong>Notifications</Typography.Text>

      <div>
        <Popover content="Mark all as read">
          <Button
            icon={<CheckOutlined />}
            size="small"
            type="text"
            onClick={() => {
              props.markAsRead();
            }}
          />
        </Popover>
        <Popover content="Notification Preferences">
          <Button icon={<SettingOutlined />} size="small" type="text" />
        </Popover>
      </div>
    </div>
  );
};
