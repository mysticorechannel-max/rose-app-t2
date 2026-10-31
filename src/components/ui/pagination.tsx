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

const DEFAULT_LIMIT = 10
const FIRST_PAGE = 1
// Up to this many pages are shown in full, without an ellipsis
const MAX_PAGES_WITHOUT_ELLIPSIS = 5
// Pages shown at each end of the list before the ellipsis kicks in
const EDGE_PAGES_COUNT = 3

const itemBase = [
  "inline-flex size-8 items-center justify-center rounded-[8px] border p-2.5",
  "text-[13px] font-semibold leading-none transition-colors",
  "focus-visible:relative focus-visible:z-10 focus-visible:outline-none",
  "focus-visible:ring-4 focus-visible:ring-bg-primary-saturated/25",
  "dark:focus-visible:ring-3 dark:focus-visible:ring-[var(--soft-pink-400)]/25",
  "aria-disabled:pointer-events-none aria-disabled:opacity-50",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ")

const itemDefault = [
  "border-border-subtle bg-bg-plain text-text-plain hover:bg-bg-subtle",
  "dark:border-transparent dark:bg-bg-soft dark:hover:bg-bg-default",
].join(" ")

const itemCurrent = [
  "border-transparent bg-[var(--maroon-600)] text-text-inverse hover:bg-bg-primary-saturated",
  "dark:bg-bg-primary dark:text-text-inverse dark:hover:bg-[var(--soft-pink-400)]",
].join(" ")

// Flips the arrows in RTL so "previous" always points backward
const iconClass = "size-4 rtl:rotate-180"

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

function toPositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(min, value), max)
}

function getPageItems(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= MAX_PAGES_WITHOUT_ELLIPSIS) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  // 1 2 3 ... last
  if (currentPage <= EDGE_PAGES_COUNT) {
    return [1, 2, 3, "ellipsis", totalPages]
  }

  // 1 ... last-2 last-1 last
  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages]
  }

  // 1 ... prev current next ... last
  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ]
}

type PaginationControlsProps = {
  /** Total number of items across all pages */
  totalItems: number
  /** Page size used when `limit` is missing from the URL */
  defaultLimit?: number
  className?: string
}

// The URL (?page=2&limit=10) is the single source of truth, so refresh and
// back/forward restore the state. Render inside <Suspense> (useSearchParams).
function PaginationControls({
  totalItems,
  defaultLimit = DEFAULT_LIMIT,
  className,
}: PaginationControlsProps) {
  // Navigation
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Variables
  const limit = toPositiveInt(searchParams.get("limit"), defaultLimit)
  const totalPages = Math.max(1, Math.ceil(Math.max(0, totalItems) / limit))
  const requestedPage = toPositiveInt(searchParams.get("page"), FIRST_PAGE)
  const page = Math.min(requestedPage, totalPages)
  const isFirstPage = page === FIRST_PAGE
  const isLastPage = page === totalPages
  const pageItems = getPageItems(page, totalPages)
  const isUrlValid =
    searchParams.get("page") === String(page) &&
    searchParams.get("limit") === String(limit)

  // Functions
  const buildUrl = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(targetPage))
    params.set("limit", String(limit))
    return `${pathname}?${params.toString()}`
  }

  const goToPage = (targetPage: number) => {
    router.push(buildUrl(clamp(targetPage, FIRST_PAGE, totalPages)))
  }

  const createClickHandler =
    (targetPage: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      goToPage(targetPage)
    }

  // Effects
  // replace (not push) so fixing a bad URL doesn't add a history entry
  React.useEffect(() => {
    if (!isUrlValid) router.replace(buildUrl(page))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUrlValid, page])

  // Nothing to paginate for an empty dataset or a single page
  if (totalItems <= 0 || totalPages <= 1) return null

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            href="#"
            disabled={isFirstPage}
            onClick={createClickHandler(FIRST_PAGE)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            disabled={isFirstPage}
            onClick={createClickHandler(page - 1)}
          />
        </PaginationItem>

        {pageItems.map((item, index) =>
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
                onClick={createClickHandler(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            disabled={isLastPage}
            onClick={createClickHandler(page + 1)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            href="#"
            disabled={isLastPage}
            onClick={createClickHandler(totalPages)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
PaginationControls.displayName = "PaginationControls"

// Server-side helper: sanitized page/limit for data fetching
function parsePaginationParams(
  params: { page?: string | string[]; limit?: string | string[] },
  defaultLimit = DEFAULT_LIMIT
) {
  const firstValue = (value?: string | string[]) =>
    (Array.isArray(value) ? value[0] : value) ?? null

  return {
    page: toPositiveInt(firstValue(params.page), FIRST_PAGE),
    limit: toPositiveInt(firstValue(params.limit), defaultLimit),
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