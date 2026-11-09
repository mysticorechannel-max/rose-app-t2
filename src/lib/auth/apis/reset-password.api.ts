import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/reset-password";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function resetPasswordApi(
  values: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  if (!API_URL) {
    throw new Error("API_URL is not configured");
  }

  const response = await fetch(`${API_URL}/auth/reset-password`, {
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