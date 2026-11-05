/**
 * React Query keys for notifications and push notifications
 * Centralized to maintain consistency across queries and mutations
 */

export const notificationKeys = {
  // Notifications
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  detail: (id: string) => [...notificationKeys.all, "detail", id] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,

  // Push Notifications
  push: {
    vapidKey: ["vapid-public-key"] as const,
    status: ["push-status"] as const,
  },
} as const;
