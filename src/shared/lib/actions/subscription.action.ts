"use server";

import { SubscribePayload, SubscribeResponse } from "@/shared/lib/types/subscription";
import { SUBSCRIPTION_ENDPOINTS } from "../apis/subscriptions/subscriptions.endpoint";

/**
 * Server Action to subscribe to newsletter
 */
export async function subscribeToNewsletterAction(
  payload: SubscribePayload
): Promise<SubscribeResponse> {
  // Use API_URL for server-side, fallback to NEXT_PUBLIC_API_URL
  const BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!BASE_URL) {
    throw new Error("API URL is not configured. Please set API_URL or NEXT_PUBLIC_API_URL environment variable.");
  }

  const url = `${BASE_URL}${SUBSCRIPTION_ENDPOINTS.SUBSCRIBE}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Try to parse error response
    if (!response.ok) {
      let errorMessage = "Failed to subscribe to newsletter";

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If can't parse JSON, use status text
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // Log error on server for debugging
    console.error("[Newsletter Subscription Error]", {
      url,
      payload,
      error: error instanceof Error ? error.message : String(error),
    });

    // Re-throw for client handling
    throw error instanceof Error ? error : new Error("An unexpected error occurred");
  }
}
