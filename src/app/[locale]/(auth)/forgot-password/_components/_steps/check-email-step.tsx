
"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CheckEmailStepProps {
  email: string;
  onBack: () => void;
}

export default function CheckEmailStep({
  email,
  onBack,
}: CheckEmailStepProps) {
  const t = useTranslations("ForgotPassword");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex size-7 shrink-0 items-center justify-center rounded-md bg-bg-primary text-text-inverse transition hover:bg-bg-primary-saturated"
          aria-label={t("back")}
        >
          {isArabic ? (
            <ArrowRight size={16} />
          ) : (
            <ArrowLeft size={16} />
          )}
        </button>

        <h1 className="text-xl font-semibold text-text-primary">
          {t("checkEmailTitle")}
        </h1>
      </div>

      <div className="mb-6">
        <p className="text-sm text-text-primary">
          {t("checkEmailDescription")}
        </p>

        <p className="text-sm font-medium text-text-info underline underline-offset-2">
          {email}
        </p>
      </div>

      <div className="space-y-3 border-b border-border-muted pb-5">
        <p className="text-base font-normal leading-relaxed text-text-plain">
          {t("checkEmailInstructions")}
        </p>

        <p className="text-base leading-relaxed text-text-default">
          {t("checkEmailReminder")}
        </p>
      </div>

      <div className="pt-4 text-center">
        <p className="text-xs font-medium text-text-plain">
          {t("needHelp")}{" "}
          <button
            type="button"
            className="font-bold text-bg-primary hover:underline"
          >
            {t("contactUs")}
          </button>
        </p>
      </div>
    </div>
  );
}
