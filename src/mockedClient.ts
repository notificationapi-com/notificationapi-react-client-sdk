import { NotificationAPIClientSDK } from '@notificationapi/core';
import {
  GetPreferencesResponse,
  InAppNotification
} from '@notificationapi/core/dist/interfaces';

export const getMarkedClient = (
  clientId: string,
  userId: string,
  inAppNotification: InAppNotification[]
): typeof NotificationAPIClientSDK => {
  const client: typeof NotificationAPIClientSDK = NotificationAPIClientSDK.init(
    {
      clientId,
      userId
    }
  );
  const mockedClient: typeof NotificationAPIClientSDK = {
    ...client,
    websocket: {
      object: undefined,
      connect: function (): WebSocket {
        console.log('connect method called');
        throw new Error('Function not implemented.');
      },
      disconnect: function (): void {
        console.log('disconnect method called');
        throw new Error('Function not implemented.');
      }
    },
    openWebSocket: function (): WebSocket {
      return {} as WebSocket;
    },
    updateInAppNotifications: function () {
      // eslint-disable-next-line compat/compat
      return Promise.resolve({});
    },
    getPreferences: async () => {
      // Implement the getPreferences method logic here
      const response: GetPreferencesResponse = {
        preferences: [], // Add actual preferences data here
        notifications: [], // Add actual notifications data here
        subNotifications: [] // Add actual subNotifications data here
      };
      // eslint-disable-next-line compat/compat
      return Promise.resolve(response);
    },
    identify: function (): Promise<void> {
      // eslint-disable-next-line compat/compat
      return Promise.resolve();
    }
  };
  mockedClient.rest.getNotifications = async () => {
    const response = {
      notifications: inAppNotification, // Add actual items data here
      hasMore: false, // Set the actual value here
      oldestReceived: '' // Set the actual value here
    };
    // eslint-disable-next-line compat/compat
    return Promise.resolve(response);
  };
  mockedClient.rest.getPreferences = async () => {
    // Implement the getPreferences method logic here
    const response: GetPreferencesResponse = {
      preferences: [], // Add actual preferences data here
      notifications: [], // Add actual notifications data here
      subNotifications: [] // Add actual subNotifications data here
    };
    // eslint-disable-next-line compat/compat
    return Promise.resolve(response);
  };
  return mockedClient;
};
