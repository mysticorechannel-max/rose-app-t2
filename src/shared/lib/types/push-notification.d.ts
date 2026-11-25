/**
 * Push Notification Types
 */

export type PushPermissionState = "granted" | "denied" | "default" | "unsupported";

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushSubscriptionResponse {
  status: boolean;
  code: number;
  message: string;
  payload?: {
    id: string;
    endpoint: string;
    createdAt: string;
  };
}

export interface PushUnsubscribeResponse {
  status: boolean;
  code: number;
  message: string;
}

export interface PushStatusResponse {
  status: boolean;
  code: number;
  payload: {
    isSubscribed: boolean;
    endpoint?: string;
  };
}

export interface VapidKeyResponse {
  status: boolean;
  code: number;
  payload: {
    publicKey: string;
  };
}

export interface PushConfigResponse {
  status: boolean;
  code: number;
  payload: {
    enabled: boolean;
    publicKey: string;
  };
}

export interface TestPushResponse {
  status: boolean;
  code: number;
  message: string;
}

export type PushNotificationStatus =
  | "not-enabled"
  | "permission-denied"
  | "subscribed"
  | "unsupported"
  | "not-configured"
  | "error";
