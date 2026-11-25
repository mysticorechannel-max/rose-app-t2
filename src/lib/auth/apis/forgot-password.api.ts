import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "../types/forgot-password";
import { AUTH_ENDPOINTS, getAuthApiUrl } from "./auth.endpoint";

export async function forgotPasswordApi(
  values: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  const response = await fetch(getAuthApiUrl(AUTH_ENDPOINTS.FORGOT_PASSWORD), {
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

  return data as ForgotPasswordResponse;
}
