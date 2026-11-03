import { SubscribePayload, SubscribeResponse } from "@/shared/lib/types/subscription";
import { SUBSCRIPTION_ENDPOINTS } from "./subscriptions.endpoint";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(
  payload: SubscribePayload
): Promise<SubscribeResponse> {
  const response = await fetch(`${BASE_URL}${SUBSCRIPTION_ENDPOINTS.SUBSCRIBE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to subscribe to newsletter");
  }

  return response.json();
}
