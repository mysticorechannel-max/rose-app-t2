"use client";

import * as React from "react";
import { Search, X, Eye, EyeOff, Upload, ChevronsUpDown } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useLocale } from "next-intl";
import PhoneInput, { getCountryCallingCode } from "react-phone-number-input";
import type { Country, Value } from "react-phone-number-input";
import enLabels from "react-phone-number-input/locale/en.json";
import arLabels from "react-phone-number-input/locale/ar.json";
import "react-phone-number-input/style.css";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

/* ------------------------------------------------------------------ */
/* Shared styles                                                       */
/* ------------------------------------------------------------------ */

const boxClass =
  "rounded-xl border border-border-soft bg-bg-plain text-sm text-text-plain shadow-xs transition-colors hover:border-border-default focus-within:border-border-primary focus-within:ring-2 focus-within:ring-border-primary/30 data-[invalid=true]:border-border-danger data-[invalid=true]:ring-border-danger/20";

const inputClass =
  "flex h-11 w-full min-w-0 rounded-xl border border-border-soft bg-bg-plain px-4 py-2 text-sm text-text-plain shadow-xs transition-colors placeholder:text-text-muted hover:border-border-default focus-visible:border-border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary/30 aria-invalid:border-border-danger aria-invalid:ring-2 aria-invalid:ring-border-danger/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const adornmentClass =
  "absolute end-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-text-muted transition-colors hover:text-text-plain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary/50 disabled:pointer-events-none disabled:opacity-50";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type NativeInputProps = Omit<React.ComponentProps<"input">, "type" | "ref">;

type InputProps = NativeInputProps & {
  type?: "text" | "password" | "search" | "number" | "file" | "phone" | "otp";
  label?: string;
  hint?: string;
  error?: string;
  /** File: show the "Review current image(s)" link */
  previewProvided?: boolean;
  onReview?: () => void;
  /** OTP: number of digit boxes */
  length?: number;
  /** Phone / OTP: receives the full value (e.g. "+201234567890", "123456") */
  onValueChange?: (value: string) => void;
  /** Phone: default ISO country code (e.g. "EG", "SA") */
  defaultCountry?: string;
};

/** Props wired by the wrapper into every control (id, disabled, a11y) */
type SharedProps = {
  id: string;
  disabled?: boolean;
  "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling";
  "aria-describedby"?: string;
};

/* ------------------------------------------------------------------ */
/* Built-in texts (labels the component renders by itself)             */
/* ------------------------------------------------------------------ */

const TEXT = {
  en: {
    upload: "Upload file",
    change: "Change file",
    filesSelected: (n: number) => `${n} files selected`,
    review: "Review current image(s)",
    showPassword: "Show password",
    hidePassword: "Hide password",
    clearSearch: "Clear search",
    country: "Country",
  },
  ar: {
    upload: "رفع ملف",
    change: "تغيير الملف",
    filesSelected: (n: number) => `تم اختيار ${n} ملفات`,
    review: "مراجعة الصور الحالية",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    clearSearch: "مسح البحث",
    country: "الدولة",
  },
} as const;

function useInputText() {
  return useLocale() === "ar" ? TEXT.ar : TEXT.en;
}

/* ------------------------------------------------------------------ */
/* Phone country select: [flag] EG(+20) [chevrons]                     */
/* ------------------------------------------------------------------ */

type CountryOption = { value?: Country; label: string; divider?: boolean };

type PhoneCountrySelectProps = {
  value?: Country;
  onChange: (value?: Country) => void;
  options: CountryOption[];
  iconComponent: React.ComponentType<{
    country: Country;
    label: string;
    aspectRatio?: number;
  }>;
  disabled?: boolean;
  readOnly?: boolean;
};

