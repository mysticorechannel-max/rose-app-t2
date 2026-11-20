import "server-only";

export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
} as const;

type AuthEndpoint = (typeof AUTH_ENDPOINTS)[keyof typeof AUTH_ENDPOINTS];

const API_URL = process.env.API_URL;

export function getAuthApiUrl(endpoint: AuthEndpoint): string {
  if (!API_URL) {
    throw new Error("API_URL is not configured");
  }

  const baseUrl = new URL(API_URL);
  const basePath = baseUrl.pathname.replace(/\/+$/, "");
  const endpointPath =
    basePath.endsWith("/api") && endpoint.startsWith("/api/")
      ? endpoint.slice("/api".length)
      : endpoint;

  baseUrl.pathname = `${basePath}${endpointPath}`;

  return baseUrl.toString();
}
