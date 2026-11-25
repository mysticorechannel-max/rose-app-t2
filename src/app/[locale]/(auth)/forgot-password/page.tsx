import { Suspense } from "react";
import ForgotPasswordFlow from "./_components/forgot-password-flow";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordFlow />
    </Suspense>
  );
}