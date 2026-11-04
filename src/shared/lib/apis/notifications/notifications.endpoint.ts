export const NOTIFICATION_ENDPOINTS = {
    GET_ALL: "/api/notifications",
    MARK_AS_READ: "/api/notifications/mark-as-read",
    DELETE: (id: string) => `/api/notifications/${id}`,
} as const;
