import { NotificatinAPIProvider } from "../lib/components/Provider";
import { InAppNotifications, Type } from "../lib/main";

function App() {
  return (
    <div
      style={{
        background: "#f0f0f0",
        height: "200vh",
      }}
    >
      <NotificatinAPIProvider
        userId="123"
        clientId="74763kfj366vdlde4jg20fibj5"
      >
        <InAppNotifications />
      </NotificatinAPIProvider>

      <NotificatinAPIProvider
        userId="sahand"
        clientId="24nojpnrsdc53fkslha0roov05"
      >
        <InAppNotifications type="POPUP" pagination="INFINITE_SCROLL" />
      </NotificatinAPIProvider>

      <NotificatinAPIProvider
        userId="sahand"
        clientId="24nojpnrsdc53fkslha0roov05"
      >
        <InAppNotifications type="INLINE" />
      </NotificatinAPIProvider>
    </div>
  );
}

export default App;
