"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { Check, Info, X } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const TOAST_DURATION_MS = 4000;
const MAX_VISIBLE_TOASTS = 4;

const defaultToast = "!border-border-soft !bg-bg-muted !text-text-plain";

const successToast = "!border-border-soft !bg-bg-success-fade !text-text-plain";

const errorToast = "!border-border-soft !bg-bg-danger-fade !text-text-plain";
const Toaster = ({ ...props }: ToasterProps) => {
  // Variables
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
      duration={TOAST_DURATION_MS}
      visibleToasts={MAX_VISIBLE_TOASTS}
      icons={{
        info: <Info className="size-5" aria-hidden="true" />,
        success: <Check className="size-5" aria-hidden="true" />,
        error: <X className="size-5" aria-hidden="true" />,
      }}
      toastOptions={{
        classNames: {
          toast: [
            "!flex !items-center !gap-2.5 !rounded-lg !border !py-4 !ps-4 !pe-12",
            "!text-sm !font-semibold !leading-[150%]",
            "!shadow-[0_4px_10px_0_rgb(0_0_0/0.07)]",
          ].join(" "),

          default: defaultToast,
          info: defaultToast,

          success: [successToast, "[&_[data-icon]]:!text-text-success"].join(" "),

          error: [errorToast, "[&_[data-icon]]:!text-text-danger"].join(" "),

          closeButton: [
            "!top-6 !m-0 !size-5",
            "!rounded-none !border-0 !bg-transparent",
            "ltr:!right-3 ltr:!left-auto rtl:!left-3 rtl:!right-auto",
            "!text-text-muted",
            "[&_svg]:!w-[15px] [&_svg]:!h-[15px]",
            "hover:!bg-transparent hover:!text-text-plain",
          ].join(" "),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
