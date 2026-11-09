import { resetPasswordApi } from "@/lib/auth/apis/reset-password.api";
import { useMutation } from "@tanstack/react-query";


export default function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordApi,
  });
}