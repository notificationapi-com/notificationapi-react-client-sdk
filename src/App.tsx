import { useState } from 'react';
import { Button } from 'antd';
import LiveConnections from './LiveComponents';
import MockedComponents from './MockedComponents';

function App() {
  const [isMocked, setIsMocked] = useState(false);

  return (
    <>
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
    </>
  );
}

export default App;
