import { ACCOUNT_ENDPOINTS } from "../apis/account.endpoint";
import type { ProfileResult, UserProfile } from "../types/account";
import { authorizedFetch } from "./authorized-fetch";

// A plain server function, not a Server Action: reads are GET and can run during render.
export async function getProfile(): Promise<ProfileResult> {
  const result = await authorizedFetch<{ user: UserProfile }>(ACCOUNT_ENDPOINTS.PROFILE);
  return result.ok ? { ok: true, user: result.data.user } : result;
}
