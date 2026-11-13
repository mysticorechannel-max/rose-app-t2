import { resetPasswordAction } from "@/lib/auth/actions/reset-password.action";
import { useMutation } from "@tanstack/react-query";


export default function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordAction,
  });
}
