import {
  DeleteNotificationResponse,
  MarkAsReadPayload,
  MarkAsReadResponse,
  NotificationResponse,
} from "@/shared/lib/types/notification";
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
 * Fetch all notifications for the current user
 */
export async function getNotifications(): Promise<NotificationResponse> {
  const response = await fetch(`${BASE_URL}${NOTIFICATION_ENDPOINTS.GET_ALL}`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
}

/**
 * Mark notifications as read
 */
export async function markNotificationsAsRead(
  payload: MarkAsReadPayload
): Promise<MarkAsReadResponse> {
  const response = await fetch(`${BASE_URL}${NOTIFICATION_ENDPOINTS.MARK_AS_READ}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to mark notifications as read");
  }

  return response.json();
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<DeleteNotificationResponse> {
  const response = await fetch(`${BASE_URL}${NOTIFICATION_ENDPOINTS.DELETE(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete notification");
  }

  return response.json();
}
