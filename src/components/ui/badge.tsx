import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full  px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-bg-primary text-text-inverse hover:bg-bg-primary-saturated",
        secondary:
          "border-transparent bg-bg-secondary-faint text-text-primary hover:bg-bg-secondary-fade",
        subtle:
          "border-transparent bg-bg-soft text-text-plain hover:bg-bg-muted", 
        
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
