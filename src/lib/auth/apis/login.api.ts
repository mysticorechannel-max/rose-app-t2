import type { LoginRequest, LoginResponse } from "../types/login";
import { AUTH_ENDPOINTS, getAuthApiUrl } from "./auth.endpoint";

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(getAuthApiUrl(AUTH_ENDPOINTS.LOGIN), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as LoginResponse;
}