function PhoneCountrySelect({
  value,
  onChange,
  options,
  iconComponent: Icon,
  disabled,
  readOnly,
}: PhoneCountrySelectProps) {
  const t = useInputText();
  const selected = options.find((o) => o.value === value);
  const code = value ? `${value}(+${getCountryCallingCode(value)})` : "+";
  const inactive = disabled || readOnly;

  return (
    <div
      className={cn(
        "relative flex h-full shrink-0 items-center gap-2 ps-3 pe-2",
        inactive && "pointer-events-none"
      )}
    >
      <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full [--PhoneInputCountryFlag-height:20px] [&_.PhoneInputCountryIcon]:!size-5 [&_.PhoneInputCountryIcon]:!shadow-none [&_.PhoneInputCountryIconImg]:size-full [&_.PhoneInputCountryIconImg]:object-cover">
        {value && (
          <Icon country={value} label={selected?.label ?? ""} aspectRatio={1} />
        )}
      </span>
      <bdi className="text-sm font-medium text-text-plain">{code}</bdi>

      <ChevronsUpDown className="size-3.5 text-text-plain" aria-hidden />

      {/* Native select layered on top: keeps keyboard + mobile behaviour */}
      <select
        value={value ?? ""}
        disabled={inactive}
        onChange={(e) => onChange((e.target.value as Country) || undefined)}
        aria-label={t.country}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      >
        {options.map((o, i) =>
          o.divider ? (
            <option key={`divider-${i}`} disabled value="">
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
/* Controls                                                            */
/* ------------------------------------------------------------------ */

const TextControl = React.forwardRef<
  HTMLInputElement,
  NativeInputProps &
    SharedProps & { type: "text" | "password" | "search" | "number" }
>(({ type, className, onChange, ...props }, ref) => {
  const t = useInputText();
  const localRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => localRef.current as HTMLInputElement);

  const [showPassword, setShowPassword] = React.useState(false);
  const [typed, setTyped] = React.useState(String(props.defaultValue ?? ""));

  const isPassword = type === "password";
  const isSearch = type === "search";
  const filled =
    (props.value !== undefined ? String(props.value) : typed).length > 0;

  // Clears the field through a real input event so React and form libs see it
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

  return (
    <div className="relative">
      {isSearch && (
        <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
      )}

      <input
        {...props}
        ref={localRef}
        type={isPassword && showPassword ? "text" : type}
        onChange={(e) => {
          setTyped(e.target.value);
          onChange?.(e);
        }}
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
          disabled={props.disabled}
          aria-label={showPassword ? t.hidePassword : t.showPassword}
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

      {isSearch && filled && !props.disabled && (
        <button
          type="button"
          aria-label={t.clearSearch}
          onClick={clearSearch}
          className={adornmentClass}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
});
TextControl.displayName = "TextControl";

const FileControl = React.forwardRef<
  HTMLInputElement,
  NativeInputProps & SharedProps
>(({ className, onChange, ...props }, ref) => {
  const t = useInputText();
  const [fileLabel, setFileLabel] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFileLabel(
      !files || files.length === 0
        ? ""
        : files.length === 1
          ? files[0].name
          : t.filesSelected(files.length)
    );
    onChange?.(e);
  };

  return (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        type="file"
        onChange={handleChange}
        className="peer sr-only"
      />
      <label
        htmlFor={props.id}
        data-invalid={props["aria-invalid"]}
        className={cn(
          boxClass,
          "flex min-h-14 w-full cursor-pointer items-center justify-end gap-3 px-4 py-3",
          "peer-focus-visible:border-border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-border-primary/30",
          "peer-disabled:pointer-events-none peer-disabled:opacity-50",
          className
        )}
      >
        {fileLabel && (
          <span className="min-w-0 flex-1 truncate text-start text-text-muted">
            {fileLabel}
          </span>
        )}
        <span className="flex shrink-0 items-center gap-2 font-medium text-text-plain">
          <Upload className="size-4" aria-hidden />
          {fileLabel ? t.change : t.upload}
        </span>
      </label>
    </div>
  );
});
FileControl.displayName = "FileControl";

// react-phone-number-input forwards `ref` to the underlying <input>, but its
// typings declare a class-component ref, so the input ref is cast here.
type PhoneInputRef = React.ComponentProps<typeof PhoneInput>["ref"];

type PhoneControlProps = NativeInputProps &
  SharedProps & {
    defaultCountry: string;
    onValueChange?: (value: string) => void;
  };

const PhoneControl = React.forwardRef<
  HTMLInputElement,
  PhoneControlProps
>(({ className, defaultCountry, onValueChange, ...props }, ref) => {
  const locale = useLocale();
  const [phoneValue, setPhoneValue] = React.useState<Value | undefined>(
    props.defaultValue as Value | undefined
  );

  return (
    <PhoneInput
      id={props.id}
      name={props.name}
      ref={ref as unknown as PhoneInputRef}
      disabled={props.disabled}
      placeholder={props.placeholder}
      aria-invalid={props["aria-invalid"]}
      aria-describedby={props["aria-describedby"]}
      defaultCountry={defaultCountry as Country}
      labels={locale === "ar" ? arLabels : enLabels}
      countrySelectComponent={PhoneCountrySelect}
      countryCallingCodeEditable={false}
      value={
        props.value !== undefined ? (String(props.value) as Value) : phoneValue
      }
      onChange={(value) => {
        setPhoneValue(value);
        onValueChange?.(value ?? "");
      }}
      data-invalid={props["aria-invalid"]}
      className={cn(boxClass, "flex h-11 items-center overflow-hidden", className)}
      numberInputProps={{
        className:
          "h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm shadow-none outline-none ring-0 placeholder:text-text-muted focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
      }}
    />
  );
});
PhoneControl.displayName = "PhoneControl";

function OtpControl({
  length,
  className,
  onValueChange,
  ...props
}: NativeInputProps &
  SharedProps & { length: number; onValueChange?: (value: string) => void }) {
  const [typed, setTyped] = React.useState(String(props.defaultValue ?? ""));
  const invalid = props["aria-invalid"];

  return (
    <InputOTP
      id={props.id}
      name={props.name}
      disabled={props.disabled}
      aria-invalid={invalid}
      aria-describedby={props["aria-describedby"]}
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
    >
      {Array.from({ length }, (_, i) => (
        <InputOTPGroup key={i} className="min-w-0 flex-1">
          <InputOTPSlot
            index={i}
            className={cn(
              "h-12 w-full rounded-xl border border-border-soft bg-bg-plain text-base text-text-plain shadow-xs first:rounded-l-xl last:rounded-r-xl",
              invalid && "border-border-danger",
              props.disabled && "opacity-50",
              className
            )}
          />
        </InputOTPGroup>
      ))}
    </InputOTP>
  );
}

/* ------------------------------------------------------------------ */
/* Input                                                               */
/* ------------------------------------------------------------------ */

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      hint,
      error,
      id,
      disabled,
      previewProvided,
      onReview,
      length = 6,
      onValueChange,
      defaultCountry = "EG",
      ...props
    },
    ref
  ) => {
    const t = useInputText();
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const messageId = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    const shared: SharedProps = {
      id: inputId,
      disabled,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": messageId,
    };

    let control: React.ReactNode;

    switch (type) {
      case "otp":
        control = (
          <OtpControl
            {...props}
            {...shared}
            length={length}
            onValueChange={onValueChange}
          />
        );
        break;
      case "phone":
        control = (
          <PhoneControl
            {...props}
            {...shared}
            ref={ref}
            defaultCountry={defaultCountry}
            onValueChange={onValueChange}
          />
        );
        break;
      case "file":
        control = <FileControl {...props} {...shared} ref={ref} />;
        break;
      default:
        control = <TextControl {...props} {...shared} ref={ref} type={type} />;
    }

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(error && "text-text-danger", disabled && "opacity-50")}
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
            className="w-fit text-sm font-medium text-text-plain underline underline-offset-4 disabled:pointer-events-none disabled:opacity-50"
          >
            {t.review}
          </button>
        )}

        {error ? (
          <p id={messageId} role="alert" className="text-sm text-text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={messageId} className="text-xs text-text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };