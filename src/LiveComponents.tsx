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
import { Button, Divider, TextField, Grid2 } from '@mui/material';

interface LiveComponentsProps {
  isMocked: boolean;
  setIsMocked: (isMocked: boolean) => void;
}

const LiveComponents: React.FC<LiveComponentsProps> = ({
  isMocked,
  setIsMocked
}) => {
  const [clientId, setClientId] = useState('24nojpnrsdc53fkslha0roov05');
  const [userId, setUserId] = useState('sahand');
  const [preferencesPopupVisibility, setPreferencesPopupVisiblity] =
    useState(false);

  return (
    <>
      <Grid2
        container
        justifyContent={'space-between'}
        sx={{ paddingX: 3, paddingTop: 1 }}
      >
        <Grid2 container spacing={2}>
          <TextField
            label="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Grid2>

        <Grid2 container>
          <Button
            onClick={() => setIsMocked(!isMocked)}
            variant="contained"
            color="primary"
          >
            {isMocked ? '🔴 Mocked' : '🟢 Live'} - Switch to{' '}
            {isMocked ? 'Live' : 'Mocked'} Mode
          </Button>
        </Grid2>
      </Grid2>
      <div
        style={{
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
          <NotificationLauncher
            buttonStyles={{ backgroundColor: '#000' }}
            iconColor="white"
          />

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
            <Button variant="contained" color="primary">
              Button
            </Button>
          </NotificationCounter>

          <Divider sx={{ marginTop: 3 }} />

          <h2>Feed:</h2>
          <NotificationFeed infiniteScrollHeight={300} />

          <Divider sx={{ marginTop: 3 }} />

          <h2>Preferences Popup:</h2>
          <Button
            onClick={() => setPreferencesPopupVisiblity(true)}
            variant="contained"
            color="primary"
          >
            Preferences Popup
          </Button>
          <NotificationPreferencesPopup
            open={preferencesPopupVisibility}
            onClose={() => {
              setPreferencesPopupVisiblity(false);
            }}
          />

          <Divider sx={{ marginTop: 3 }} />

          <h2>Preferences Inline:</h2>
          <NotificationPreferencesInline />
        </NotificationAPIProvider>
      </div>
    </>
  );
};

export default LiveComponents;
