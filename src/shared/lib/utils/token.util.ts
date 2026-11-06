const TOKEN_KEY = "auth_token";

// Default token for development (your provided token)
const DEFAULT_DEV_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMmNmODIyNS05MjlhLTQ3OGItYmM0Zi1hMGQwMzk4NGNhMGYiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3OTM5MDk5OTQsImV4cCI6MTc5NDUxNDc5NH0.U3j5rGFt4I_Is1le6HS2mBNb-rmWR46poU4nWHupsDE";

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue || null;
  }

  return null;
}

/**
 * Set a cookie with optional expiration
 */
function setCookie(name: string, value: string, days?: number): void {
  if (typeof document === "undefined") return;

  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  // HttpOnly can't be set from JavaScript, but we set Secure and SameSite
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  document.cookie = `${name}=${value}${expires}; path=/${secure}; SameSite=Strict`;
}

/**
 * Delete a cookie
 */
function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Get auth token from cookies
 * Falls back to dev token in development if none exists
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = getCookie(TOKEN_KEY);

  // If no token exists in cookies, use dev token in development
  if (!token && process.env.NODE_ENV === "development") {
    return DEFAULT_DEV_TOKEN;
  }

  return token;
}

/**
 * Set auth token in cookies (expires in 7 days)
 */
export function setAuthToken(token: string, days: number = 7): void {
  if (typeof window === "undefined") return;
  setCookie(TOKEN_KEY, token, days);
}

/**
 * Remove auth token from cookies
 */
export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  deleteCookie(TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Set default dev token (for development only)
 */
export function setDevToken(): void {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV === "development") {
    setAuthToken(DEFAULT_DEV_TOKEN);
  }
}
