export const notificationOptions = {
  // Stale time for notifications list (10 seconds)
  listStaleTime: 10000,
  
  // Refetch interval for notifications list (30 seconds)
  listRefetchInterval: 30000,
  
  // Cache time for notifications (5 minutes)
  cacheTime: 5 * 60 * 1000,
  
  // Retry failed requests
  retry: 1,
  
  // Retry delay (exponential backoff)
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;
