"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { Check, Info, X } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

// Informative colors are shared by the default and info variants
const informative =
  "!border-border-default !bg-bg-muted !text-text-plain dark:!border-transparent dark:!bg-[var(--zinc-300)] dark:!text-text-inverse";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Close (x) button on every toast
      closeButton
      // Auto-dismiss duration in ms (override per toast with { duration })
      duration={4000}
      // Max toasts visible at once, the rest are queued
      visibleToasts={4}
      icons={{
        info: <Info className="size-5" aria-hidden="true" />,
        success: <Check className="size-5" aria-hidden="true" />,
        error: <X className="size-5" aria-hidden="true" />,
      }}
      // Sonner reads these variables to place the close button:
      // pinned to the end corner (flips in RTL), no offset transform
      style={
        {
          "--toast-close-button-start": "unset",
          "--toast-close-button-end": "12px",
          "--toast-close-button-transform": "none",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          // Shared layout, typography and shadow (no colors here)
          toast: [
            "!flex !items-center !gap-2.5 !rounded-[10px] !border !py-4 !ps-4 !pe-12",
            "!text-sm !font-semibold !leading-[150%]",
            "!shadow-[0_15px_30px_-3px_#0000001A] dark:!shadow-[0_15px_30px_-3px_#0000004D]",
          ].join(" "),
          // Colors live on the variants only, so they never override each other
          default: informative,
          info: informative,
          success:
            "!border-[var(--emerald-700)] !bg-bg-success-fade !text-text-plain dark:!border-transparent dark:!bg-[var(--emerald-300)] dark:!text-text-inverse [&_[data-icon]]:text-[var(--emerald-700)] dark:[&_[data-icon]]:text-text-inverse",
          error:
            "!border-[#B91C1C] !bg-bg-danger-fade !text-text-plain dark:!border-transparent dark:!bg-[var(--red-300)] dark:!text-text-inverse [&_[data-icon]]:text-[#B91C1C] dark:[&_[data-icon]]:text-text-inverse",
          // Close button: plain x in the top corner, no circle, no border

          closeButton: [
            "!top-3 !m-0 !size-5 !rounded-none !border-0 !bg-transparent",
            "rtl:!left-3 rtl:!right-auto",
            "ltr:!right-3 ltr:!left-auto",
            "!text-text-muted hover:!bg-transparent hover:!text-text-plain",
          ].join(" "),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
