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
  const [clientId, setClientId] = useState('24nojpnrsdc53fkslha0roov05');
  const [userId, setUserId] = useState('sahand');
  const [preferencesPopupVisibility, setPreferencesPopupVisiblity] =
    useState(false);

  return (
    <>
      <div>
        <label>Client ID:</label>
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
      </div>
      <div>
        <label>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div
        style={{
          background: '#f5f5f5',
          padding: 24
        }}
      >
        <NotificationAPIProvider
          clientId={clientId}
          userId={userId}
          playSoundOnNewNotification={true}
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

          <Divider />

          <MyButton />
        </NotificationAPIProvider>
      </div>
    </>
  );
};

export default LiveComponents;
