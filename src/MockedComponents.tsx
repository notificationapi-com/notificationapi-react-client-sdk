import React, { useState } from 'react';
import {
  NotificationFeed,
  NotificationPopup,
  NotificationLauncher,
  NotificationCounter,
  NotificationAPIProvider,
  NotificationPreferencesPopup,
  NotificationPreferencesInline
} from '../lib/main';
import { FakeNotification } from './FakeNotification';
import { InAppNotification } from '@notificationapi/core/dist/interfaces';
import { getMarkedClient } from './mockedClient';
import { Button, Divider } from '@mui/material';

const MockedComponents: React.FC = () => {
  const [preferencesPopupVisibility, setPreferencesPopupVisiblity] =
    useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  return (
    <>
      <div
        style={{
          background: '#f5f5f5',
          padding: 24
        }}
      >
        <NotificationAPIProvider
          clientId="24nojpnrc53fkslha0roov05"
          webPushOptInMessage={false}
          user={{
            id: 'mockedUser',
            email: 'mockedUser@gmail.com'
          }}
          client={getMarkedClient(
            '24nojpnrsdc53fha0roov05',
            'mockedUser',
            notifications
          )}
        >
          <FakeNotification
            addToState={(notification: InAppNotification) => {
              setNotifications([...notifications, notification]);
            }}
          />
          <Divider />
          <h2>Popup:</h2>
          <NotificationPopup
            count={(n) => {
              return !n.archived;
            }}
          />

          <Divider />

          <h2>Launcher:</h2>
          <p>Look at the bottom right :)</p>
          <NotificationLauncher
            count={(n) => {
              return !n.archived;
            }}
          />

          <Divider />

          <h2>Counter (Standalone)</h2>
          <NotificationCounter
            count={(n) => {
              return !n.archived;
            }}
          />

          <Divider />

          <h2>Counter on an element</h2>
          <NotificationCounter
            count={(n) => {
              return !n.archived;
            }}
          >
            <Button>Button</Button>
          </NotificationCounter>
          <Divider />
          <h2>Feed:</h2>
          <NotificationFeed infiniteScrollHeight={300} />

          <Divider />
          <h2>Preferences Popup:</h2>
          <Button onClick={() => setPreferencesPopupVisiblity(true)}>
            Preferences Popup
          </Button>
          <NotificationPreferencesPopup
            open={preferencesPopupVisibility}
            onClose={() => {
              setPreferencesPopupVisiblity(false);
            }}
          />

          <h2>Preferences Inline:</h2>
          <NotificationPreferencesInline />
        </NotificationAPIProvider>
      </div>
    </>
  );
};

export default MockedComponents;
