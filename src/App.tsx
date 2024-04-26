import { NotificatinAPIProvider } from "../lib/components/Provider";
import { InAppNotifications } from "../lib/main";

function App() {
  return (
    <>
      <NotificatinAPIProvider userId="123" clientId="123">
        <InAppNotifications />
      </NotificatinAPIProvider>
    </>
  );
}

export default App;
