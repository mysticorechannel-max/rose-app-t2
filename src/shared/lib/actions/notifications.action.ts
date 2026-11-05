"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { MarkAsReadPayload } from "@/shared/lib/types/notification";
import type { PushSubscriptionPayload } from "@/shared/lib/types/push-notification";
import { NOTIFICATION_ENDPOINTS } from "@/shared/lib/apis/notifications/notifications.endpoint";

const API_URL = process.env.API_URL;

// Default token for development
const DEFAULT_DEV_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMmNmODIyNS05MjlhLTQ3OGItYmM0Zi1hMGQwMzk4NGNhMGYiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3OTM5MDk5OTQsImV4cCI6MTc5NDUxNDc5NH0.U3j5rGFt4I_Is1le6HS2mBNb-rmWR46poU4nWHupsDE";

/**
 * Get auth token from cookies (server-side)
 */
async function getServerAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // Fallback to dev token in development if none exists
  if (!token && process.env.NODE_ENV === "development") {
    return DEFAULT_DEV_TOKEN;
  }

  return token || null;
}

/**
 * Get auth headers with token (server-side)
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getServerAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Mark notifications as read
 */
export async function markNotificationsAsReadAction(payload: MarkAsReadPayload) {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}${NOTIFICATION_ENDPOINTS.MARK_AS_READ}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to mark notifications as read");
    }

    const data = await response.json();

    // Revalidate to update UI
    revalidatePath("/", "layout");

    return { success: true, data };
  } catch (error) {
    console.error("[markNotificationsAsReadAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to mark notifications as read",
    };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsReadAction() {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}${NOTIFICATION_ENDPOINTS.MARK_ALL_READ}`, {
      method: "PATCH",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to mark all notifications as read");
    }

    const data = await response.json();

    // Revalidate to update UI
    revalidatePath("/", "layout");

    return { success: true, data };
  } catch (error) {
    console.error("[markAllNotificationsAsReadAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to mark all notifications as read",
    };
  }
}

/**
 * Delete a notification
 */
export async function deleteNotificationAction(id: string) {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}${NOTIFICATION_ENDPOINTS.DELETE(id)}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete notification");
    }

    const data = await response.json();

    // Revalidate to update UI
    revalidatePath("/", "layout");

    return { success: true, data };
  } catch (error) {
    console.error("[deleteNotificationAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete notification",
    };
  }
}

/**
 * Clear all notifications
 */
export async function clearAllNotificationsAction() {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}${NOTIFICATION_ENDPOINTS.CLEAR_ALL}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to clear all notifications");
    }

    const data = await response.json();

    // Revalidate to update UI
    revalidatePath("/", "layout");

    return { success: true, data };
  } catch (error) {
    console.error("[clearAllNotificationsAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clear all notifications",
    };
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushAction(payload: PushSubscriptionPayload) {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}${NOTIFICATION_ENDPOINTS.PUSH_SUBSCRIBE}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to subscribe to push notifications");
    }

    const data = await response.json();

    // Revalidate to update UI
    revalidatePath("/", "layout");

    return { success: true, data };
  } catch (error) {
    console.error("[subscribeToPushAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to subscribe to push notifications",
    };
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushAction() {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}${NOTIFICATION_ENDPOINTS.PUSH_UNSUBSCRIBE}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to unsubscribe from push notifications");
    }

    const data = await response.json();

    // Revalidate to update UI
    revalidatePath("/", "layout");

    return { success: true, data };
  } catch (error) {
    console.error("[unsubscribeFromPushAction] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to unsubscribe from push notifications",
    };
  }
}

/**
 * Send test push notification
 */
export async function sendTestPushAction() {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}${NOTIFICATION_ENDPOINTS.TEST_PUSH}`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to send test push notification");
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    console.error("[sendTestPushAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send test push notification",
    };
  }
}
