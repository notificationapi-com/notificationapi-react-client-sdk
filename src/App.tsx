import React from 'react';
import { Button, Divider } from 'antd';
import {
  NotificationFeed,
  NotificationPopup,
  NotificationLauncher,
  NotificationCounter,
  NotificationAPIProvider,
  NotificationPreferencesPopup,
  NotificationPreferencesInline
} from '../lib/main';
import { MyButton } from './MyButton';

function App() {
  const [preferencesPopupVisibility, setPreferencesPopupVisiblity] =
    React.useState(false);

  return (
    <div
      style={{
        height: '200vh',
        background: '#f0f2f5',
        padding: 24
      }}
    >
      <NotificationAPIProvider
        userId="sahand"
        clientId="24nojpnrsdc53fkslha0roov05"
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
  );
}

export default App;
