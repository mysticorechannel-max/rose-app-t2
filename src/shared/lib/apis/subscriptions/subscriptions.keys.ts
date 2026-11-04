export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  subscribe: () => [...subscriptionKeys.all, "subscribe"] as const,
} as const;
