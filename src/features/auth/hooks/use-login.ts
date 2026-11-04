import { startTransition } from "react";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

import type { LoginFormValues } from "../schemas/login.schema";

export default function useLogin() {
  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const response = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (response?.error) {
        throw new Error("Invalid username or password.");
      }

      return response;
    },

    onSuccess: () => {
      startTransition(() => {
        window.location.href = "/";
      });
    },
  });
}