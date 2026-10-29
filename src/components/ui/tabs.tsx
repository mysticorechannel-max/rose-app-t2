"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

// Root: handles state, keyboard navigation and ARIA (tab <-> panel) for us.
// Pass `dir="rtl"` to flip arrow-key direction in Arabic.
const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Segmented container: tabs are joined with no gap or padding
      "inline-flex w-full items-stretch",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base: size and typography. Every tab has a border so size never shifts
      "inline-flex h-11 flex-1 items-center justify-center gap-2.5 whitespace-nowrap border px-4 py-3.5 text-base font-medium leading-none transition-colors",
      // Joined segments: round only the outer edges (logical, so RTL flips), collapse inner border
      "rounded-none first:rounded-s-[10px] last:rounded-e-[10px] not-first:border-s-0",

      // Inactive (Light): static, no hover/focus variants in Figma
      "data-[state=inactive]:border-border-soft data-[state=inactive]:bg-bg-subtle data-[state=inactive]:text-text-plain",
      // Inactive (Dark): zinc-700 background per Figma
      "dark:data-[state=inactive]:bg-bg-soft",
      // Inactive + Disabled: zinc-500 text in both themes
      "data-[state=inactive]:disabled:text-text-soft dark:data-[state=inactive]:disabled:text-[var(--zinc-500)]",

      // Active (Light)
      "data-[state=active]:border-[var(--maroon-600)] data-[state=active]:bg-[var(--maroon-600)] data-[state=active]:text-text-inverse",
      // Active (Dark): semantic tokens match Figma
      "dark:data-[state=active]:border-border-primary dark:data-[state=active]:bg-bg-primary dark:data-[state=active]:text-text-inverse",

      // Active + Hovered (Light)
      "data-[state=active]:hover:border-bg-primary-saturated data-[state=active]:hover:bg-bg-primary-saturated",
      // Active + Hovered (Dark): soft-pink-400, no semantic token yet
      "dark:data-[state=active]:hover:border-[var(--soft-pink-400)] dark:data-[state=active]:hover:bg-[var(--soft-pink-400)]",

      // Active + Focused: raised so neighbours don't clip the ring
      "data-[state=active]:focus-visible:relative data-[state=active]:focus-visible:z-10",
      // Focused ring (Light): 4px
      "data-[state=active]:focus-visible:ring-4 data-[state=active]:focus-visible:ring-bg-primary-saturated/25",
      // Focused ring (Dark): 3px soft-pink-400 at 25%
      "dark:data-[state=active]:focus-visible:ring-3 dark:data-[state=active]:focus-visible:ring-[var(--soft-pink-400)]/25",

      // Active + Disabled (Light): gray background
      "data-[state=active]:disabled:border-border-soft data-[state=active]:disabled:bg-bg-soft data-[state=active]:disabled:text-text-plain",
      // Active + Disabled (Dark): zinc-500, no semantic token yet
      "dark:data-[state=active]:disabled:border-[var(--zinc-500)] dark:data-[state=active]:disabled:bg-[var(--zinc-500)] dark:data-[state=active]:disabled:text-text-plain",

      // Shared: no default outline, disabled tabs are inert
      "focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      // Panel
      "mt-2 focus-visible:outline-none",
      // Focus ring (Light): same as the active tab
      "focus-visible:ring-4 focus-visible:ring-bg-primary-saturated/25",
      // Focus ring (Dark): same as the active tab, instead of the light pink token
      "dark:focus-visible:ring-3 dark:focus-visible:ring-[var(--soft-pink-400)]/25",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
