"use client";

import { useQuery } from "@tanstack/react-query";


import { notificationKeys } from "../notifications.keys";
import { notificationOptions } from "../notifications.options";
import { getNotifications } from "../notification.api";

/**
 * Query hook to fetch all notifications
 */
export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: getNotifications,
    staleTime: notificationOptions.listStaleTime,
    refetchInterval: notificationOptions.listRefetchInterval,
    retry: notificationOptions.retry,
    retryDelay: notificationOptions.retryDelay,
  });
}
