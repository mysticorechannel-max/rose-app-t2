"use client";

import { useQuery } from "@tanstack/react-query";
import { getVapidPublicKey, getPushStatus } from "../push-notification.api";
import { notificationKeys } from "../notifications.keys";

/**
 * Query hook to fetch VAPID public key
 * Returns null data on 404 (not configured) instead of throwing error
 */
export function useVapidPublicKey() {
  return useQuery({
    queryKey: notificationKeys.push.vapidKey,
    queryFn: async () => {
      try {
        return await getVapidPublicKey();
      } catch (error) {
        // If 404 or not configured, return null to allow graceful handling
        if (
          error instanceof Error &&
          (error.message.includes("not configured") || error.message.includes("404"))
        ) {
          console.info("VAPID key is not configured on server - Push notifications disabled");
          return null;
        }
        // Re-throw other errors
        throw error;
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: false, // Don't retry if not configured
  });
}

/**
 * Query hook to fetch push notification status
 */
export function usePushStatus() {
  return useQuery({
    queryKey: notificationKeys.push.status,
    queryFn: async () => {
      try {
        return await getPushStatus();
      } catch (error) {
        // If not authenticated or not configured, return null
        console.info("Could not fetch push status:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
