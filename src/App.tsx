import { Button, Divider } from "antd";
import {
  NotificationFeed,
  NotificationPopup,
  NotificationLauncher,
  NotificationCounter,
  NotificationAPIProvider,
} from "../lib/main";

function App() {
  return (
    <div
      style={{
        height: "200vh",
        background: "#f0f2f5",
        padding: 24,
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
        <NotificationLauncher filter="UNARCHIVED" pagination="PAGINATED" />

        <Divider />

        <h2>Counter (Standalone)</h2>
        <NotificationCounter />

        <Divider />

        <h2>Counter on an element</h2>
        <NotificationCounter>
          <Button>Hello World</Button>
        </NotificationCounter>

        <Divider />

        <h2>Feed:</h2>
        <NotificationFeed infiniteScrollHeight={300} />
      </NotificationAPIProvider>
    </div>
  );
}

export default App;
