"use server";

import { forgotPasswordApi } from "../apis/forgot-password.api";
import type { ForgotPasswordRequest } from "../types/forgot-password";

export async function forgotPasswordAction(
  values: ForgotPasswordRequest,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await forgotPasswordApi(values);
    return { success: true, message: response.message };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
