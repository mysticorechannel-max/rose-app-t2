<<<<<<< HEAD
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
=======
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
>>>>>>> 14ab3b54d68e08a3d27349bd64ac7e322230e691
