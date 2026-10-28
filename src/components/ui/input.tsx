"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, X, Eye, EyeOff, ChevronUp, ChevronDown, Upload, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

export type InputType = "text" | "search" | "number" | "file" | "phone" | "otp" | "password";

export interface CountryOption {
  code: string;
  dial: string;
  flag: string;
  nameKey: "EG" | "SA" | "AE" | "US" | "GB";
}

export const COUNTRIES: CountryOption[] = [
  { code: "EG", dial: "+20", flag: "🇪🇬", nameKey: "EG" },
  { code: "SA", dial: "+966", flag: "🇸🇦", nameKey: "SA" },
  { code: "AE", dial: "+971", flag: "🇦🇪", nameKey: "AE" },
  { code: "US", dial: "+1", flag: "🇺🇸", nameKey: "US" },
  { code: "GB", dial: "+44", flag: "🇬🇧", nameKey: "GB" },
];

export type InputProps = Omit<
  React.ComponentProps<"input">,
  "type" | "onChange" | "value" | "defaultValue"
> & {
  type?: InputType;
  label?: string;
  error?: string;
  hint?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  // OTP specific
  otpLength?: number;
  onOtpChange?: (value: string) => void;
  // Phone specific
  defaultCountry?: string;
  onPhoneChange?: (value: string) => void;
  onCountryChange?: (country: CountryOption) => void;
  // File specific
  onFilesChange?: (files: FileList | null) => void;
  selectedFileName?: string;
  currentFiles?: string[];
  previewProvided?: boolean;
  onReviewFiles?: () => void;
  accept?: string;
};

// Base class for inputs matching Figma design system tokens
const baseInputClass =
  "flex h-10 w-full min-w-0 rounded-md border bg-bg-plain px-3 py-2 text-sm text-text-plain transition-colors border-border-soft placeholder:text-text-muted hover:border-border-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-border-default disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-bg-subtle disabled:text-text-muted aria-invalid:border-border-danger aria-invalid:focus-visible:ring-border-danger";

/* ==========================================================================
   OTP Input Helper (6 individual digit boxes)
   ========================================================================== */
interface OtpInputProps {
  id: string;
  length: number;
  disabled?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  describedBy?: string;
  labelId?: string;
  dir?: "ltr" | "rtl";
}

function OtpInputComponent({
  length,
  disabled,
  error,
  value,
  onChange,
  describedBy,
  labelId,
  dir = "ltr",
}: OtpInputProps) {
  // Translation
  const t = useTranslations("input.otp");
  const isRtl = dir === "rtl";

  // Ref
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  // Variables
  const digits = Array.from({ length }, (_, index) => {
    const sanitized = value.replace(/\D/g, "");
    return sanitized[index] ?? "";
  });

  // Handlers
  const handleDigitChange = (index: number, raw: string) => {
    const incomingDigits = raw.replace(/\D/g, "");
    const nextDigits = [...digits];

    // If user typed/pasted multiple digits into one field
    if (incomingDigits.length > 1) {
      incomingDigits
        .slice(0, length - index)
        .split("")
        .forEach((char, offset) => {
          if (index + offset < length) {
            nextDigits[index + offset] = char;
          }
        });
      const combined = nextDigits.join("");
      onChange(combined);
      const targetFocus = Math.min(index + incomingDigits.length, length - 1);
      refs.current[targetFocus]?.focus();
      return;
    }

    if (incomingDigits.length === 0) {
      nextDigits[index] = "";
      onChange(nextDigits.join(""));
      return;
    }

    nextDigits[index] = incomingDigits.slice(-1);
    onChange(nextDigits.join(""));

    // Advance to next input
    if (index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    const forwardKey = isRtl ? "ArrowLeft" : "ArrowRight";
    const backwardKey = isRtl ? "ArrowRight" : "ArrowLeft";

    if (event.key === "Backspace") {
      event.preventDefault();
      const nextDigits = [...digits];

      if (nextDigits[index]) {
        nextDigits[index] = "";
        onChange(nextDigits.join(""));
      } else if (index > 0) {
        nextDigits[index - 1] = "";
        onChange(nextDigits.join(""));
        refs.current[index - 1]?.focus();
      }
    } else if (event.key === forwardKey && index < length - 1) {
      event.preventDefault();
      refs.current[index + 1]?.focus();
    } else if (event.key === backwardKey && index > 0) {
      event.preventDefault();
      refs.current[index - 1]?.focus();
    } else if (event.key === "Delete") {
      event.preventDefault();
      const nextDigits = [...digits];
      nextDigits[index] = "";
      onChange(nextDigits.join(""));
    }
  };

  const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

    if (!pastedText) return;

    const nextDigits = [...digits];
    const startIndex = pastedText.length === length ? 0 : index;
    pastedText.split("").forEach((char, offset) => {
      if (startIndex + offset < length) {
        nextDigits[startIndex + offset] = char;
      }
    });

    onChange(nextDigits.join(""));
    const focusTarget = Math.min(startIndex + pastedText.length, length - 1);
    refs.current[focusTarget]?.focus();
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      className={cn(
        "flex flex-wrap items-center gap-2 w-full",
        isRtl ? "justify-start" : "justify-start"
      )}
      dir={dir}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={t("digitLabel", { current: index + 1, total: length })}
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          value={digit}
          onChange={(event) => handleDigitChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          className={cn(
            "size-10 sm:size-11 rounded-md border text-center text-base font-semibold text-text-plain transition-colors",
            "border-border-soft bg-bg-plain hover:border-border-default",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-border-default",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-bg-subtle disabled:text-text-muted",
            error &&
              "border-border-danger focus-visible:ring-border-danger hover:border-border-danger"
          )}
        />
      ))}
    </div>
  );
}

