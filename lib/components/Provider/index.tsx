import React, { PropsWithChildren, createContext, useEffect } from "react";

type Props = {
  clientId: string;
  userId: string;
  apiURL?: string;
  wsURL?: string;
};

// Context should be Required<Props> + some custom properties:

type Context = Required<Props>;

export const NotificationAPIContext = createContext<Context | undefined>(
  undefined
);

export const NotificatinAPIProvider: React.FunctionComponent<
  PropsWithChildren<Props>
> = (props) => {
  const apiURL = props.apiURL ?? "https://api.notificationapi.com";
  const wsURL = props.wsURL ?? "wss://ws.notificationapi.com";

  useEffect(() => {
    // fetch server defaults
  });

  return (
    <NotificationAPIContext.Provider
      value={{
        clientId: props.clientId,
        userId: props.userId,
        apiURL,
        wsURL,
      }}
    >
      {props.children}
    </NotificationAPIContext.Provider>
  );
};
