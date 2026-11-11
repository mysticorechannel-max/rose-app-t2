"use client";

import { useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 150;

const TAB_CLASS_NAME =
  "flex h-11 items-center justify-center text-sm font-medium transition-colors";

type LoginPopoverProps = {
  // The existing login form from the NextAuth ticket
  loginForm?: ReactNode;
};

function LoginFormPlaceholder() {
  // Translation
  const t = useTranslations("auth.LoginPopover");

  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border-soft p-4 text-sm text-text-soft">
      {t("formPlaceholder")}
    </div>
  );
}

function LoginPopover({ loginForm }: LoginPopoverProps) {
  // Translation
  const t = useTranslations("auth.LoginPopover");

  // State
  const [isOpen, setIsOpen] = useState(false);

  // Ref
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Functions
  const openPopover = () => {
    clearTimeout(closeTimerRef.current);
    setIsOpen(true);
  };

  // The delay lets the pointer travel from the button to the popover
  const closePopover = () => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <Button
          asChild
          onMouseEnter={openPopover}
          onMouseLeave={closePopover}
        >
          <Link href="/login">{t("login")}</Link>
        </Button>
      </PopoverAnchor>

      <PopoverContent
        align="end"
        className="w-96 overflow-hidden p-0"
        onMouseEnter={openPopover}
        onMouseLeave={closePopover}
        // Keep focus where it was; this popover is opened by hover
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {/* Tabs */}
        <div className="grid grid-cols-2">
          <span
            aria-current="true"
            className={cn(TAB_CLASS_NAME, "bg-bg-primary text-primary-foreground")}
          >
            {t("login")}
          </span>
          <Link
            href="/register"
            onClick={() => setIsOpen(false)}
            className={cn(
              TAB_CLASS_NAME,
              "bg-bg-subtle text-text-plain hover:bg-bg-muted",
              "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            )}
          >
            {t("register")}
          </Link>
        </div>

        {/* Login tab content */}
        <div className="p-4">{loginForm ?? <LoginFormPlaceholder />}</div>
      </PopoverContent>
    </Popover>
  );
}

export { LoginPopover };