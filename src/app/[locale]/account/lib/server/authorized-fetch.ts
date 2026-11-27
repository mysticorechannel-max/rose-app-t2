import { getToken as getJwt } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

import type { ActionErrorCode, ApiSuccess, FetchResult } from "../types/account";

// The API token lives inside the NextAuth JWT cookie (see src/auth.ts).
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
    // Empty or non-JSON body: there is no payload to read.
    return undefined;
  }
}

function toErrorCode(status: number): ActionErrorCode {
  if (status === 401) return "unauthenticated";
  if (status === 400 || status === 422) return "badRequest";
  return "unknown";
}

export async function authorizedFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<FetchResult<T>> {
  const baseUrl = process.env.API_URL;
  if (!baseUrl) return { ok: false, code: "notConfigured" };

  const token = await getToken();
  if (!token) return { ok: false, code: "unauthenticated" };

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    return { ok: false, code: "network" };
  }

  if (!response.ok) return { ok: false, code: toErrorCode(response.status) };

  const body = (await readJson(response)) as ApiSuccess<T> | undefined;
  return { ok: true, data: body?.payload as T };
}
