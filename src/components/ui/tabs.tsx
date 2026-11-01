"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

// TODO: replace the primitives below with bg-bg-primary once globals.css
const activeColors = [
  "data-[state=active]:border-border-primary data-[state=active]:bg-bg-primary data-[state=active]:text-text-inverse",
  "data-[state=active]:hover:border-bg-primary-saturated data-[state=active]:hover:bg-bg-primary-saturated",
].join(" ");

const inactiveColors =
  "data-[state=inactive]:border-border-soft data-[state=inactive]:bg-bg-plain data-[state=inactive]:text-text-plain";

// Raised above neighbours so the ring isn't clipped
const focusRing = [
  "focus-visible:outline-none",
  "data-[state=active]:focus-visible:relative data-[state=active]:focus-visible:z-10",
  "data-[state=active]:focus-visible:ring-4 data-[state=active]:focus-visible:ring-bg-primary-saturated/25",
].join(" ");

const disabledColors = [
  "disabled:pointer-events-none disabled:cursor-not-allowed",
  "disabled:border-border-soft disabled:bg-bg-muted disabled:text-text-soft",
  "dark:disabled:text-[var(--zinc-500)]",
].join(" ");

// Root handles state, keyboard navigation and ARIA.
// Pass dir="rtl" to flip arrow-key direction in Arabic.
const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("inline-flex w-full items-stretch", className)}
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
      // Every tab has a border so its size never shifts when activated
      "inline-flex h-11 flex-1 items-center justify-center gap-2.5 whitespace-nowrap border px-4 py-3.5 text-base font-medium leading-none transition-colors",
      // Logical edges so the rounding flips in RTL
      "rounded-none first:rounded-s-[10px] last:rounded-e-[10px] not-first:border-s-0",
      inactiveColors,
      activeColors,
      focusRing,
      // Last so disabled wins over the active and inactive colors
      disabledColors,
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
      "mt-2 focus-visible:outline-none",
      "focus-visible:ring-4 focus-visible:ring-bg-primary-saturated/25",
      "dark:focus-visible:ring-3 dark:focus-visible:ring-[var(--soft-pink-400)]/25",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };