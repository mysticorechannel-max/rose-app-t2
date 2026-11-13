"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ResetPasswordStep from "./_steps/reset-password-step";
import RequestResetStep from "./_steps/request-reset-step";
import CheckEmailStep from "./_steps/check-email-step";



export default function ForgotPasswordFlow() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState<1 | 2>(1);
  const [submittedEmail, setSubmittedEmail] = useState("");

  // Reset Password Step
  if (token) {
    return <ResetPasswordStep token={token} />;
  }

  // Request Password Reset Step
  if (step === 1) {
    return (
      <RequestResetStep
        onSuccess={(email) => {
          setSubmittedEmail(email);
          setStep(2);
        }}
      />
    );
  }

  // Check Email Step
  return (
    <CheckEmailStep
      email={submittedEmail}
      onBack={() => setStep(1)}
    />
  );
}