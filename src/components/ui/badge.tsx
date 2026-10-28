import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-bg-primary text-primary-foreground hover:bg-bg-primary-saturated",
        secondary:
          "border-transparent bg-bg-primary-fade text-text-primary hover:bg-bg-primary-faint dark:text-text-plain",
        subtle:
          "border-transparent border-border-soft bg-bg-muted text-text-plain hover:bg-bg-soft", 
        
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
