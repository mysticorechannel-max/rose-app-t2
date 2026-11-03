"use client";

import { CheckCheck, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";

interface NotificationHeaderProps {
  count: number;
  onClearAll: () => void;
  onMarkAllAsRead: () => void;
  hasNotifications: boolean;
}

export function NotificationHeader({
  count,
  onClearAll,
  onMarkAllAsRead,
  hasNotifications,
}: NotificationHeaderProps) {
  const t = useTranslations("notifications");

  return (
    <div className="bg-bg-primary-saturated rounded-t-lg">
      <h3 className="text-lg font-semibold text-text-inverse px-4 pt-4 pb-3">
        {t("title")} {count > 0 && `(${count})`}
      </h3>

      {hasNotifications && (
        <div className="flex items-center justify-between gap-2 px-4 pb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-text-inverse hover:text-text-inverse hover:bg-white/10 gap-2 h-8"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-xs">{t("clearAll")}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-text-inverse hover:text-text-inverse hover:bg-white/10 gap-2 h-8"
          >
            <CheckCheck className="h-4 w-4" />
            <span className="text-xs">{t("markAllAsRead")}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
