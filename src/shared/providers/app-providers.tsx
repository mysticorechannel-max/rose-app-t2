"use client";

import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "@/shared/providers/theme-provider";
import { QueryProvider } from "./query-client.provider";
import { SonnerProvider } from "./sonner.provider";
import { ServiceWorkerProvider } from "./service-worker-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ServiceWorkerProvider>
            {children}
            <SonnerProvider />
          </ServiceWorkerProvider>
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
