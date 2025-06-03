export interface DebugLogger {
  log: (message: string, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
  error: (
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>
  ) => void;
  group: (label: string) => void;
  groupEnd: () => void;
  table: (data: Record<string, unknown> | unknown[]) => void;
}

class NoOpLogger implements DebugLogger {
  log() {}
  warn() {}
  error() {}
  group() {}
  groupEnd() {}
  table() {}
}

class ConsoleLogger implements DebugLogger {
  private prefix = '[NotificationAPI Debug]';

  log(message: string, data?: unknown) {
    console.log(`${this.prefix} ${message}`, data || '');
  }

  warn(message: string, data?: unknown) {
    console.warn(`${this.prefix} ${message}`, data || '');
  }

  error(
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>
  ) {
    console.group(`${this.prefix} ERROR: ${message}`);
    if (error) {
      console.error('Error:', error);
    }
    if (context) {
      console.error('Context:', context);
    }
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
    console.groupEnd();
  }

  group(label: string) {
    console.group(`${this.prefix} ${label}`);
  }

  groupEnd() {
    console.groupEnd();
  }

  table(data: Record<string, unknown> | unknown[]) {
    console.table(data);
  }
}

export const createDebugLogger = (enabled: boolean): DebugLogger => {
  return enabled ? new ConsoleLogger() : new NoOpLogger();
};

export const formatApiCall = (
  method: string,
  endpoint: string,
  params?: Record<string, unknown>
) => {
  return {
    method,
    endpoint,
    params,
    timestamp: new Date().toISOString()
  };
};

export const formatWebSocketEvent = (event: string, data?: unknown) => {
  return {
    event,
    data,
    timestamp: new Date().toISOString()
  };
};

export const formatStateChange = (
  stateName: string,
  oldValue: unknown,
  newValue: unknown
) => {
  return {
    stateName,
    oldValue,
    newValue,
    timestamp: new Date().toISOString()
  };
};
