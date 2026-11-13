"use server";

import { resetPasswordApi } from "../apis/reset-password.api";
import type { ResetPasswordRequest } from "../types/reset-password";

export async function resetPasswordAction(
  values: ResetPasswordRequest,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await resetPasswordApi(values);
    return { success: true, message: response.message };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
