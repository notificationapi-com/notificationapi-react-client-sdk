import './App.css';
import { useState } from 'react';
import LiveConnections from './LiveComponents';
import MockedComponents from './MockedComponents';

function App() {
  const [isMocked, setIsMocked] = useState(false);

  return (
    <div>
      {isMocked ? (
        <MockedComponents isMocked={isMocked} setIsMocked={setIsMocked} />
      ) : (
        <LiveConnections isMocked={isMocked} setIsMocked={setIsMocked} />
      )}
    </div>
  );
}

export default App;
