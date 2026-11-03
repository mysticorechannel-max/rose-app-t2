"use client";

import { BrushCleaning, CheckCheck } from "lucide-react";
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
        <div className="flex items-center justify-between gap-2 p-2  bg-bg-plain border-b">
          <Button
            variant="ghost"
            onClick={onClearAll}
            className="text-text-plain hover:bg-white/10 gap-2 h-8 cursor-pointer"
          >
            <span className="text-xs">
              <BrushCleaning className="h-4 w-4" />
              {t("clearAll")}
            </span>
          </Button>

          <Button
            variant="ghost"
            onClick={onMarkAllAsRead}
            className="text-text-plain hover:bg-white/10 gap-2 h-8 cursor-pointer"
          >
            <span className="text-xs">
              <CheckCheck className="h-4 w-4" />
              {t("markAllAsRead")}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
