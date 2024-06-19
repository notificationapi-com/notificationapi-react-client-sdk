import { CheckOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Popover, Typography } from "antd";

export type InboxHeaderProps = {
  title?: JSX.Element;
  button1ClickHandler?: (ids: string[] | "ALL") => void;
  button2ClickHandler?: () => void;
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
              props.button1ClickHandler && props.button1ClickHandler("ALL");
            }}
          />
        </Popover>
        <Popover content="Notification Preferences">
          <Button
            icon={<SettingOutlined />}
            size="small"
            type="text"
            onClick={props.button2ClickHandler}
          />
        </Popover>
      </div>
    </div>
  );
};
