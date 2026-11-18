"use server";

import { getToken as getJwt } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import { ACCOUNT_ENDPOINTS } from "../apis/account.endpoint";
import type {
  ActionResult,
  ApiError,
  ApiSuccess,
  ChangePasswordBody,
  UpdateProfileBody,
  UserProfile,
} from "../types/account";

export type ProfileResult =
  | { ok: true; user: UserProfile }
  | { ok: false; message: string };

type FetchResult<T> = { ok: true; data: T } | { ok: false; message: string };

// Token source: the API token stored inside the NextAuth JWT (see src/auth.ts).
async function getToken(): Promise<string | undefined> {
  const jwt = await getJwt({
    req: { headers: await headers(), cookies: await cookies() } as never,
    secret: process.env.NEXTAUTH_SECRET,
  });
  return jwt?.accessToken;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    // Empty or non-JSON body: there are no details to read.
    return undefined;
  }
}

function getErrorMessage(error: ApiError | undefined, fallback: string): string {
  return error?.errors?.[0]?.messages?.[0] ?? error?.message ?? fallback;
}

async function authorizedFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<FetchResult<T>> {
  const baseUrl = process.env.API_URL;
  if (!baseUrl) return { ok: false, message: "API URL is not configured." };

  const token = await getToken();
  if (!token) return { ok: false, message: "Not authenticated." };

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = await readJson(response);

  if (!response.ok) {
    const fallback = `${response.status}: ${response.statusText}`;
    return { ok: false, message: getErrorMessage(body as ApiError | undefined, fallback) };
  }

  return { ok: true, data: (body as ApiSuccess<T> | undefined)?.payload as T };
}

export async function changePasswordAction(body: ChangePasswordBody): Promise<ActionResult> {
  const result = await authorizedFetch<undefined>(ACCOUNT_ENDPOINTS.CHANGE_PASSWORD, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return result.ok ? { ok: true } : result;
}

export async function getProfileAction(): Promise<ProfileResult> {
  const result = await authorizedFetch<{ user: UserProfile }>(ACCOUNT_ENDPOINTS.PROFILE);
  return result.ok ? { ok: true, user: result.data.user } : result;
}

export async function updateProfileAction(body: UpdateProfileBody): Promise<ProfileResult> {
  const result = await authorizedFetch<{ user: UserProfile }>(ACCOUNT_ENDPOINTS.PROFILE, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return result.ok ? { ok: true, user: result.data.user } : result;
}

export async function deleteAccountAction(): Promise<ActionResult> {
  const result = await authorizedFetch<undefined>(ACCOUNT_ENDPOINTS.DELETE_ACCOUNT, {
    method: "DELETE",
  });
  return result.ok ? { ok: true } : result;
}