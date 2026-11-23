import "server-only";

import { cookies, headers } from "next/headers";
import { getToken } from "next-auth/jwt";

// The API token lives inside the NextAuth JWT cookie (see src/auth.ts).
export async function getAccessToken(): Promise<string | undefined> {
  const jwt = await getToken({
    req: { headers: await headers(), cookies: await cookies() } as never,
    secret: process.env.NEXTAUTH_SECRET,
  });

  return jwt?.accessToken;
}
