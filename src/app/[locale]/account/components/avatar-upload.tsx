"use client";

import { CloudUpload, UserRound } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";

const ACCEPTED_TYPES = ".jpg,.jpeg,.png,.gif";

export function AvatarUpload() {
  // Translation
  const t = useTranslations("account.profile");

  // State
  const [preview, setPreview] = React.useState<string | null>(null);

  // Ref
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Functions
  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="flex items-center gap-6">
      <div className="relative size-30 shrink-0">
        <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-bg-soft text-text-muted">
          {preview ? (
            <Image
              src={preview}
              alt=""
              width={120}
              height={120}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <UserRound className="size-14" aria-hidden="true" />
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={t("uploadPhoto")}
          className="absolute end-0 bottom-0 flex size-8 items-center justify-center rounded-full border border-border-muted bg-bg-plain text-text-plain shadow-xs outline-hidden hover:bg-bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CloudUpload className="size-4" aria-hidden="true" />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-medium text-text-plain">
          {t("uploadPhoto")}
        </h2>
        <p className="text-sm text-text-soft">{t("uploadHint")}</p>
      </div>
    </div>
  );
}