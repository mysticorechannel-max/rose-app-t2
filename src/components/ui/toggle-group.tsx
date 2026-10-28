"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore, type ComponentProps } from "react";

import { cn } from "@/lib/utils";

const MODE_OPTIONS = [
  { value: "light", icon: SunIcon, labelKey: "light" },
  { value: "system", icon: MonitorIcon, labelKey: "system" },
  { value: "dark", icon: MoonIcon, labelKey: "dark" },
] as const;

function subscribeNoop() {
  return () => {};
}

// True only after hydration, so server and first client render match
function useIsMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

function ToggleGroup({ className, ...props }: ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border-muted bg-bg-plain p-1",
        className
      )}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        // Layout and shape
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full",
        "text-text-default",

        // Interaction
        "cursor-pointer outline-none transition-colors",
        "hover:text-text-plain",
        "focus-visible:ring-2 focus-visible:ring-ring",

        // Selected (zinc-200 in light, zinc-900 in dark, as in Figma)
        "data-[state=on]:bg-bg-soft data-[state=on]:text-text-plain",
        "dark:data-[state=on]:bg-bg-muted",

        // Icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function ModeToggle({ className }: { className?: string }) {
  // Translation
  const t = useTranslations("common.theme");
  const locale = useLocale();

  // Context
  const { theme, setTheme } = useTheme();

  // Variables
  const isMounted = useIsMounted();
  const selectedMode = isMounted ? theme : "";
  const direction = locale === "ar" ? "rtl" : "ltr";
  // Functions
  // Radix single mode sends "" when the active item is clicked again; ignore it
  const handleModeChange = (mode: string) => {
    if (mode) setTheme(mode);
  };

  return (
    <ToggleGroup
      type="single"
      dir={direction}
      value={selectedMode}
      onValueChange={handleModeChange}
      aria-label={t("label")}
      className={className}
    >
      {MODE_OPTIONS.map(({ value, icon: Icon, labelKey }) => (
        <ToggleGroupItem key={value} value={value} aria-label={t(labelKey)}>
          <Icon aria-hidden="true" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export { ModeToggle, ToggleGroup, ToggleGroupItem };