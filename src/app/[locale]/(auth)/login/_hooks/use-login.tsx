"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useLocale } from "next-intl";

import type { LoginFormValues } from "../_schemas/login.schema";

export default function useLogin() {
  const locale = useLocale();

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const response = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
        callbackUrl: `/${locale}`,
      });

      if (!response?.ok || response.error) {
        throw new Error("Invalid username or password.");
      }

      return response;
    },

    onSuccess: (response) => {
      window.location.assign(response.url || `/${locale}`);
    },
  });
}
