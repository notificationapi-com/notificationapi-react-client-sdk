export enum DeliveryOptionsForInappWeb {
  OFF = "off",
  INSTANT = "instant",
}

export interface Template {
  instant: {
    title: string;
    redirectURL: string;
    imageURL: string;
  };
  batch: {
    title: string;
    redirectURL: string;
    imageURL: string;
  };
}

export interface InAppNotification {
  id: string;
  notificationId: string;
  seen: boolean;
  title: string;
  redirectURL?: string;
  imageURL?: string;
  date: string;
  deliveryOptions?: {
    defaultDeliveryOption: DeliveryOptionsForInappWeb;
    [DeliveryOptionsForInappWeb.OFF]?: { enabled: boolean };
    [DeliveryOptionsForInappWeb.INSTANT]?: {
      enabled: boolean;
      batching?: boolean;
      batchingKey?: string;
      batchingWindow?: number;
    };
  };
  template?: Template;
  parameters?: Record<string, unknown>;
  expDate?: number;
  opened?: string;
  clicked?: string;
  archived?: string;
  actioned1?: string;
  actioned2?: string;
  replies?: {
    date: string;
    message: string;
  }[];
}
