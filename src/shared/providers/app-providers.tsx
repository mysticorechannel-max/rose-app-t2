"use client";

import { ThemeProvider } from "@/shared/providers/theme-provider";
import { QueryProvider } from "./query-client.provider";
import { SonnerProvider } from "./sonner.provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <SonnerProvider />
      </ThemeProvider>
    </QueryProvider>
  );
}
