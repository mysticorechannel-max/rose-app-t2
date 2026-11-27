"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useVapidPublicKey, usePushStatus } from "@/shared/lib/apis/notifications/queries/use-push-config";
import { useSubscribePush } from "@/shared/lib/apis/notifications/mutations/use-subscribe-push";
import { useUnsubscribePush } from "@/shared/lib/apis/notifications/mutations/use-unsubscribe-push";
import {
  isPushNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  getCurrentPushSubscription,
} from "@/shared/lib/utils/push-notification.util";
import type { PushNotificationStatus } from "@/shared/lib/types/push-notification";

/**
 * Custom hook to manage push notification state and operations
 */
export function usePushNotification() {
  // Translation
  const t = useTranslations("notifications.push");

  // State
  const [status, setStatus] = useState<PushNotificationStatus>("not-enabled");
  const [isLoading, setIsLoading] = useState(false);

  // Queries & Mutations
  const { data: vapidKey, isLoading: isVapidKeyLoading } = useVapidPublicKey();
  const { data: pushStatus, isLoading: isPushStatusLoading } = usePushStatus();
  const { mutateAsync: subscribeToServer } = useSubscribePush();
  const { mutateAsync: unsubscribeFromServer } = useUnsubscribePush();

  // Functions
  const checkPushStatus = useCallback(async () => {
    // Check if browser supports push notifications
    if (!isPushNotificationSupported()) {
      setStatus("unsupported");
      return;
    }

    // Check if VAPID key is available (server configured)
    if (!vapidKey?.payload?.publicKey) {
      setStatus("not-configured");
      return;
    }

    // Check browser permission
    const permission = getNotificationPermission();

    if (permission === "denied") {
      setStatus("permission-denied");
      return;
    }

    // Check server-side subscription status
    if (pushStatus?.payload?.isSubscribed) {
      setStatus("subscribed");
      return;
    }

    // Check local browser subscription as fallback
    const subscription = await getCurrentPushSubscription();

    if (subscription) {
      setStatus("subscribed");
    } else {
      setStatus("not-enabled");
    }
  }, [vapidKey, pushStatus]);

  const enablePushNotifications = useCallback(async () => {
    setIsLoading(true);

    try {
      // Check browser support
      if (!isPushNotificationSupported()) {
        toast.error(t("unsupported"));
        setStatus("unsupported");
        return;
      }

      // Check server configuration
      if (!vapidKey?.payload?.publicKey) {
        toast.error(t("notConfigured"));
        setStatus("not-configured");
        return;
      }

      // Request browser permission
      const permission = await requestNotificationPermission();

      if (permission === "denied") {
        toast.error(t("permissionDenied"));
        setStatus("permission-denied");
        return;
      }

      if (permission !== "granted") {
        toast.error(t("permissionRequired"));
        return;
      }

      // Subscribe to push notifications
      const subscription = await subscribeToPush(vapidKey.payload.publicKey);

      // Send subscription to backend
      await subscribeToServer(subscription);

      setStatus("subscribed");
    } catch (error) {
      console.error("Enable push notifications error:", error);
      setStatus("error");
      toast.error(error instanceof Error ? error.message : t("subscribeError"));
    } finally {
      setIsLoading(false);
    }
  }, [vapidKey, subscribeToServer, t]);

  const disablePushNotifications = useCallback(async () => {
    setIsLoading(true);

    try {
      // Unsubscribe from browser
      await unsubscribeFromPush();

      // Remove subscription from backend
      await unsubscribeFromServer();

      setStatus("not-enabled");
    } catch (error) {
      console.error("Disable push notifications error:", error);
      toast.error(error instanceof Error ? error.message : t("unsubscribeError"));
    } finally {
      setIsLoading(false);
    }
  }, [unsubscribeFromServer, t]);

  // Effects
  useEffect(() => {
    if (!isVapidKeyLoading && !isPushStatusLoading) {
      checkPushStatus();
    }
  }, [vapidKey, pushStatus, isVapidKeyLoading, isPushStatusLoading, checkPushStatus]);

  return {
    status,
    isLoading: isLoading || isVapidKeyLoading || isPushStatusLoading,
    isSubscribed: status === "subscribed",
    canEnable: status === "not-enabled" || status === "error",
    canDisable: status === "subscribed",
    showButton: status !== "unsupported", // Show button except when unsupported
    enablePushNotifications,
    disablePushNotifications,
    checkPushStatus,
  };
}
