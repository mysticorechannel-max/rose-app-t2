import { resetPasswordAction } from "@/lib/auth/actions/reset-password.action";
import { useMutation } from "@tanstack/react-query";


export default function useResetPassword() {
  return useMutation({
    mutationFn: async (values: Parameters<typeof resetPasswordAction>[0]) => {
      try {
        return await resetPasswordAction(values);
      } catch {
        return { success: false as const, errorKey: "requestFailed" as const };
      }
    },
  });
}
