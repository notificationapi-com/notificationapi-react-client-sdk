import { useState } from 'react';
import LiveConnections from './LiveComponents';
import MockedComponents from './MockedComponents';
import { Button } from '@mui/material';

function App() {
  const [isMocked, setIsMocked] = useState(false);

  return (
    <div>
      <Button
        onClick={() => setIsMocked(!isMocked)}
        style={{
          position: 'absolute',
          right: 20,
          top: 20
        }}
      >
        {isMocked ? '🔴 Mocked' : '🟢 Live'} - Switch to{' '}
        {isMocked ? 'Live' : 'Mocked'} Mode
      </Button>
      {isMocked ? <MockedComponents /> : <LiveConnections />}
    </div>
  );
}

export default App;
