import type { PushPermissionState, PushSubscriptionPayload } from "@/shared/lib/types/push-notification";

/**
 * Check if browser supports push notifications
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * Get current notification permission state
 */
export function getNotificationPermission(): PushPermissionState {
  if (!isPushNotificationSupported()) return "unsupported";
  return Notification.permission as PushPermissionState;
}

/**
 * Request notification permission from browser
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) {
    throw new Error("Push notifications are not supported in this browser");
  }

  return Notification.requestPermission();
}

/**
 * Convert base64 URL-safe string to Uint8Array
 * Required for VAPID key conversion
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Subscribe to push notifications using service worker
 */
export async function subscribeToPush(vapidPublicKey: string): Promise<PushSubscriptionPayload> {
  if (!isPushNotificationSupported()) {
    throw new Error("Push notifications are not supported in this browser");
  }

  try {
    // Get active service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true, // Required - user must see notifications
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    } as PushSubscriptionOptionsInit);

    // Convert subscription to format expected by backend
    const subscriptionJson = subscription.toJSON();

    if (!subscriptionJson.endpoint || !subscriptionJson.keys?.p256dh || !subscriptionJson.keys?.auth) {
      throw new Error("Invalid push subscription format");
    }

    return {
      endpoint: subscriptionJson.endpoint,
      keys: {
        p256dh: subscriptionJson.keys.p256dh,
        auth: subscriptionJson.keys.auth,
      },
    };
  } catch (error) {
    // Handle subscription errors
    if (error instanceof Error) {
      throw new Error(`Failed to subscribe to push notifications: ${error.message}`);
    }
    throw new Error("Failed to subscribe to push notifications");
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    return false;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    return subscription.unsubscribe();
  }

  return true;
}

/**
 * Get current push subscription
 */
export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushNotificationSupported()) {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}
