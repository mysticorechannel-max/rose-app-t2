"use client";

import { useTranslations } from "next-intl";

import { ActionError } from "../errors/action-error";

export function useErrorMessage() {
  const t = useTranslations("account.errors");

  return function getErrorMessage(error: Error): string {
    return t(error instanceof ActionError ? error.code : "unknown");
  };
}