/* ==========================================================================
   Main Unified Input Component
   ========================================================================== */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      hint,
      id,
      disabled,
      value,
      defaultValue,
      onChange,
      otpLength = 6,
      onOtpChange,
      defaultCountry = "EG",
      onPhoneChange,
      onCountryChange,
      onFilesChange,
      selectedFileName,
      currentFiles = [],
      previewProvided = false,
      onReviewFiles,
      accept,
      placeholder,
      dir,
      ...props
    },
    ref
  ) => {
    // 1. Translation
    const t = useTranslations("input");

    // 2. Navigation / Locale
    const locale = useLocale();

    // 3. State
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const [internalSearch, setInternalSearch] = React.useState(String(defaultValue ?? ""));
    const [internalOtp, setInternalOtp] = React.useState(String(defaultValue ?? ""));
    const [internalPhone, setInternalPhone] = React.useState(String(defaultValue ?? ""));
    const [internalNumber, setInternalNumber] = React.useState(String(defaultValue ?? ""));
    const [selectedCountryCode, setSelectedCountryCode] = React.useState(defaultCountry);
    const [internalFileName, setInternalFileName] = React.useState<string>("");

    // 4. Variables derived
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const labelId = `${inputId}-label`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    const fileInputId = `${inputId}-file-native`;

    const isControlled = value !== undefined;
    const controlledStr = String(value ?? "");

    const searchVal = isControlled ? controlledStr : internalSearch;
    const otpVal = isControlled ? controlledStr : internalOtp;
    const phoneVal = isControlled ? controlledStr : internalPhone;
    const numberVal = isControlled ? controlledStr : internalNumber;

    const activeCountry = COUNTRIES.find((c) => c.code === selectedCountryCode) ?? COUNTRIES[0];

    const effectiveFileName =
      selectedFileName ?? internalFileName ?? (currentFiles.length > 0 ? currentFiles[0] : "");

    const hasPreview = previewProvided || currentFiles.length > 0;
    const effectiveDir: "ltr" | "rtl" =
      dir === "rtl" || dir === "ltr" ? dir : locale === "ar" ? "rtl" : "ltr";

    const describedBy =
      [error ? errorId : undefined, hint ? hintId : undefined, props["aria-describedby"]]
        .filter(Boolean)
        .join(" ") || undefined;

    // 5. Functions / Handlers
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalSearch(event.target.value);
      }
      onChange?.(event);
    };

    const handleClearSearch = () => {
      if (!isControlled) {
        setInternalSearch("");
      }
      const syntheticEvent = {
        target: { value: "" },
        currentTarget: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    const handleOtpUpdate = (next: string) => {
      const sanitized = next.replace(/\D/g, "").slice(0, otpLength);
      if (!isControlled) {
        setInternalOtp(sanitized);
      }
      onOtpChange?.(sanitized);
      const syntheticEvent = {
        target: { value: sanitized },
        currentTarget: { value: sanitized },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const digits = event.target.value.replace(/[^\d\s-]/g, "");
      if (!isControlled) {
        setInternalPhone(digits);
      }
      onPhoneChange?.(`${activeCountry.dial} ${digits}`.trim());
      onChange?.(event);
    };

    const handleCountrySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const nextCode = event.target.value;
      setSelectedCountryCode(nextCode);
      const matched = COUNTRIES.find((c) => c.code === nextCode) ?? COUNTRIES[0];
      onCountryChange?.(matched);
      onPhoneChange?.(`${matched.dial} ${phoneVal}`.trim());
    };

    const handleFileNativeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        setInternalFileName(files[0].name);
      } else {
        setInternalFileName("");
      }
      onFilesChange?.(files);
      onChange?.(event);
    };

    const handleNumberStep = (direction: "up" | "down") => {
      if (disabled) return;
      const current = parseFloat(numberVal);
      const step =
        typeof props.step === "number" ? props.step : parseFloat(String(props.step ?? 1)) || 1;
      const min = props.min !== undefined ? parseFloat(String(props.min)) : -Infinity;
      const max = props.max !== undefined ? parseFloat(String(props.max)) : Infinity;

      let next: number;
      if (isNaN(current) || numberVal === "") {
        next = direction === "up" ? (isFinite(min) ? min : 1) : isFinite(min) ? min : -1;
      } else {
        next = direction === "up" ? current + step : current - step;
      }

      if (next < min) next = min;
      if (next > max) next = max;

      const nextStr = String(next);
      if (!isControlled) {
        setInternalNumber(nextStr);
      }
      const syntheticEvent = {
        target: { value: nextStr },
        currentTarget: { value: nextStr },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    /* ==========================================================================
       Render by Input Type
       ========================================================================== */
    const renderContent = () => {
      // 1. OTP Type
      if (type === "otp") {
        return (
          <OtpInputComponent
            id={inputId}
            length={Math.max(1, Math.min(otpLength, 12))}
            disabled={disabled}
            error={error}
            value={otpVal}
            onChange={handleOtpUpdate}
            describedBy={describedBy}
            labelId={label ? labelId : undefined}
            dir={effectiveDir}
          />
        );
      }

      // 2. Phone Type (Unified single border pill container matching Figma)
      if (type === "phone") {
        return (
          <div
            className={cn(
              "flex h-10 w-full min-w-0 items-center rounded-md border bg-bg-plain transition-colors",
              "border-border-soft focus-within:border-border-default focus-within:ring-2 focus-within:ring-ring",
              "hover:border-border-default",
              disabled && "pointer-events-none cursor-not-allowed bg-bg-subtle text-text-muted",
              error &&
                "border-border-danger focus-within:border-border-danger focus-within:ring-border-danger hover:border-border-danger",
              className
            )}
            dir={dir}
          >
            {/* Country Selector with Flag and Dial code */}
            <div className="relative flex items-center ps-3 pe-2 border-e border-border-soft">
              <label htmlFor={`${inputId}-country`} className="sr-only">
                {t("phone.countryLabel")}
              </label>
              <div className="flex items-center gap-1.5 text-sm font-medium text-text-plain pointer-events-none select-none">
                <span className="text-base leading-none">{activeCountry.flag}</span>
                <span className="text-xs sm:text-sm font-medium">
                  {activeCountry.code}({activeCountry.dial})
                </span>
                <ChevronDown className="size-3 text-text-muted" aria-hidden="true" />
              </div>
              <select
                id={`${inputId}-country`}
                disabled={disabled}
                value={selectedCountryCode}
                onChange={handleCountrySelect}
                aria-label={t("phone.selectCountry")}
                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed w-full h-full"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {t(`phone.countries.${c.nameKey}`)} ({c.dial})
                  </option>
                ))}
              </select>
            </div>

            {/* Phone Number Input */}
            <input
              {...props}
              id={inputId}
              ref={ref}
              type="tel"
              inputMode="tel"
              disabled={disabled}
              value={phoneVal}
              placeholder={placeholder ?? t("phone.placeholder")}
              onChange={handlePhoneChange}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-text-plain outline-none placeholder:text-text-muted disabled:cursor-not-allowed"
            />
          </div>
        );
      }

      // 3. File Type (Standard input height h-10 container matching Figma)
      if (type === "file") {
        return (
          <div
            className={cn(
              "flex h-10 w-full min-w-0 items-center justify-between rounded-md border bg-bg-plain px-3 py-2 text-sm transition-colors",
              "border-border-soft hover:border-border-default focus-within:border-border-default focus-within:ring-2 focus-within:ring-ring",
              disabled && "pointer-events-none cursor-not-allowed bg-bg-subtle text-text-muted",
              error &&
                "border-border-danger focus-within:border-border-danger focus-within:ring-border-danger hover:border-border-danger",
              className
            )}
          >
            {/* Left side: Preview Provided link OR selected file name OR placeholder */}
            <div className="flex min-w-0 items-center gap-2 truncate">
              {hasPreview ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReviewFiles?.();
                  }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-text-info hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:text-text-muted"
                >
                  <FileImage className="size-4 shrink-0 text-text-info" aria-hidden="true" />
                  <span className="truncate">{t("file.reviewImages")}</span>
                </button>
              ) : effectiveFileName ? (
                <span className="truncate text-xs sm:text-sm font-normal text-text-plain">
                  {effectiveFileName}
                </span>
              ) : (
                <span className="text-xs sm:text-sm text-text-muted truncate select-none">
                  {placeholder ?? t("file.noFile")}
                </span>
              )}
            </div>

            {/* Right side: Upload file action button */}
            <label
              htmlFor={fileInputId}
              className={cn(
                "flex items-center gap-1.5 shrink-0 text-xs sm:text-sm font-medium text-text-primary hover:text-text-primary-saturated cursor-pointer select-none",
                disabled && "pointer-events-none cursor-not-allowed text-text-muted"
              )}
            >
              <Upload className="size-4 shrink-0 text-text-primary" aria-hidden="true" />
              <span>{t("file.upload")}</span>
              <input
                {...props}
                id={fileInputId}
                ref={ref}
                type="file"
                accept={accept}
                disabled={disabled}
                onChange={handleFileNativeChange}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className="sr-only"
              />
            </label>
          </div>
        );
      }

      // 4. Text, Search, Number, Password
      const nativeType =
        type === "password"
          ? isPasswordVisible
            ? "text"
            : "password"
          : type === "number"
            ? "number"
            : type === "search"
              ? "search"
              : "text";

      const effectiveVal =
        type === "search"
          ? searchVal
          : type === "number"
            ? numberVal
            : isControlled
              ? value
              : defaultValue;

      const effectivePlaceholder =
        placeholder ?? (type === "search" ? t("search.placeholder") : undefined);

      return (
        <div className="relative flex w-full items-center">
          {/* Search Icon */}
          {type === "search" && (
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute start-3 size-4 text-text-muted"
            />
          )}

          <input
            {...props}
            id={inputId}
            ref={ref}
            type={nativeType}
            disabled={disabled}
            value={effectiveVal}
            placeholder={effectivePlaceholder}
            onChange={(event) => {
              if (type === "search") {
                handleSearchChange(event);
              } else if (type === "number") {
                if (!isControlled) setInternalNumber(event.target.value);
                onChange?.(event);
              } else {
                onChange?.(event);
              }
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              baseInputClass,
              type === "search" && "ps-9 pe-9",
              (type === "password" || type === "number") && "pe-10",
              type === "number" &&
                "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              error &&
                "border-border-danger focus-visible:ring-border-danger hover:border-border-danger",
              className
            )}
          />

          {/* Search Clear (X) Button */}
          {type === "search" && Boolean(searchVal) && !disabled && (
            <button
              type="button"
              aria-label={t("search.clear")}
              onClick={handleClearSearch}
              className="absolute end-3 rounded-sm p-0.5 text-text-muted hover:text-text-plain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          )}

          {/* Password Eye Toggle */}
          {type === "password" && (
            <button
              type="button"
              disabled={disabled}
              aria-label={isPasswordVisible ? t("password.hide") : t("password.show")}
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute end-3 rounded-sm p-1 text-text-muted hover:text-text-plain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
            >
              {isPasswordVisible ? (
                <Eye aria-hidden="true" className="size-4" />
              ) : (
                <EyeOff aria-hidden="true" className="size-4" />
              )}
            </button>
          )}

          {/* Number Stepper Arrows */}
          {type === "number" && (
            <div className="absolute end-2 flex flex-col items-center justify-center">
              <button
                type="button"
                aria-label={t("number.increase")}
                disabled={disabled}
                onClick={() => handleNumberStep("up")}
                className="text-text-muted hover:text-text-plain focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none p-0.5"
              >
                <ChevronUp aria-hidden="true" className="size-3" />
              </button>
              <button
                type="button"
                aria-label={t("number.decrease")}
                disabled={disabled}
                onClick={() => handleNumberStep("down")}
                className="text-text-muted hover:text-text-plain focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none p-0.5"
              >
                <ChevronDown aria-hidden="true" className="size-3" />
              </button>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="flex w-full flex-col gap-1.5" dir={effectiveDir}>
        {/* Label with Error support */}
        {label && (
          <label
            id={labelId}
            htmlFor={
              type === "otp"
                ? undefined
                : type === "file"
                  ? fileInputId
                  : type === "phone"
                    ? inputId
                    : inputId
            }
            className={cn(
              "text-sm font-medium text-text-plain transition-colors",
              error && "text-text-danger",
              disabled && "text-text-muted"
            )}
          >
            {label}
          </label>
        )}

        {/* Input Box or Control */}
        {renderContent()}

        {/* Hint Text */}
        {hint && !error && (
          <p id={hintId} className="text-xs text-text-muted">
            {hint}
          </p>
        )}

        {/* Error Text with Accessible role="alert" */}
        {error && (
          <p id={errorId} role="alert" className="text-xs sm:text-sm text-text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
