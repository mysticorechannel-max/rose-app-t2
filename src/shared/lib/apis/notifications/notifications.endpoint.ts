/**
 * Notification API Endpoints
 */
export const NOTIFICATION_ENDPOINTS = {
  // Notifications CRUD
  GET_ALL: "/api/notifications",
  MARK_AS_READ: "/api/notifications/mark-as-read",
  MARK_ALL_READ: "/api/notifications/mark-all-read",
  CLEAR_ALL: "/api/notifications/clear-all",
  DELETE: (id: string) => `/api/notifications/${id}`,
  GET_BY_ID: (id: string) => `/api/notifications/${id}`,

  // Notification Status
  UNREAD_COUNT: "/api/notifications/unread-count",

  // Push Notifications
  PUSH_STATUS: "/api/notifications/push-status",
  VAPID_PUBLIC_KEY: "/api/notifications/vapid-public-key",
  PUSH_SUBSCRIBE: "/api/notifications/subscriptions",
  PUSH_UNSUBSCRIBE: "/api/notifications/subscriptions",
  TEST_PUSH: "/api/notifications/test-push",
} as const;
