import { Button } from 'antd';
import { NotificationAPIProvider } from '../lib/main';

export const MyButton: React.FC = () => {
  const notificationapi = NotificationAPIProvider.useNotificationAPIContext();

  return (
    <Button
      onClick={() => {
        console.log(notificationapi.notifications);
      }}
    >
      Click me!
    </Button>
  );
};
