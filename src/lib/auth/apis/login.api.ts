import type { LoginRequest, LoginResponse } from "../types/login";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  if (!API_URL) {
    throw new Error("API_URL is not configured");
  }

  const response = await fetch(`${API_URL}/auth/login`, {
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
