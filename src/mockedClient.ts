import {
  GetPreferencesResponse,
  InAppNotification
} from '@notificationapi/core/dist/interfaces';

export const mockedClient = {
  config: {
    host: 'sdfsdddd',
    websocketHost: 'websocketHost',
    userId: 'b',
    clientId: 'a',
    hashedUserId: '',
    getInAppDefaultCount: 100,
    getInAppDefaultOldest: '2024-09-17T23:38:53.878Z',
    keepWebSocketAliveForSeconds: 86400
  },
  rest: {
    generic: async () => {
      // Implement the generic method logic here
      return Promise.resolve({});
    },
    getNotifications: async () => {
      const inAppNotification: InAppNotification[] = [];
      const response = {
        notifications: inAppNotification, // Add actual items data here
        hasMore: false, // Set the actual value here
        oldestReceived: '' // Set the actual value here
      };
      return Promise.resolve(response);
    },
    patchNotifications: async () => {
      // Implement the patchNotifications method logic here
      return Promise.resolve({});
    },
    getPreferences: async () => {
      // Implement the getPreferences method logic here
      const response: GetPreferencesResponse = {
        preferences: [], // Add actual preferences data here
        notifications: [], // Add actual notifications data here
        subNotifications: [] // Add actual subNotifications data here
      };
      return Promise.resolve(response);
    },
    postPreferences: async () => {
      // Implement the postPreferences method logic here
      return Promise.resolve({});
    },
    postUser: async () => {
      // Implement the postUser method logic here
      return Promise.resolve({});
    }
  },
  init: function () {
    throw new Error('Function not implemented.');
  },
  websocket: {
    object: undefined,
    connect: function (): WebSocket {
      throw new Error('Function not implemented.');
    },
    disconnect: function (): void {
      throw new Error('Function not implemented.');
    }
  },
  openWebSocket: function (): WebSocket {
    // Create a mock WebSocket object
    const mockWebSocket = {
      send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
        console.log(data);
      },
      close: (code?: number, reason?: string) => {
        console.log(code, reason);
      },
      addEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
      ) => {
        console.log(type, listener, options);
      },
      removeEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
      ) => {
        console.log(type, listener, options);
      },
      dispatchEvent: (event: Event) => {
        console.log(event);
        return true;
      },
      readyState: WebSocket.CONNECTING,
      bufferedAmount: 0,
      extensions: '',
      protocol: '',
      binaryType: 'blob',
      onopen: null,
      onerror: null,
      onclose: null,
      onmessage: null
    } as WebSocket;

    return mockWebSocket;
  },
  getInAppNotifications: function (): Promise<{
    items: InAppNotification[];
    hasMore: boolean;
    oldestReceived: string;
  }> {
    const response = {
      items: [], // Add actual items data here
      hasMore: false, // Set the actual value here
      oldestReceived: '' // Set the actual value here
    };
    return Promise.resolve(response);
  },
  updateInAppNotifications: function () {
    return Promise.resolve({});
  },
  updateDeliveryOption: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
  getPreferences: async () => {
    // Implement the getPreferences method logic here
    const response: GetPreferencesResponse = {
      preferences: [], // Add actual preferences data here
      notifications: [], // Add actual notifications data here
      subNotifications: [] // Add actual subNotifications data here
    };
    return Promise.resolve(response);
  },
  identify: function (): Promise<void> {
    return Promise.resolve();
  }
};
