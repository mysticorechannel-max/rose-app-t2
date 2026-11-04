import { useMutation } from "@tanstack/react-query";

import { forgotPasswordApi } from "../apis/forgot-password.api";
import type { ForgotPasswordRequest } from "../types/forgot-password";

export default function useForgotPassword() {
  return useMutation({
    mutationFn: (values: ForgotPasswordRequest) =>
      forgotPasswordApi(values),
  });
}