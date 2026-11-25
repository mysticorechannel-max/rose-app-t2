"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/shared/lib/utils/service-worker.util";

/**
 * Service Worker Provider
 * Registers service worker on mount
 */
export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker when component mounts
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      registerServiceWorker().catch((error) => {
        console.error("Failed to register service worker:", error);
      });
    }
  }, []);

  return <>{children}</>;
}
