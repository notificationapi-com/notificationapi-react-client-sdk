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
import { Divider, Button } from 'antd';
import { MyButton } from './MyButton';

const LiveComponents: React.FC = () => {
  const [preferencesPopupVisibility, setPreferencesPopupVisiblity] =
    useState(false);

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Live Mode</h1>
      <h2 style={{ textAlign: 'center' }}>live connection to the server</h2>
      <div
        style={{
          height: '210vh',
          background: '#e6fffb', // Changed background color to indicate live connection
          padding: 24
        }}
      >
        <NotificationAPIProvider
          clientId="24nojpnrsdc53fkslha0roov05"
          user={{
            id: 'sahand',
            email: 'sahand.seifi@gmail.com'
          }}
        >
          <h2>Popup:</h2>
          <NotificationPopup />

          <Divider />

          <h2>Launcher:</h2>
          <p>Look at the bottom right :)</p>
          <NotificationLauncher />

          <Divider />

          <h2>Counter (Standalone)</h2>
          <NotificationCounter />

          <Divider />

          <h2>Counter on an element</h2>
          <NotificationCounter
            count={(n) => {
              return n.notificationId === 'conversion_failure' && !n.archived;
            }}
          >
            <MyButton />
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

export default LiveComponents;
