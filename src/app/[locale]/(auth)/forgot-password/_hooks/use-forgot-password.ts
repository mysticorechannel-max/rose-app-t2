import { useMutation } from "@tanstack/react-query";

import { forgotPasswordAction } from "../../../../../lib/auth/actions/forgot-password.action";
import type { ForgotPasswordRequest } from "../../../../../lib/auth/types/forgot-password";

export default function useForgotPassword() {
  return useMutation({
    mutationFn: (values: ForgotPasswordRequest) => forgotPasswordAction(values),
  });
}
