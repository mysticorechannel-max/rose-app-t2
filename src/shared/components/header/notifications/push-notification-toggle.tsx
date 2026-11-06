"use client";

import { Bell, BellOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";
import { usePushNotification } from "@/shared/hooks/notifications/use-push-notification";

/**
 * Push Notification Toggle Component
 * Allows users to enable/disable push notifications
 */
export function PushNotificationToggle() {
  // Translation
  const t = useTranslations("notifications.push");

  // Hooks
  const {
    status,
    isLoading,
    isSubscribed,
    canEnable,
    canDisable,
    showButton,
    enablePushNotifications,
    disablePushNotifications,
  } = usePushNotification();

  // Functions
  const handleToggle = () => {
    if (canEnable) {
      enablePushNotifications();
    } else if (canDisable) {
      disablePushNotifications();
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "subscribed":
        return t("enabled");
      case "permission-denied":
        return t("permissionDeniedMessage");
      case "unsupported":
        return t("unsupportedMessage");
      case "not-configured":
        return t("notConfiguredMessage");
      case "error":
        return t("errorMessage");
      case "not-enabled":
      default:
        return t("disabled");
    }
  };

  // Don't show button if not configured or unsupported
  if (!showButton) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
      {/* Status text */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">{t("title")}</span>
        <span className="text-xs text-muted-foreground">{getStatusMessage()}</span>
      </div>

      {/* Toggle button */}
      <Button
        variant={isSubscribed ? "destructive" : "default"}
        size="sm"
        onClick={handleToggle}
        disabled={isLoading || status === "permission-denied" || status === "not-configured"}
        className="shrink-0"
      >
        {isLoading ? (
          <span className="text-xs">{t("loading")}</span>
        ) : isSubscribed ? (
          <>
            <BellOff className="h-4 w-4" />
            <span className="text-xs">{t("disable")}</span>
          </>
        ) : (
          <>
            <Bell className="h-4 w-4" />
            <span className="text-xs">{t("enable")}</span>
          </>
        )}
      </Button>
    </div>
  );
}
