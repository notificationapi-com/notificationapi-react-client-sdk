import { CheckOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Popover, Typography } from 'antd';

export const InboxHeader = (props: {
  markAsArchived: (ids: string[] | 'ALL') => void;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingRight: 5
      }}
    >
      <Typography.Text strong>Notifications</Typography.Text>

      <div>
        <Popover content="Resolve all">
          <Button
            icon={<CheckOutlined />}
            size="small"
            type="text"
            onClick={() => {
              props.markAsArchived('ALL');
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
