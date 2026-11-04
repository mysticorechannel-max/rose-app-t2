import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import AuthLayout from "@/features/auth/shared/auth-layout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm/>
    </AuthLayout>
  );
}