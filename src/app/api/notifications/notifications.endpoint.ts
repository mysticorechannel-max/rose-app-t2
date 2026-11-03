export const NOTIFICATION_ENDPOINTS = {
    GET_ALL: "/notifications",
    MARK_AS_READ: "/notifications/mark-as-read",
    DELETE: (id: string) => `/notifications/${id}`,
} as const;