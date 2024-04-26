import { useContext } from "react";
import { NotificationAPIContext } from "../Provider";

export function InAppNotifications() {
  const context = useContext(NotificationAPIContext);
  return <div>Hello {context.userId}</div>;
}
