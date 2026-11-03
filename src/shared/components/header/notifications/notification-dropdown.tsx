"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { ScrollArea } from "@/shared/ui/scroll-area";

import { useDeleteNotificationMutation } from "@/app/api/notifications/mutations/useDeleteNotification";
import { useMarkAsReadMutation } from "@/app/api/notifications/mutations/useMarkAsRead";
import { useNotificationsQuery } from "@/app/api/notifications/queries/useGetNotifications";
import { NotificationEmptyState } from "./notification-empty-state";
import { NotificationHeader } from "./notification-header";
import { NotificationItem } from "./notification-item";

export function NotificationDropdown() {
  const t = useTranslations("notifications");

  // Queries
  const { data, isLoading } = useNotificationsQuery();

  // Mutations
  const { mutate: markAsRead } = useMarkAsReadMutation();
  const { mutate: deleteNotification } = useDeleteNotificationMutation();

  // Data
  const notifications = data?.payload?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Handlers
  const handleMarkAsRead = (id: string) => {
    markAsRead({ notificationIds: [id] });
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length > 0) {
      markAsRead({ notificationIds: unreadIds });
    }
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const handleClearAll = () => {
    notifications.forEach((notification) => {
      deleteNotification(notification.id);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex h-10 w-6 items-center justify-center
      group cursor-pointer border-0 bg-transparent outline-none"
          aria-label={t("title")}
        >
          <Bell className="h-6 w-6 group-hover:text-primary" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0 border-0 bg-bg-plain shadow-lg">
        <NotificationHeader
          count={notifications.length}
          onClearAll={handleClearAll}
          onMarkAllAsRead={handleMarkAllAsRead}
          hasNotifications={notifications.length > 0}
        />

        {isLoading ? (
          <div className="py-12 text-center text-sm text-text-muted">{t("loading")}</div>
        ) : notifications.length === 0 ? (
          <NotificationEmptyState />
        ) : (
          <ScrollArea className="max-h-[450px]">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
