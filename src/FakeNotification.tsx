import { InAppNotification } from '@notificationapi/core/dist/interfaces';

import { faker } from '@faker-js/faker';
import { Button } from '@mui/material';

const generateFakeNotifications = (params: {
  title?: string;
}): InAppNotification => {
  return {
    id: new Date().getTime().toString(),
    notificationId: 'fake notificaitonId',
    template: {
      instant: {
        title:
          params.title ??
          `${faker.person.firstName()} reviewed ${faker.commerce.productName()}`,
        redirectURL: '#',
        imageURL: faker.image.avatar()
      },
      batch: {
        title:
          params.title ??
          `${faker.person.firstName()} reviewed ${faker.commerce.productName()}`,
        redirectURL: '#',
        imageURL: faker.image.avatar()
      }
    },
    title: '',
    redirectURL: '',
    imageURL: '',
    opened: faker.datatype.boolean() ? new Date().toISOString() : undefined,
    seen: faker.datatype.boolean(),
    date: faker.date.past().toISOString()
  };
};

export const FakeNotification: React.FC<{
  addToState: (notification: InAppNotification) => void;
}> = ({ addToState }) => {
  return (
    <Button
      onClick={() => addToState(generateFakeNotifications({}))}
      variant="contained"
      color="primary"
    >
      Generate a Fake Notification
    </Button>
  );
};
