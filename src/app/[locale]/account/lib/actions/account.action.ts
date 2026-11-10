"use server";

import { cookies } from "next/headers";

import { ACCOUNT_ENDPOINTS } from "../apis/account.endpoint";
import { AUTH_COOKIE_NAME } from "../constants/account.constant";
import type {
  ActionResult,
  ApiError,
  ChangePasswordBody,
} from "../types/account";

async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(AUTH_COOKIE_NAME)?.value;
}

function toMessage(data: ApiError | null, fallback: string): string {
  const fieldMessages = data?.errors?.flatMap((error) => error.messages) ?? [];
  return fieldMessages[0] ?? data?.message ?? fallback;
}

export async function changePasswordAction(
  body: ChangePasswordBody
): Promise<ActionResult> {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return { ok: false, message: "API URL is not configured." };

  const token = await getToken();
  if (!token) return { ok: false, message: "Not authenticated." };

  const response = await fetch(`${baseUrl}${ACCOUNT_ENDPOINTS.CHANGE_PASSWORD}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as ApiError | null;
    return {
      ok: false,
      message: toMessage(data, `${response.status}: ${response.statusText}`),
    };
  }

  return { ok: true };
}