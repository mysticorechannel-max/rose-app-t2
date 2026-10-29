"use client"
import * as React from "react";
import { Search, X, Eye, EyeOff, Upload, ChevronsUpDown } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { cn } from "@/lib/utils";
import PhoneInput, { getCountryCallingCode } from "react-phone-number-input";
import enLabels from "react-phone-number-input/locale/en.json";
import arLabels from "react-phone-number-input/locale/ar.json";
import "react-phone-number-input/style.css";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

/* ------------------------------------------------------------------ */
/* Shared styles                                                       */
/* ------------------------------------------------------------------ */

// The "box" look used by every field (rounded-xl, soft border, focus ring)
const boxClass =
  "rounded-xl border border-input bg-background text-sm text-foreground shadow-xs transition-colors hover:border-ring/60 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50";

const inputClass =
  "flex h-11 w-full min-w-0 rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground hover:border-ring/60 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const adornmentClass =
  "absolute end-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50";

/* ------------------------------------------------------------------ */
/* Phone country select: [flag] EG(+20) [chevrons]                     */
/* ------------------------------------------------------------------ */

function PhoneCountrySelect({
  value,
  onChange,
  options,
  iconComponent: Icon,
  disabled,
  readOnly,
}: any) {
  const selected = options.find((o: any) => o.value === value);
  const code = value ? `${value}(+${getCountryCallingCode(value)})` : "+";

  return (
    <div
      className={cn(
        "relative flex h-full shrink-0 items-center gap-2 ps-3 pe-2",
        (disabled || readOnly) && "pointer-events-none"
      )}
    >
      {/* Flag + code always side by side (LTR) in both Arabic and English */}
      <div dir="ltr" className="flex items-center gap-2">
        <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full [--PhoneInputCountryFlag-height:20px] [&_.PhoneInputCountryIcon]:!size-5 [&_.PhoneInputCountryIcon]:!shadow-none [&_.PhoneInputCountryIconImg]:size-full [&_.PhoneInputCountryIconImg]:object-cover">
          <Icon country={value} label={selected?.label ?? ""} aspectRatio={1} />
        </span>
        <bdi className="text-sm font-medium text-foreground">{code}</bdi>
      </div>

      <ChevronsUpDown className="size-3.5 text-foreground" aria-hidden />

      {/* Real native select, transparent, layered on top of everything */}
      <select
        value={value ?? ""}
        disabled={disabled || readOnly}
        onChange={(e) => onChange(e.target.value || undefined)}
        aria-label="Country"
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      >
        {options.map((o: any, i: number) =>
          o.divider ? (
            <option key={`d${i}`} disabled value="">
              ──────────
            </option>
          ) : (
            <option key={o.value ?? "intl"} value={o.value ?? ""}>
              {o.value
                ? `${o.label} (+${getCountryCallingCode(o.value)})`
                : o.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Input                                                               */
/* ------------------------------------------------------------------ */

type SelectOption = { value: string; label: string; disabled?: boolean };

type InputProps = Omit<React.ComponentProps<"input">, "type" | "ref"> & {
  type?:
    | "text"
    | "password"
    | "search"
    | "number"
    | "file"
    | "phone"
    | "otp"
    | "select";
  label?: string;
  hint?: string;
  error?: string;
  /** File: show the "Review current image(s)" link */
  previewProvided?: boolean;
  onReview?: () => void;
  /** OTP: number of digit boxes */
  length?: number;
  /** Select: the list of options */
  options?: SelectOption[];
  /** Phone / OTP / Select: receives the full value (e.g. "+201234567890", "123456", "eg") */
  onValueChange?: (value: string) => void;
  /** Phone: default ISO country code (e.g. "EG", "SA") */
  defaultCountry?: string;
  /** Phone: Arabic or English UI (sets direction, country names and placeholder) */
  locale?: "en" | "ar";
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      hint,
      error,
      id,
      className,
      disabled,
      previewProvided,
      onReview,
      length = 6,
      options = [],
      onValueChange,
      onChange,
      defaultCountry = "EG",
      locale = "en",
      ...props
    },
    ref
  ) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const isRtl = locale === "ar";
    const dir = isRtl ? "rtl" : "ltr";
    const messageId = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    // Props shared by every control (label, error and disabled wiring)
    const shared = {
      id: inputId,
      disabled,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": messageId,
    };

    const localRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => localRef.current as HTMLInputElement);

    const [showPassword, setShowPassword] = React.useState(false);
    const [typed, setTyped] = React.useState(String(props.defaultValue ?? ""));
    const [fileLabel, setFileLabel] = React.useState("");
    const [phoneValue, setPhoneValue] = React.useState<string | undefined>(
      props.defaultValue as string | undefined
    );

    const filled =
      (props.value !== undefined ? String(props.value) : typed).length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTyped(e.target.value);
      onChange?.(e);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      setFileLabel(
        !files || files.length === 0
          ? ""
          : files.length === 1
            ? files[0].name
            : `${files.length} files selected`
      );
      onChange?.(e);
    };

    // Clears the field and notifies React (and form libraries) through a real input event
    const clearSearch = () => {
      const el = localRef.current;
      if (!el) return;
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set?.call(el, "");
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.focus();
    };

    let control: React.ReactNode;

    if (type === "select") {
      control = (
        <Select
          name={props.name}
          required={props.required}
          disabled={disabled}
          value={props.value !== undefined ? String(props.value) : undefined}
          defaultValue={
            props.defaultValue !== undefined
              ? String(props.defaultValue)
              : undefined
          }
          onValueChange={(v: string) => onValueChange?.(v)}
        >
          <SelectTrigger
            id={shared.id}
            aria-invalid={shared["aria-invalid"]}
            aria-describedby={shared["aria-describedby"]}
            dir={dir}
            className={cn(
              "h-11 w-full rounded-xl border-input bg-background px-4 text-sm shadow-xs hover:border-ring/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
              "data-[placeholder]:text-muted-foreground",
              className
            )}
          >
            <SelectValue placeholder={props.placeholder ?? (isRtl ? "اختر خياراً" : "Select an option")} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (type === "otp") {
      control = (
        <InputOTP
          {...shared}
          name={props.name}
          maxLength={length}
          value={props.value !== undefined ? String(props.value) : typed}
          onChange={(value) => {
            setTyped(value);
            onValueChange?.(value);
          }}
          pattern={REGEXP_ONLY_DIGITS}
          inputMode="numeric"
          autoComplete="one-time-code"
          containerClassName="w-full gap-2"
          dir={dir}
        >
          {Array.from({ length }, (_, i) => (
            <InputOTPGroup key={i}>
              <InputOTPSlot
                index={i}
                className={cn(
                  "h-12 w-12 rounded-xl border border-input bg-background text-base text-foreground shadow-xs",
                  error && "border-destructive",
                  disabled && "opacity-50"
                )}
              />
            </InputOTPGroup>
          ))}
        </InputOTP>
      );
    } else if (type === "phone") {
      control = (
        <PhoneInput
          {...shared}
          defaultCountry={defaultCountry as any}
          labels={isRtl ? arLabels : enLabels}
          countrySelectComponent={PhoneCountrySelect}
          countryCallingCodeEditable={false}
          value={props.value !== undefined ? String(props.value) : phoneValue}
          onChange={(value) => {
            setPhoneValue(value);
            onValueChange?.(value ?? "");
          }}
          className={cn(
            boxClass,
            "flex h-11 items-center overflow-hidden",
            error && "",
            className
          )}
          inputProps={{
            placeholder:
              props.placeholder ?? (isRtl ? "رقم الهاتف" : "Phone number"),
            dir: phoneValue ? "ltr" : dir,
            style: { textAlign: isRtl ? "right" : "left" },
            className:
              "flex-1 h-full min-w-0 border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 bg-transparent px-2 text-sm shadow-none placeholder:text-muted-foreground",
          }}
        />
      );
    } else if (type === "file") {
      control = (
        <div className="relative">
          <input
            {...props}
            {...shared}
            ref={localRef}
            type="file"
            onChange={handleFileChange}
            className="peer sr-only"
          />
          <label
            htmlFor={inputId}
            data-invalid={error ? true : undefined}
            dir={dir}
            className={cn(
              boxClass,
              "flex min-h-14 w-full cursor-pointer items-center justify-end gap-3 px-4 py-3",
              "peer-focus-visible:border-ring peer-focus-visible:ring-2 peer-focus-visible:ring-ring/30",
              "peer-disabled:pointer-events-none peer-disabled:opacity-50",
              className
            )}
          >
            {fileLabel && (
              <span className="min-w-0 flex-1 truncate text-start text-muted-foreground">
                {fileLabel}
              </span>
            )}
            <span className="flex shrink-0 items-center gap-2 font-medium text-red-600 dark:text-red-500">
              <Upload className="size-4" aria-hidden />
              {fileLabel ? (isRtl ? "تغيير الملف" : "Change file") : (isRtl ? "رفع ملف" : "Upload file")}
            </span>
          </label>
        </div>
      );
    } else {
      // text, email, url, tel, password, search, number
      const isPassword = type === "password";
      const isSearch = type === "search";

      control = (
        <div className="relative">
          {isSearch && (
            <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          )}

          <input
            {...props}
            {...shared}
            ref={localRef}
            type={isPassword && showPassword ? "text" : type}
            onChange={handleChange}
            dir={dir}
            className={cn(
              inputClass,
              isSearch &&
                "ps-10 pe-12 [&::-webkit-search-cancel-button]:appearance-none",
              isPassword && "pe-12",
              className
            )}
          />

          {isPassword && (
            <button
              type="button"
              disabled={disabled}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
              className={adornmentClass}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          )}

          {isSearch && filled && !disabled && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={clearSearch}
              className={adornmentClass}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      );
    }

    return (
      <div dir={dir} className="flex w-full flex-col gap-2">
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(error && "text-destructive", disabled && "opacity-50")}
          >
            {label}
          </Label>
        )}

        {control}

        {type === "file" && previewProvided && (
          <button
            type="button"
            disabled={disabled}
            onClick={onReview}
            className="w-fit text-sm font-medium text-primary underline underline-offset-4 disabled:pointer-events-none disabled:opacity-50"
          >
            Review current image(s)
          </button>
        )}

        {error ? (
          <p id={messageId} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : hint ? (
          <p id={messageId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps, SelectOption };