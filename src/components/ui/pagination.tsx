"use client";

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { cn } from "@/lib/utils"

// Shared square button look (32x32, radius 8px) for every control
const itemBase = [
  "inline-flex size-8 items-center justify-center rounded-[8px] border p-2.5",
  "text-[13px] font-semibold leading-none transition-colors",
  "focus-visible:relative focus-visible:z-10 focus-visible:outline-none",
  "focus-visible:ring-4 focus-visible:ring-bg-primary-saturated/25",
  "dark:focus-visible:ring-3 dark:focus-visible:ring-[var(--soft-pink-400)]/25",
  // Disabled: inert and faded (not in Figma, derived from the Tabs pattern)
  "aria-disabled:pointer-events-none aria-disabled:opacity-50",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ")

// Default state (+ hover)
const itemDefault = [
  "border-border-subtle bg-bg-plain text-text-plain hover:bg-bg-subtle",
  "dark:border-transparent dark:bg-bg-soft dark:hover:bg-bg-default",
].join(" ")

// Current page (Active)
const itemCurrent = [
  "border-transparent bg-[var(--maroon-600)] text-text-inverse hover:bg-bg-primary-saturated",
  "dark:bg-bg-primary dark:text-text-inverse dark:hover:bg-[var(--soft-pink-400)]",
].join(" ")

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-[5px]", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={className} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & React.ComponentProps<"a">

// Page number / control. Rendered as <a> so it can be a real link or a button
const PaginationLink = ({
  className,
  isActive,
  disabled,
  onClick,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    aria-disabled={disabled || undefined}
    tabIndex={disabled ? -1 : props.tabIndex}
    onClick={disabled ? (e) => e.preventDefault() : onClick}
    className={cn(itemBase, isActive ? itemCurrent : itemDefault, className)}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

// Arrow icons flip in RTL (rtl:rotate-180), so "previous" always points backward
const iconClass = "size-4 rtl:rotate-180"

const PaginationFirst = (props: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to first page" {...props}>
    <ChevronsLeft className={iconClass} aria-hidden="true" />
  </PaginationLink>
)
PaginationFirst.displayName = "PaginationFirst"

const PaginationPrevious = (
  props: React.ComponentProps<typeof PaginationLink>
) => (
  <PaginationLink aria-label="Go to previous page" {...props}>
    <ChevronLeft className={iconClass} aria-hidden="true" />
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = (props: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" {...props}>
    <ChevronRight className={iconClass} aria-hidden="true" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationLast = (props: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to last page" {...props}>
    <ChevronsRight className={iconClass} aria-hidden="true" />
  </PaginationLink>
)
PaginationLast.displayName = "PaginationLast"

// "..." has no background or border in Figma
const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "flex size-8 items-center justify-center text-[13px] font-semibold text-text-plain",
      className
    )}
    {...props}
  >
    …
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
}