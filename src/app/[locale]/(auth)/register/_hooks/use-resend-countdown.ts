"use client";

import { useCallback, useEffect, useState } from "react";

export const RESEND_SECONDS = 60;

// Store the *expiry timestamp*, not a counter. Remaining time is derived from it,
// so refreshes, sleeping tabs and throttled timers can never make it drift.
const storageKey = (email: string) => `register:otp-resend-until:${email.trim().toLowerCase()}`;

/** Call right after an OTP was successfully requested for `email`. */
export function startResendLock(email: string) {
  try {
    localStorage.setItem(storageKey(email), String(Date.now() + RESEND_SECONDS * 1000));
  } catch {
    // storage unavailable: lock simply won't survive a refresh
  }
}

function secondsLeft(email: string) {
  try {
    const until = Number(localStorage.getItem(storageKey(email)) ?? 0);
    return Math.max(0, Math.ceil((until - Date.now()) / 1000));
  } catch {
    return 0;
  }
}

export function useResendCountdown(email: string) {
  // null = not read yet (first render / SSR). Treated as locked so the button
  // is never briefly enabled before localStorage has been checked.
  const [remaining, setRemaining] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setRemaining(secondsLeft(email));
    const id = setInterval(() => {
      const left = secondsLeft(email);
      setRemaining(left);
      if (left <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [email, tick]);

  /** Restart the lock and the interval (after a successful resend). */
  const restart = useCallback(() => {
    startResendLock(email);
    setTick((t) => t + 1);
  }, [email]);

  return {
    remaining: remaining ?? 0,
    isLocked: remaining === null || remaining > 0,
    restart,
  };
}
