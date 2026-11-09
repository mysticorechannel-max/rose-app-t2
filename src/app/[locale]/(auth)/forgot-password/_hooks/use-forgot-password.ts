import { useMutation } from "@tanstack/react-query";

import { forgotPasswordApi } from "../../../../../lib/auth/apis/forgot-password.api";
import type { ForgotPasswordRequest } from "../../../../../lib/auth/types/forgot-password";

export default function useForgotPassword() {
  return useMutation({
    mutationFn: (values: ForgotPasswordRequest) =>
      forgotPasswordApi(values),
  });
}