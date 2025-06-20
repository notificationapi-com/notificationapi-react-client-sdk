import { InAppNotification } from '@notificationapi/core/dist/interfaces';
import { faker } from '@faker-js/faker';
import { Button, Stack } from '@mui/material';

const generateFakeNotifications = (params: {
  title?: string;
  longText?: boolean;
}): InAppNotification => {
  const title =
    params.title ??
    (params.longText
      ? `${faker.person.firstName()} ${faker.person.lastName()} has submitted a very long review for the product ${faker.commerce.productName()} and it needs your immediate attention right now! This is a really long notification that should cause wrapping.`
      : `${faker.person.firstName()} reviewed ${faker.commerce.productName()}`);

  return {
    id: new Date().getTime().toString(),
    notificationId: 'fake notificaitonId',
    template: {
      instant: {
        title,
        redirectURL: '#',
        imageURL: faker.image.avatar()
      },
      batch: {
        title,
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
    <Stack direction="row" spacing={2}>
      <Button
        onClick={() => addToState(generateFakeNotifications({}))}
        variant="contained"
        color="primary"
      >
        Add Short Notification
      </Button>
      <Button
        onClick={() =>
          addToState(generateFakeNotifications({ longText: true }))
        }
        variant="contained"
        color="primary"
      >
        Add Long Notification
      </Button>
    </Stack>
  );
};
