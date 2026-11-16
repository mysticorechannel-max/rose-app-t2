"use server";

import { resetPasswordApi } from "../apis/reset-password.api";
import type { ResetPasswordRequest } from "../types/reset-password";

export async function resetPasswordAction(
  values: ResetPasswordRequest,
): Promise<{ success: true } | { success: false; errorKey: "requestFailed" }> {
  try {
    await resetPasswordApi(values);
    return { success: true };
  } catch (error) {
    console.error("Reset password request failed:", error);
    return { success: false, errorKey: "requestFailed" };
  }
}
