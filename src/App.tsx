import React from 'react';
import { Button } from 'antd';
import LiveConnections from './LiveComponents';
import MockedComponents from './MockedComponents';

function App() {
  const [isLiveMode, setIsLiveMode] = React.useState(true);

  return (
    <>
      <Button onClick={() => setIsLiveMode(!isLiveMode)}>
        {isLiveMode ? '🔴' : '🟢'} Switch to {isLiveMode ? 'Mocked' : 'Live'}{' '}
        Mode
      </Button>
      {isLiveMode ? <LiveConnections /> : <MockedComponents />}
    </>
  );
}

export default App;
