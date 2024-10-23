import { useState } from 'react';
import { Button } from 'antd';
import LiveConnections from './LiveComponents';
import MockedComponents from './MockedComponents';

function App() {
  const [isMocked, setIsMocked] = useState(false);

  return (
    <>
      <Button onClick={() => setIsMocked(!isMocked)}>
        {isMocked ? '🟢' : '🔴'} Switch to {isMocked ? 'Live' : 'Mocked'} Mode
      </Button>
      {isMocked ? <MockedComponents /> : <LiveConnections />}
    </>
  );
}

export default App;
