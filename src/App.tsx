import { Divider } from "antd";
import {
  NotificationFeed,
  NotificationPopup,
  NotificationLauncher,
  NotificationCounter,
  NotificatinAPIProvider,
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
      <NotificatinAPIProvider
        userId="123"
        clientId="74763kfj366vdlde4jg20fibj5"
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

        <h2>Counter (Wrapper)</h2>
        <NotificationCounter>
          <div style={{ border: "1px solid #000", width: 100, height: 100 }} />
        </NotificationCounter>

        <Divider />

        <h2>Feed:</h2>
        <NotificationFeed infiniteScrollHeight={300} />
      </NotificatinAPIProvider>

      {/* <NotificatinAPIProvider
        userId="sahand"
        clientId="24nojpnrsdc53fkslha0roov05"
      >
        <InAppNotifications type="POPUP" pagination="INFINITE_SCROLL" />
      </NotificatinAPIProvider>

      <NotificatinAPIProvider
        userId="123"
        clientId="74763kfj366vdlde4jg20fibj5"
      >
        <InAppNotifications type="INLINE" />
      </NotificatinAPIProvider> */}
    </div>
  );
}

export default App;
