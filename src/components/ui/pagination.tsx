"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

// Shared square button look (32x32, radius 8px) for every control
const itemBase = [
  "inline-flex size-8 items-center justify-center rounded-[8px] border p-2.5",
  "text-[13px] font-semibold leading-none transition-colors",
  // Focus: 4px ring (3px in dark), raised so neighbours don't clip it
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

// Current page (+ hover)
const itemCurrent = [
  "border-transparent bg-[var(--maroon-600)] text-text-inverse hover:bg-bg-primary-saturated",
  "dark:bg-bg-primary dark:text-text-inverse dark:hover:bg-[var(--soft-pink-400)]",
].join(" ")

// Arrow icons flip in RTL so "previous" always points backward
const iconClass = "size-4 rtl:rotate-180"

/* -------------------------------------------------------------------------- */
/*  UI components                                                             */
/* -------------------------------------------------------------------------- */

// Wrapper: <nav> landmark, centered
const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

// List of controls (5px gap from Figma)
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
  /** Marks the current page */
  isActive?: boolean
  /** Makes the control inert (first/prev on page 1, next/last on the last page) */
  disabled?: boolean
} & React.ComponentProps<"a">

// Single control (page number or arrow). Disabled state blocks clicks and focus
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

/* -------------------------------------------------------------------------- */
/*  Pagination logic                                                          */
/* -------------------------------------------------------------------------- */

const DEFAULT_LIMIT = 10

// Parse a query value into a positive integer, or fall back
function toPositiveInt(value: string | null, fallback: number) {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : fallback
}

// Page list with ellipsis, e.g. [1, 2, 3, "ellipsis", 10]
function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  // Few pages: show all of them
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  // Near the start: 1 2 3 ... last
  if (current <= 3) return [1, 2, 3, "ellipsis", total]

  // Near the end: 1 ... last-2 last-1 last
  if (current >= total - 2) return [1, "ellipsis", total - 2, total - 1, total]

  // Middle: 1 ... current-1 current current+1 ... last
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total]
}

type PaginationControlsProps = {
  /** Total number of items across all pages */
  totalItems: number
  /** Page size used when `limit` is missing from the URL */
  defaultLimit?: number
  className?: string
}

/**
 * URL-driven pagination. The URL (?page=2&limit=10) is the single source of
 * truth, so refresh and browser back/forward restore the state automatically.
 * Must be rendered inside <Suspense> because it uses useSearchParams.
 */
function PaginationControls({
  totalItems,
  defaultLimit = DEFAULT_LIMIT,
  className,
}: PaginationControlsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Sanitize: missing, negative, decimal or non-numeric values fall back
  const limit = toPositiveInt(searchParams.get("limit"), defaultLimit)
  const totalPages = Math.max(1, Math.ceil(Math.max(0, totalItems) / limit))
  const rawPage = toPositiveInt(searchParams.get("page"), 1)
  // Out-of-range pages are clamped to the last page
  const page = Math.min(rawPage, totalPages)

  // Navigate to a page (adds a history entry, so back/forward work)
  const goTo = React.useCallback(
    (target: number) => {
      const next = Math.min(Math.max(1, target), totalPages)
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", String(next))
      params.set("limit", String(limit))
      router.push(`${pathname}?${params.toString()}`)
    },
    [limit, pathname, router, searchParams, totalPages]
  )

  // Fix an invalid URL (bad page/limit). Uses replace so history stays clean
  React.useEffect(() => {
    if (
      searchParams.get("page") !== String(page) ||
      searchParams.get("limit") !== String(limit)
    ) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", String(page))
      params.set("limit", String(limit))
      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [page, limit, pathname, router, searchParams])

  // Empty dataset or a single page: nothing to paginate
  if (totalItems <= 0 || totalPages <= 1) return null

  const isFirst = page === 1
  const isLast = page === totalPages

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            href="#"
            disabled={isFirst}
            onClick={(e) => {
              e.preventDefault()
              goTo(1)
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            disabled={isFirst}
            onClick={(e) => {
              e.preventDefault()
              goTo(page - 1)
            }}
          />
        </PaginationItem>

        {getPageItems(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === page}
                aria-label={`Go to page ${item}`}
                onClick={(e) => {
                  e.preventDefault()
                  goTo(item)
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            disabled={isLast}
            onClick={(e) => {
              e.preventDefault()
              goTo(page + 1)
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            href="#"
            disabled={isLast}
            onClick={(e) => {
              e.preventDefault()
              goTo(totalPages)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
PaginationControls.displayName = "PaginationControls"

// Server-side helper: read sanitized page/limit from searchParams for data fetching
function parsePaginationParams(
  params: { page?: string | string[]; limit?: string | string[] },
  defaultLimit = DEFAULT_LIMIT
) {
  const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v) ?? null
  return {
    page: toPositiveInt(first(params.page), 1),
    limit: toPositiveInt(first(params.limit), defaultLimit),
  }
}

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
  PaginationControls,
  parsePaginationParams,
}