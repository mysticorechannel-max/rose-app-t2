"use client";

import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";


import { NotificationItemMenu } from "./notification-item-menu";
import { Notification } from "@/shared/lib/types/notification";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const locale = useLocale();

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: locale === "ar" ? ar : enUS,
  });

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 border-b border-border last:border-b-0 transition-colors hover:bg-bg-subtle",
        !notification.isRead ? "bg-background" : "bg-bg-subtle"
      )}
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-semibold leading-relaxed break-words mb-1",
            notification.isRead ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {notification.title}
        </p>
        <p
          className={cn(
            "text-xs leading-relaxed break-words mb-1",
            notification.isRead ? "text-muted-foreground" : "text-muted-foreground"
          )}
        >
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>

      {/* Actions menu */}
      <NotificationItemMenu
        notificationId={notification.id}
        isRead={notification.isRead}
        onMarkAsRead={onMarkAsRead}
        onDelete={onDelete}
      />
    </div>
  );
}
