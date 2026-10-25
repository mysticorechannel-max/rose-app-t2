"use client";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
const modes = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;
export function ThemeSwitcher() {
  const t = useTranslations("common.theme");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div aria-label={t("label")} className="flex rounded-lg border border-border bg-card p-1">
      {modes.map(({ value, icon: Icon }) => (
        <Button
          key={value}
          aria-label={t(value)}
          aria-pressed={mounted && theme === value}
          className="h-9 px-3"
          onClick={() => setTheme(value)}
          type="button"
          variant={mounted && theme === value ? "default" : "ghost"}
        >
          <Icon aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">{t(value)}</span>
        </Button>
      ))}
    </div>
  );
}
