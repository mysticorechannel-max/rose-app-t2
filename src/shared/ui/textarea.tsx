
"use client";

import * as React from "react";
import { cn } from "../lib/utils/tailwindcn.utils";



export interface TextareaProps extends React.ComponentProps<"textarea"> {
  /** Label shown above the textarea */
  label?: string;
  /** Error message. When set, the textarea switches to the error state */
  error?: string;
  /** Show a "current/max" counter. Requires maxLength. Hidden by default */
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      showCount = false,
      id,
      disabled,
      maxLength,
      value,
      defaultValue,
      onChange,
      "aria-describedby": describedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;
    const hasError = Boolean(error);

    // Track length for uncontrolled usage; controlled usage reads from `value`
    const [innerLength, setInnerLength] = React.useState(String(defaultValue ?? "").length);
    const length = value !== undefined ? String(value).length : innerLength;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInnerLength(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "text-sm font-medium",
              disabled ? "text-text-muted" : hasError ? "text-text-danger" : "text-text-plain"
            )}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          {...(value !== undefined ? { value } : { defaultValue })}
          onChange={handleChange}
          aria-invalid={hasError || undefined}
          aria-describedby={
            [hasError ? errorId : null, describedBy].filter(Boolean).join(" ") || undefined
          }
          className={cn(
            // Base
            "flex min-h-[150px] w-full rounded-lg border",
            "border-border-soft bg-bg-plain",
            "p-4 text-sm font-normal text-text-plain placeholder:text-text-muted",

            // Layout
            "max-h-[320px] resize-y break-words [overflow-wrap:anywhere]",

            // Hover
            "hover:border-border-default",

            // Focus
            "focus-visible:border-border-primary focus-visible:ring-3 focus-visible:ring-ring-default focus-visible:outline-none",

            // Error
            "aria-[invalid=true]:border-border-danger aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-ring-danger",

            // Disabled
            "disabled:cursor-not-allowed disabled:resize-none",
            "disabled:border-transparent disabled:bg-bg-muted",
            "disabled:text-text-muted disabled:hover:border-transparent",

            className
          )}
          {...props}
        />

        {(hasError || (showCount && maxLength)) && (
          <div className="flex items-start justify-between gap-2">
            {hasError ? (
              <p id={errorId} role="alert" className="text-sm text-text-danger">
                {error}
              </p>
            ) : (
              <span />
            )}
            {showCount && maxLength ? (
              <span className="text-xs text-text-muted" aria-live="off">
                {length}/{maxLength}
              </span>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
