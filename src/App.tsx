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
import { FakeNotification } from './FakeNotification';

function App() {
  const [preferencesPopupVisibility, setPreferencesPopupVisiblity] =
    React.useState(false);
  const [isLiveMode, setIsLiveMode] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsLiveMode(!isLiveMode)}>
        Switch to {isLiveMode ? 'Mocked' : 'Live'} Mode
      </Button>
      {isLiveMode ? (
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
              // connectionMode="mocked"
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
                  return (
                    n.notificationId === 'conversion_failure' && !n.archived
                  );
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
      ) : (
        <>
          <h1 style={{ textAlign: 'center' }}>Mocked:</h1>
          <h2 style={{ textAlign: 'center' }}>
            Experience the magic of notifications!
          </h2>
          <div
            style={{
              height: '210vh',
              background: '#f0f2f5',
              padding: 24
            }}
          >
            <NotificationAPIProvider
              clientId="24nojpnrsdc53fkslha0roov05"
              user={{
                id: 'mockedUser',
                email: 'mockedUser@gmail.com'
              }}
              connectionMode="mocked"
            >
              <h3 style={{ textAlign: 'center' }}>
                Fill out the form below to generate a fake notification and see
                it in action!
              </h3>
              <FakeNotification />
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
      )}
    </>
  );
}

export default App;
