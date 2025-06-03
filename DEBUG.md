# NotificationAPI React SDK - Debug Mode

This document explains how to use the debug mode in the NotificationAPI React SDK to troubleshoot issues and understand what's happening under the hood.

## Overview

Debug mode provides detailed logging of all SDK operations, making it easier to:

- Diagnose connection issues
- Track notification flow
- Monitor API calls and responses
- Debug WebSocket events
- Identify state changes
- Troubleshoot WebPush setup

## Enabling Debug Mode

### Basic Usage

Add the `debug` prop to your `NotificationAPIProvider`:

```jsx
import { NotificationAPIProvider } from '@notificationapi/react';

function App() {
  return (
    <NotificationAPIProvider
      clientId="your-client-id"
      userId="your-user-id"
      debug={true} // Enable debug mode
    >
      {/* Your app components */}
    </NotificationAPIProvider>
  );
}
```

### Conditional Debug Mode

You can enable debug mode conditionally:

```jsx
const debugMode =
  process.env.NODE_ENV === 'development' ||
  localStorage.getItem('notificationapi-debug') === 'true';

<NotificationAPIProvider
  clientId="your-client-id"
  userId="your-user-id"
  debug={debugMode}
>
  {/* Your app components */}
</NotificationAPIProvider>;
```

### URL Parameter Debug Mode

Enable debug mode via URL parameter:

```jsx
const urlParams = new URLSearchParams(window.location.search);
const debugMode = urlParams.get('debug') === 'true';

<NotificationAPIProvider
  clientId="your-client-id"
  userId="your-user-id"
  debug={debugMode}
>
  {/* Your app components */}
</NotificationAPIProvider>;
```

## What Gets Logged

When debug mode is enabled, you'll see detailed logs in the browser console for:

### 1. Initialization

- Provider setup and configuration
- Client SDK initialization
- User identification
- WebSocket connection establishment

### 2. Notifications

- Fetching notifications (initial and pagination)
- Receiving real-time notifications via WebSocket
- State updates (marking as read, archived, etc.)
- Notification filtering logic

### 3. API Calls

- REST API requests and responses
- Preference updates
- Error responses with context

### 4. WebPush Setup

- Service worker registration
- Permission requests
- Push subscription process
- Error codes and troubleshooting guidance

### 5. State Management

- React state changes
- Local storage operations
- Context updates

## Understanding Debug Output

### Log Groups

Debug logs are organized into collapsible groups in the console:

```
[NotificationAPI Debug] Provider initialization effect
  ├── [NotificationAPI Debug] Resetting state and loading initial data
  ├── [NotificationAPI Debug] Opening WebSocket connection
  └── [NotificationAPI Debug] Fetching user preferences
```

### Log Levels

#### Info Logs (console.log)

- Normal operation events
- State changes
- Configuration details

#### Warning Logs (console.warn)

- Non-critical issues
- Fallback behaviors
- Missing optional features

#### Error Logs (console.error)

- Failed API calls
- Connection errors
- Invalid configurations
- Includes error details, context, and stack traces

### Sample Debug Output

```javascript
[NotificationAPI Debug] NotificationAPI Provider initializing {
  clientId: "your-client-id",
  userId: "user123",
  debug: true,
  timestamp: "2024-01-15T10:30:00.000Z"
}

[NotificationAPI Debug] Configuration loaded {
  apiURL: "api.notificationapi.com",
  wsURL: "ws.notificationapi.com",
  initialLoadMaxCount: 1000,
  // ... other config
}

[NotificationAPI Debug] Initializing NotificationAPI client
├── [NotificationAPI Debug] Client configuration {
    clientId: "your-client-id",
    userId: "user123",
    host: "api.notificationapi.com",
    websocketHost: "ws.notificationapi.com"
  }
├── [NotificationAPI Debug] Identifying user {
    email: "user@example.com"
  }
```

## Troubleshooting Common Issues

### 1. Connection Issues

Look for these logs:

- `[NotificationAPI Debug] Opening WebSocket connection`
- `[NotificationAPI Debug] Client configuration`

Check for errors in network connectivity or configuration.

### 2. No Notifications Loading

Check these logs:

- `[NotificationAPI Debug] Fetching notifications`
- `[NotificationAPI Debug] Fetch successful`

Verify API responses and notification filtering logic.

### 3. WebPush Not Working

Look for:

- `[NotificationAPI Debug] Requesting web push permission`
- `[NotificationAPI Debug] Service worker registration`
- Error codes 18-22 for specific WebPush issues

### 4. Preferences Not Updating

Check:

- `[NotificationAPI Debug] Updating delivery preferences`
- `[NotificationAPI Debug] Preferences updated successfully`

## Error Codes

### WebPush Error Codes

- **18**: Insecure context (not HTTPS)
- **19**: Operation aborted (user denied)
- **20**: Invalid application server key
- **21**: Operation not allowed (notifications blocked)
- **22**: Operation not supported (browser limitation)

## Advanced Usage

### Custom Debug Logger

You can create your own debug logger for custom handling:

```jsx
import { createDebugLogger } from '@notificationapi/react';

const customLogger = createDebugLogger(true);
customLogger.log('Custom debug message', { data: 'example' });
```

### Filtering Debug Logs

Filter debug logs in the console using the search feature:

- `[NotificationAPI Debug]` - All debug logs
- `ERROR:` - Only error logs
- `WebSocket` - WebSocket-related logs
- `notifications` - Notification-related logs

## Production Considerations

### Performance Impact

Debug mode has minimal performance impact but adds console overhead. Always disable in production:

```jsx
const debugMode =
  process.env.NODE_ENV !== 'production' &&
  localStorage.getItem('debug') === 'true';
```

### Security

Debug logs may contain sensitive information. Ensure debug mode is disabled in production environments.

### Log Cleanup

Debug logs don't persist after page refresh, but be mindful of:

- Memory usage in long-running applications
- Console log limits in some browsers

## Support

When reporting issues, please:

1. Enable debug mode
2. Reproduce the issue
3. Copy the relevant console logs
4. Include your configuration (without sensitive data)

This helps our support team diagnose issues quickly and provide better assistance.

## Example Integration

See the example in `src/LiveComponents.tsx` for a complete implementation with a debug mode toggle.
