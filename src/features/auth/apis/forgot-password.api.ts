import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "../types/forgot-password";

const API_URL = process.env.API_URL;

export async function forgotPasswordApi(
  values: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  if (!API_URL) {
    throw new Error("API_URL is not configured");
  }

  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as ForgotPasswordResponse;
}