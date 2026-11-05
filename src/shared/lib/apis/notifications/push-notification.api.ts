import {
  PushConfigResponse,
  PushStatusResponse,
  PushSubscriptionPayload,
  PushSubscriptionResponse,
  PushUnsubscribeResponse,
  TestPushResponse,
  VapidKeyResponse,
} from "@/shared/lib/types/push-notification";
import { getAuthToken } from "@/shared/lib/utils/token.util";
import { NOTIFICATION_ENDPOINTS } from "./notifications.endpoint";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get auth headers with token
 */
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Get VAPID public key from server
 */
export async function getVapidPublicKey(): Promise<VapidKeyResponse> {
  if (!BASE_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${BASE_URL}${NOTIFICATION_ENDPOINTS.VAPID_PUBLIC_KEY}`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Handle 404 specifically for not configured
    if (response.status === 404) {
      throw new Error(errorData.message || "VAPID public key is not configured on this server");
    }

    throw new Error(errorData.message || "Failed to fetch VAPID public key");
  }

  return response.json();
}

/**
 * Get push notification status (enabled/disabled for current user)
 */
export async function getPushStatus(): Promise<PushStatusResponse> {
  if (!BASE_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${BASE_URL}${NOTIFICATION_ENDPOINTS.PUSH_STATUS}`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch push notification status");
  }

  return response.json();
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(
  payload: PushSubscriptionPayload
): Promise<PushSubscriptionResponse> {
  if (!BASE_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${BASE_URL}${NOTIFICATION_ENDPOINTS.PUSH_SUBSCRIBE}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to subscribe to push notifications");
  }

  return response.json();
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<PushUnsubscribeResponse> {
  if (!BASE_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${BASE_URL}${NOTIFICATION_ENDPOINTS.PUSH_UNSUBSCRIBE}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to unsubscribe from push notifications");
  }

  return response.json();
}

/**
 * Send a test push notification
 */
export async function sendTestPushNotification(): Promise<TestPushResponse> {
  if (!BASE_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${BASE_URL}${NOTIFICATION_ENDPOINTS.TEST_PUSH}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to send test push notification");
  }

  return response.json();
}
