import React, { PropsWithChildren, createContext } from "react";

type Props = {
  clientId: string;
  userId: string;
};

export const NotificationAPIContext = createContext({
  clientId: "",
  userId: "",
});

export const NotificatinAPIProvider: React.FunctionComponent<
  PropsWithChildren<Props>
> = (props) => {
  if (props.children === undefined) return null;

  return (
    <NotificationAPIContext.Provider
      value={{
        clientId: props.clientId,
        userId: props.userId,
      }}
    >
      {props.children}
    </NotificationAPIContext.Provider>
  );
};
