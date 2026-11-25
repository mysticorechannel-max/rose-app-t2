"use server";

import { forgotPasswordApi } from "../apis/forgot-password.api";
import type { ForgotPasswordRequest } from "../types/forgot-password";

export async function forgotPasswordAction(
  values: ForgotPasswordRequest,
): Promise<{ success: true } | { success: false; errorKey: "requestFailed" }> {
  try {
    await forgotPasswordApi(values);
    return { success: true };
  } catch (error) {
    console.error("Forgot password request failed:", error);
    return { success: false, errorKey: "requestFailed" };
  }
}
