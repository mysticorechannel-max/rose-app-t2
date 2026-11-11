"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

import { useRegister } from "../_providers/register-provider";

export function StepDone() {
  const t = useTranslations("auth.register");
  const { reset } = useRegister();

  // Registration is finished: drop persisted state. (goTo("done") already happened.)
  useEffect(() => {
    try {
      sessionStorage.removeItem("register:state");
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="space-y-6 py-6 text-center">
      <CheckCircle2 className="text-primary mx-auto size-14" aria-hidden />
      <div className="space-y-1">
        <h2 className="text-primary text-xl font-semibold">{t("done.title")}</h2>
        <p className="text-sm">{t("done.description")}</p>
      </div>
      <Button asChild className="w-full" onClick={reset}>
        <Link href="/login">{t("done.goToLogin")}</Link>
      </Button>
    </div>
  );
}
