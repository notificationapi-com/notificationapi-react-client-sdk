import { CheckOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Popover, Typography } from "antd";

export type InboxHeaderProps = {
  markAsArchived: (ids: string[] | "ALL") => void;
  title?: JSX.Element;
};

export const InboxHeader = (props: InboxHeaderProps) => {
  const titleComponent = props.title ?? (
    <Typography.Text strong>Notifications</Typography.Text>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingRight: 5,
      }}
    >
      {titleComponent}

      <div>
        <Popover content="Resolve all">
          <Button
            icon={<CheckOutlined />}
            size="small"
            type="text"
            onClick={() => {
              props.markAsArchived("ALL");
            }}
          />
        </Popover>
        <Popover content="Notification Preferences">
          <Button
            icon={<SettingOutlined />}
            size="small"
            type="text"
            onClick={() => {}}
          />
        </Popover>
      </div>
    </div>
  );
};
