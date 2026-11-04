"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> & {
  label?: ReactNode;
  error?: string;
};

function Checkbox({ className, label, error, id, ...props }: CheckboxProps) {
  // Variables
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const errorId = `${checkboxId}-error`;
  const hasError = Boolean(error);

  const checkbox = (
    <CheckboxPrimitive.Root
      {...props}
      id={checkboxId}
      aria-invalid={hasError || undefined}
      aria-describedby={hasError ? errorId : props["aria-describedby"]}
      data-slot="checkbox"
      className={cn(
        // Shape
        "peer size-5 shrink-0 rounded-sm border border-border-primary bg-bg-plain text-primary-foreground",

        // Interaction
        "cursor-pointer outline-none transition-[color,background-color,box-shadow]",
        "hover:ring-4 hover:ring-bg-primary-fade",

        // Checked
        "data-[state=checked]:bg-bg-primary",

        // Focus (declared after hover so it wins)
        "focus-visible:ring-2 focus-visible:ring-ring",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",

        // Error
        "aria-invalid:border-border-danger aria-invalid:hover:ring-bg-danger-faint",

        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",

        className
      )}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <CheckIcon className="size-3.5" strokeWidth={3} aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label && !hasError) return checkbox;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        {checkbox}
        {label && (
          <label
            htmlFor={checkboxId}
            className="cursor-pointer text-sm text-text-plain peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
          >
            {label}
          </label>
        )}
      </div>

      {hasError && (
        <p id={errorId} role="alert" className="text-sm text-text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export { Checkbox };