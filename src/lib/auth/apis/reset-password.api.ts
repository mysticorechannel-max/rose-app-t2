import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/reset-password";
import { AUTH_ENDPOINTS, getAuthApiUrl } from "./auth.endpoint";

export async function resetPasswordApi(
  values: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  const response = await fetch(getAuthApiUrl(AUTH_ENDPOINTS.RESET_PASSWORD), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as ResetPasswordResponse;
}
