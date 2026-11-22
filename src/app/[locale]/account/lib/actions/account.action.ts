"use server";

import { ACCOUNT_ENDPOINTS } from "../apis/account.endpoint";
import { authorizedFetch } from "../server/authorized-fetch";
import type { ActionResult, ChangePasswordBody, UpdateProfileBody } from "../types/account";

export async function changePasswordAction(body: ChangePasswordBody): Promise<ActionResult> {
  const result = await authorizedFetch<undefined>(ACCOUNT_ENDPOINTS.CHANGE_PASSWORD, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return result.ok ? { ok: true } : result;
}

export async function updateProfileAction(body: UpdateProfileBody): Promise<ActionResult> {
  const result = await authorizedFetch<undefined>(ACCOUNT_ENDPOINTS.PROFILE, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return result.ok ? { ok: true } : result;
}

export async function deleteAccountAction(): Promise<ActionResult> {
  const result = await authorizedFetch<undefined>(ACCOUNT_ENDPOINTS.DELETE_ACCOUNT, {
    method: "DELETE",
  });
  return result.ok ? { ok: true } : result;
}
