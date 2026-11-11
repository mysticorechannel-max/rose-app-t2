"use client";

import { useTranslations } from "next-intl";

import { type RegisterStep, useRegister } from "../_providers/register-provider";
import { RegisterStepper } from "./register-stepper";
import { StepDone } from "./step-done";
import { StepEmail } from "./step-email";
import { StepOtp } from "./step-otp";
import { StepPassword } from "./step-password";
import { StepProfile } from "./step-profile";

// Stepper position per step (matches Figma: OTP=2, Profile=3, Password=4; Email has none).
const STEP_NUMBER: Partial<Record<RegisterStep, number>> = { otp: 2, profile: 3, password: 4 };

const TITLE_KEYS: Partial<Record<RegisterStep, string>> = {
  otp: "otp.title",
  profile: "profile.title",
  password: "password.title",
};

const SUBTITLE_KEYS: Partial<Record<RegisterStep, string>> = {
  profile: "profile.subtitle",
  password: "password.subtitle",
};

function StepSubtitle() {
  // Translation
  const t = useTranslations("auth.register");

  // Context
  const { step, email, goTo } = useRegister();

  if (step === "otp") {
    return (
      <p className="text-text-plain">
       {t.rich("otp.subtitle", {
  email,
  edit: (chunks) => (
    <button
      type="button"
      onClick={() => goTo("email")}
      className="cursor-pointer rounded-sm font-medium text-text-primary underline outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {chunks}
    </button>
  ),
})}
      </p>
    );
  }

  const subtitleKey = SUBTITLE_KEYS[step];
  return subtitleKey ? <p className="text-text-plain">{t(subtitleKey)}</p> : null;
}

export function RegisterFlow() {
  // Translation
  const t = useTranslations("auth.register");

  // Context
  const { step, ready } = useRegister();

  // Wait for sessionStorage restore so we don't flash the email step after a refresh.
  if (!ready) return <div className="min-h-64" aria-busy />;

  // Variables
  const current = STEP_NUMBER[step];
  const titleKey = TITLE_KEYS[step];

  return (
    <div className="space-y-6">
      {current && <RegisterStepper current={current} label={t("stepperLabel")} />}

      {titleKey && (
        <header className="space-y-1">
          <h1 className="text-text-plain text-3xl font-bold">{t("createAccount")}</h1>
          <h2 className="text-text-primary text-xl font-semibold">{t(titleKey)}</h2>
          <StepSubtitle />
          <hr className="mt-3" />
        </header>
      )}

      {step === "email" && <StepEmail />}
      {step === "otp" && <StepOtp />}
      {step === "profile" && <StepProfile />}
      {step === "password" && <StepPassword />}
      {step === "done" && <StepDone />}
    </div>
  );
}

// "use client";

// import { useTranslations } from "next-intl";

// import { type RegisterStep, useRegister } from "../_providers/register-provider";
// import { RegisterStepper } from "./register-stepper";
// import { StepDone } from "./step-done";
// import { StepEmail } from "./step-email";
// import { StepOtp } from "./step-otp";
// import { StepPassword } from "./step-password";
// import { StepProfile } from "./step-profile";

// // Stepper position per step (matches Figma: OTP=2, Profile=3, Password=4; Email has none).
// const STEP_NUMBER: Partial<Record<RegisterStep, number>> = { otp: 2, profile: 3, password: 4 };

// const HEADINGS: Partial<Record<RegisterStep, { title: string; subtitle: string }>> = {
//   otp: { title: "otp.title", subtitle: "otp.subtitle" },
//   profile: { title: "profile.title", subtitle: "profile.subtitle" },
//   password: { title: "password.title", subtitle: "password.subtitle" },
// };

// export function RegisterFlow() {
//   const t = useTranslations("auth.register");
//   const { step, ready } = useRegister();

//   // Wait for sessionStorage restore so we don't flash the email step after a refresh.
//   if (!ready) return <div className="min-h-64" aria-busy />;

//   const current = STEP_NUMBER[step];
//   const heading = HEADINGS[step];

//   return (
//     <div className="space-y-6">
//       {current && <RegisterStepper current={current} label={t("stepperLabel")} />}

//       {heading && (
//         <header className="space-y-1">
//           <h1 className="text-text-plain text-3xl font-bold">{t("createAccount")}</h1>
//           <h2 className="text-text-primary text-xl font-semibold">{t(heading.title)}</h2>
//           <p className="text-text-plain">{t(heading.subtitle)}</p>
//           <hr className="mt-3" />
//         </header>
//       )}

//       {step === "email" && <StepEmail />}
//       {step === "otp" && <StepOtp />}
//       {step === "profile" && <StepProfile />}
//       {step === "password" && <StepPassword />}
//       {step === "done" && <StepDone />}
//     </div>
//   );
// }
