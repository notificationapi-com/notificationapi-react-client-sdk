export enum Pagination {
  INFINITE_SCROLL = 'infinite_scroll',
  PAGINATED = 'paginated'
}

export enum ImageShape {
  square = 'square',
  circle = 'circle'
}

export enum Filter {
  ALL = 'ALL',
  UNARCHIVED = 'UNARCHIVED'
}

export enum Channels {
  EMAIL = 'EMAIL',
  INAPP_WEB = 'INAPP_WEB',
  SMS = 'SMS',
  CALL = 'CALL',
  PUSH = 'PUSH',
  WEB_PUSH = 'WEB_PUSH'
}

export enum DeliveryOptions {
  OFF = 'off',
  INSTANT = 'instant',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export enum COUNT_TYPE {
  COUNT_UNOPENED_NOTIFICATIONS = 'COUNT_UNOPENED_NOTIFICATIONS',
  COUNT_UNARCHIVED_NOTIFICATIONS = 'COUNT_UNARCHIVED_NOTIFICATIONS'
}

export enum Position {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right'
}

export const NOTIFICATION_ACTIONS = {
  opened: 'opened',
  clicked: 'clicked',
  archived: 'archived',
  replied: 'replied',
  actioned1: 'actioned1',
  actioned2: 'actioned2'
};
