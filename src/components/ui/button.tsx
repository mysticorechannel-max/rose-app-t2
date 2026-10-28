import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    // Layout
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",

    // Shape and typography
    "rounded-lg border border-transparent text-sm font-medium",

    // Interaction
    "cursor-pointer transition-colors focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background",

    // Disabled and loading (flat grey, no border)
    "data-[disabled]:pointer-events-none data-[disabled]:border-transparent",
    "data-[disabled]:bg-bg-soft data-[disabled]:text-text-muted",
    "dark:data-[disabled]:bg-bg-muted dark:data-[disabled]:text-text-subtle",

    // Icons
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-bg-primary text-primary-foreground hover:bg-bg-primary-saturated",
        secondary:
          "bg-bg-primary-fade text-text-primary hover:bg-bg-primary-faint dark:text-text-plain",
        outline:
          "border-border-primary bg-bg-plain text-text-primary hover:bg-bg-primary-fade",
        subtle:
          "border-border-soft bg-bg-muted text-text-plain hover:bg-bg-soft",
        ghost: "bg-transparent text-text-plain hover:bg-bg-soft",
        destructive:
          "bg-bg-danger text-text-inverse hover:bg-bg-danger-saturated",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-6 text-base",
        icon: "size-10 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled = false,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  // Variables
  const Component = asChild ? Slot : "button";
  const isDisabled = disabled || loading;
  const shouldShowSpinner = loading && !asChild;

  return (
    <Component
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={asChild && isDisabled ? true : undefined}
      aria-busy={loading || undefined}
      data-disabled={isDisabled || undefined}
      data-slot="button"
      type={asChild ? undefined : type}
      {...props}
    >
      {children}
      {shouldShowSpinner && (
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      )}
    </Component>
  );
}

export { buttonVariants };