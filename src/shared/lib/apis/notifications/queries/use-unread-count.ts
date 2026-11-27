"use client";

import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../notification.api";
import { notificationKeys } from "../notifications.keys";

/**
 * Query hook to fetch unread notifications count
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadCount,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}
