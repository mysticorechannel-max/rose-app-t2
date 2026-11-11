"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { ProfileValues } from "../_lib/schemas";

export type RegisterStep = "email" | "otp" | "profile" | "password" | "done";

type RegisterState = {
  step: RegisterStep;
  email: string;
  profile: ProfileValues | null;
};

type RegisterContextValue = RegisterState & {
  ready: boolean;
  goTo: (step: RegisterStep) => void;
  setEmail: (email: string) => void;
  setProfile: (profile: ProfileValues) => void;
  reset: () => void;
};

const STORAGE_KEY = "register:state";
const initial: RegisterState = { step: "email", email: "", profile: null };

const RegisterContext = createContext<RegisterContextValue | null>(null);

/**
 * Holds the data that must survive step changes. The password is deliberately NOT
 * stored here (or in storage): it lives only inside the password step's form.
 */
export function RegisterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RegisterState>(initial);
  const [ready, setReady] = useState(false);

  // Restore after a refresh (sessionStorage = this tab only).
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as RegisterState;
        // never resume on the "done" screen
        setState({ ...parsed, step: parsed.step === "done" ? "email" : parsed.step });
      }
    } catch {
      // ignore corrupted storage
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, ready]);

  const goTo = useCallback((step: RegisterStep) => setState((s) => ({ ...s, step })), []);
  const setEmail = useCallback((email: string) => setState((s) => ({ ...s, email })), []);
  const setProfile = useCallback((profile: ProfileValues) => setState((s) => ({ ...s, profile })), []);
  const reset = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(initial);
  }, []);

  const value = useMemo(
    () => ({ ...state, ready, goTo, setEmail, setProfile, reset }),
    [state, ready, goTo, setEmail, setProfile, reset],
  );

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
}

export function useRegister() {
  const ctx = useContext(RegisterContext);
  if (!ctx) throw new Error("useRegister must be used inside <RegisterProvider>");
  return ctx;
}
