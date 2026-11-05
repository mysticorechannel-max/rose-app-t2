export interface Notification {
  id: string;
  message: string;
  title: string;
  type: string;
  updatedAt: string;
  link: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export interface NotificationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationPayload {
  data: Notification[];
  metadata: NotificationMetadata;
}

export interface NotificationResponse {
  status: boolean;
  code: number;
  payload: NotificationPayload;
}

export interface UnreadCountResponse {
  status: boolean;
  code: number;
  data: {
    unreadCount: number;
  };
}

export interface MarkAsReadPayload {
  notificationIds: string[];
}

export interface MarkAsReadResponse {
  status: boolean;
  code: number;
  message: string;
}

export interface DeleteNotificationResponse {
  status: boolean;
  code: number;
  message: string;
}
