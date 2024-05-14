// import React, { PropsWithChildren, useContext } from "react";
// import { NotificationAPIContext } from "../Provider";
// import { Badge } from "antd";
// import { BellOutlined } from "@ant-design/icons";

// export type NotificationsContainerProps = {
//   // buttonWidth?: number;
//   // buttonHeight?: number;
//   // buttonIcon?: React.ReactNode;
//   width?: number;
//   maxHeight?: number;
//   // unreadCountOffset?: [number, number];
//   imageShape?: keyof typeof ImageShape;
//   pagination?: keyof typeof Pagination;
//   pageSize?: number;
//   pagePosition?: "top" | "bottom";
//   onWebsocketConnected?: () => any;
//   onWebsocketDisconnected?: () => any;
//   onNewNotification?: (notification: any) => any;
//   initialLoadMaxCount?: number;
//   initialLoadMaxAge?: Date;
// };

// export const NotificationsContainer: React.FunctionComponent<
//   PropsWithChildren<NotificationsContainerProps>
// > = (props) => {
//   // defaults
//   const defaultConfigs: Required<NotificationsContainerProps> = {
//     // type: Type.CORNER,
//     // buttonWidth: props.type === Type.POPUP ? 32 : 48,
//     // buttonHeight: props.type === Type.POPUP ? 32 : 48,
//     // buttonIcon: <BellOutlined />,
//     width: 320,
//     maxHeight: 600,
//     // unreadCountOffset: props.type === Type.CORNER ? [-6, 5] : [-8, 7],
//     imageShape: "circle",
//     pagination: "INFINITE_SCROLL",
//     pageSize: 5,
//     pagePosition: "top",
//     onWebsocketConnected: () => {},
//     onWebsocketDisconnected: () => {},
//     onNewNotification: () => {},
//     initialLoadMaxCount: 1000,
//     initialLoadMaxAge: new Date(new Date().setMonth(new Date().getMonth() - 3)),
//   };

//   const config = {
//     ...defaultConfigs,
//     ...props,
//   };

//   // states
//   const context = useContext(NotificationAPIContext);
//   if (!context) {
//     return null;
//   }

//   // const UnreadCount: React.FunctionComponent<PropsWithChildren> = (props) => {
//   //   return (
//   //     <Badge
//   //       count={context.notifications.filter((n) => !n.seen).length}
//   //       size="small"
//   //       offset={config.unreadCountOffset}
//   //     >
//   //       {props.children}
//   //     </Badge>
//   //   );
//   // };

//   return <>{props.children}</>;

//   // return (
//   //   <div>
//   //     <Popover
//   //       trigger="click"
//   //       content={<Inbox {...config} {...context} />}
//   //       arrow={false}
//   //       overlayStyle={{
//   //         padding: "0 16px",
//   //       }}
//   //       overlayInnerStyle={{
//   //         maxHeight: "80vh",
//   //       }}
//   //     >
//   //       {config.type === Type.CORNER ? (
//   //         <div
//   //           style={{
//   //             position: "fixed",
//   //             right: 16,
//   //             bottom: 16,
//   //           }}
//   //         >
//   //           <UnreadCount>
//   //             <Button
//   //               style={{
//   //                 width: config.buttonWidth,
//   //                 height: config.buttonHeight,
//   //               }}
//   //               icon={
//   //                 <BellOutlined
//   //                   style={{
//   //                     fontSize: config.buttonHeight / 3,
//   //                   }}
//   //                 />
//   //               }
//   //               shape="circle"
//   //             />
//   //           </UnreadCount>
//   //         </div>
//   //       ) : config.type === Type.POPUP ? (
//   //         <div
//   //           style={{
//   //             display: "inline-block",
//   //           }}
//   //         >
//   //           <UnreadCount>
//   //             <Button
//   //               icon={
//   //                 <BellOutlined
//   //                   style={{
//   //                     fontSize: config.buttonHeight / 2,
//   //                   }}
//   //                 />
//   //               }
//   //               style={{
//   //                 width: config.buttonWidth,
//   //                 height: config.buttonHeight,
//   //               }}
//   //               shape="circle"
//   //               type="text"
//   //             />
//   //           </UnreadCount>
//   //         </div>
//   //       ) : null}
//   //     </Popover>
//   //   </div>
//   // );
// };
