# Rose App — Project Rules for AI Agents

## Project Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Data Fetching**: TanStack React Query v5
- **Forms**: React Hook Form + Zod
- **Auth**: NextAuth v4
- **i18n**: next-intl v4
- **Toasts**: Sonner

## Folder Structure

```
src/
├── app/
│   ├── api/
│   │   └── <route>/
│   │       └── route.ts                  # Route Handler (avoid exposing tokens/API URL)
│   ├── <route>/                          # kebab-case always
│   │   ├── _actions/                     # Private server actions (not reused elsewhere)
│   │   │   └── <action-name>.action.ts
│   │   ├── _components/                  # Truly private, one-off components only
│   │   │   │                             # (page-specific wrappers, unique layout shells)
│   │   │   │                             # NOT for feature sections — those go in features/
│   │   │   └── <component-name>.tsx
│   │   ├── _hooks/                       # Private hooks (not reused elsewhere)
│   │   │   └── <hook-name>.ts
│   │   ├── _utils/                       # Private utils (not reused elsewhere)
│   │   │   └── <utility-name>.ts
│   │   ├── <nested-route>/               # Nested route segment
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx                        # Root layout
│   ├── page.tsx
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── not-found.tsx
│   └── loading.tsx
│
├── components/
│   ├── shared/                           # Small, generic, highly reusable (no feature logic)
│   │   └── <component-name>.tsx
│   ├── features/                         # Anything belonging to a feature domain
│   │   └── <feature-name>/               # Grouped by domain regardless of reuse count
│   │       └── <component-name>.tsx      # (home/, products/, auth/, bag/, categories/...)
│   ├── skeletons/
│   │   ├── shared/                       # Base skeleton parts (e.g. bar.skeleton.tsx)
│   │   │   └── <component-name>.skeleton.tsx
│   │   └── <feature-name>/               # Feature skeletons (e.g. product.skeleton.tsx)
│   │       └── <component-name>.skeleton.tsx
│   ├── layout/
│   │   ├── app/                          # Global UI: Navbar, Footer
│   │   │   └── <component-name>.tsx
│   │   └── <feature-name>/               # Feature layout: sidebar, auth-header
│   │       └── <component-name>.tsx
│   └── ui/                               # shadcn generated — NEVER edit manually
│       └── <component-name>.tsx
│
├── components/providers/
│   ├── app/
│   │   ├── index.tsx                     # Groups all global providers
│   │   └── components/
│   │       └── <provider>.provider.tsx
│   └── <feature-name>/
│       └── <provider-name>.provider.tsx
│
├── hooks/
│   ├── shared/                           # Non-feature-specific hooks
│   │   └── <hook-name>.ts
│   └── <feature-name>/                   # Feature-specific hooks
│       └── <hook-name>.ts
│
├── lib/
│   ├── constants/
│   │   └── <feature-name>.constant.ts
│   ├── schemes/                          # Zod validation schemas
│   │   └── <feature-name>.schema.ts
│   ├── types/
│   │   └── <feature-name>.d.ts
│   ├── utils/
│   │   └── <feature-name>.util.ts
│   ├── services/                         # API call functions (fetch wrappers)
│   │   └── <feature-name>.service.ts
│   └── actions/                          # Global server actions (reused across routes)
│       └── <feature-name>.action.ts
│
├── messages/
│   └── <language>.json                   # Flat, one-level translations
│
├── i18n/
│   ├── request.ts
│   ├── routing.ts
│   └── navigation.ts
│
├── middleware.ts
└── auth.ts
```

## Naming Conventions

| Type          | Convention                  | Example                                |
| ------------- | --------------------------- | -------------------------------------- |
| Route folders | kebab-case                  | `forgot-password/`, `product-details/` |
| Components    | PascalCase                  | `ProductCard.tsx`                      |
| Hooks         | camelCase + `use` prefix    | `useProducts.ts`                       |
| Schemas       | camelCase + `Schema` suffix | `loginSchema`                          |
| Services      | camelCase + feature         | `auth.service.ts`                      |
| Actions       | camelCase + `Action` suffix | `registerAction`                       |
| Constants     | SCREAMING_SNAKE_CASE        | `JSON_HEADER`, `BASE_URL`              |
| Types files   | camelCase + `.d.ts`         | `product.d.ts`                         |
| Utility files | camelCase + feature         | `date.util.ts`                         |
| Boolean state | `is` prefix                 | `isMounted`, `isPending`, `isOpen`     |
| Functions     | verb-first                  | `handleLocaleChange`, `fetchUser`      |

## React Component Internal Order

Always follow this order inside every component body:

```typescript
export default function MyComponent() {
  // Translation
  // Navigation
  // State
  // Ref
  // Context
  // Hooks
  // Queries
  // Mutation
  // Form & validation
  // Variables  (flexible — use when needed)
  // Functions
  // Effects

  return <></>;
}
```

Use short organisational comments (`// State`, `// Effects`) only in components longer than ~40 lines.

## TypeScript Rules

- Never use `any` — use `unknown` and narrow it, or define a proper type
- Always derive TypeScript types from Zod schemas using `z.infer<typeof schema>`
- Type all function return values explicitly
- Prefer discriminated unions over boolean flags

```typescript
// ✅ Good — type derived from schema
export type LoginFields = z.infer<typeof loginSchema>;

// ✅ Good — unknown narrowed
function handleError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unexpected error";
}

// ❌ Bad
const handler = async (data: any) => { ... };
```

## File Exports

- One component per file
- Named exports for all components
- Default export only for Next.js pages and layouts

```typescript
// ✅ components/features/products/ProductCard.tsx
export function ProductCard({ product }: ProductCardProps) { ... }

// ✅ app/products/page.tsx
export default function ProductsPage() { ... }
```

## Import Order

```typescript
// 1. React / Next.js core
import { useState } from "react";
import { useRouter } from "next-intl"; // NOT next/navigation

// 2. Third-party libraries
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

// 3. Internal aliases
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/schemes/auth.schema";

// 4. Relative
import { ProductCard } from "./ProductCard";
import type { ProductCardProps } from "./types";
```

## Code Quality Rules

**Blank lines between sections** — always leave a blank line after `"use client"`, imports, constants, and between logical sections inside a component or function.

**Comments before sections** — add a short, concise comment before each logical section inside a component body. Do not write obvious or long descriptions.

**No commented-out code** — remove all dead code. If intentionally kept, add a clear comment explaining why.

**No `console.log`** — remove all console.log before committing. Use `console.error` only for caught errors if needed.

**No unused imports** — every import must be used. Unused imports increase bundle size.

**Stable keys in lists** — never use array index as a React key. Use a unique, stable identifier from the data.

```typescript
// ✅ Good
products.map((product) => <ProductCard key={product.id} product={product} />)

// ❌ Bad
products.map((product, index) => <ProductCard key={index} product={product} />)
```

## File & Function Size (guidelines, not hard limits)

- Aim for functions under 20 lines; files under 200 lines.
- Split only when there are genuinely different responsibilities — not to hit a line count.
- Do not create custom hooks, utils, or sub-components for a single simple use.

## CSS & Design Tokens

- Use semantic tokens (`bg-primary`, `text-muted-foreground`) in components — never hardcoded hex values.
- Layer order in `globals.css`: primitives → semantic (`:root` / `.dark`) → `@theme inline`.
- Do not rewrite colour mappings or change Figma token values during a cleanup task.
- `--blue-700: #cc3a5b` is flagged `TODO(lead-confirm)` — do not change until the lead confirms.
- Do not split `globals.css` by line count alone; clear token-group comments are sufficient.

## Styling — Tailwind CSS + shadcn/ui

### Pixel-Perfect UI

The UI must match the Figma design **exactly**. Every component must be implemented to pixel-perfect accuracy — spacing, font sizes, colors, border radius, shadows, and responsive breakpoints must all match the design spec precisely.

Before marking any UI task complete:
- Compare side-by-side with the Figma frame
- Check all breakpoints (`sm`, `md`, `lg`, `xl`)
- Verify spacing, padding, and margin values match the design tokens
- Never approximate — if a value doesn't map to a Tailwind class, check the design token or use the exact value from the design system

### shadcn/ui Rules

Never manually edit files inside `components/ui/`. They are generated and owned by shadcn.

Add components via CLI only:
```bash
npx shadcn@latest add [component-name]
```

Extend by wrapping — never by modifying the source.

### `cn()` Utility

Use `cn()` whenever you need JavaScript logic inside a `className`. Never use string concatenation or template literals for conditional classes.

```typescript
import { cn } from "@/lib/utils";

// ✅ Good
<div className={cn(
  "base-class another-class",
  isActive && "active-class",
  variant === "destructive" && "text-destructive border-destructive",
  className
)} />

// ❌ Bad
<div className={`base-class ${isActive ? "active-class" : ""}`} />
```

### No Static Values in Tailwind

Do not use arbitrary static values like `w-[1280px]`. Always use Tailwind's built-in utility scale. Use the `container` class for consistent page-width layouts.

### Text Casing — Use CSS, Not Content

Control text case with Tailwind utility classes. Never hardcode content in uppercase or lowercase in JSX.

```typescript
// ✅ Good — easy to change later without editing content
<h2 className="uppercase tracking-widest">section title</h2>

// ❌ Bad — hardcoded, hard to update
<h2>SECTION TITLE</h2>
```

### Dark Mode — Use CSS Variables

All colors must use shadcn's CSS variable tokens, not hardcoded Tailwind color values. This ensures dark mode works automatically.

```typescript
// ✅ Good — works in both light and dark mode
<div className="bg-background text-foreground">
<p className="text-muted-foreground">

// ❌ Bad — breaks in dark mode
<div className="bg-white text-gray-900">
<p className="text-gray-500">
```

### Lucide Icons

```typescript
// Always set size via className — not the size prop
import { ShoppingCart, Trash2 } from "lucide-react";

<ShoppingCart className="h-5 w-5" />
<Trash2 className="h-4 w-4 text-destructive" />
```

### Composability — Accept `className`

Every reusable component should accept and forward a `className` prop.

## i18n & Theme

- Locales: `en` (LTR, Sarabun) and `ar` (RTL, Tajawal). Both subsets include `latin`.
- All UI strings go through `next-intl` — no hardcoded display text in components.
- Preserve `isMounted` hydration guard in `ThemeSwitcher`; preserve the scoped `eslint-disable` block.
- Do not change `useEffect` to `useLayoutEffect` to silence lint.
- Translation keys must be flat, one-level deep in JSON files
- Use `useRouter` and `usePathname` from `@/i18n/navigation` (locale-aware)
- Use `useSearchParams` from `next/navigation` (NOT locale-specific)

## Next.js 14 App Router Rules

### Server vs Client Components

Default to Server Components. Add `"use client"` only when the component needs:
- Event listeners (`onClick`, `onChange`, etc.)
- Browser APIs (`window`, `localStorage`, etc.)
- React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Third-party client-only libraries

**Never place `"use client"` on a page or layout.** Keep pages as Server Components and extract the interactive part into a child `_components/` file.

### Data Fetching Strategy

**Default: server-side fetching** — call services directly in async Server Components and wrap with `<Suspense>`.

**Client-side fetching** — only when data depends on client state, interactivity, or real-time updates. In these cases, use a Route Handler (`app/api/`) and React Query.

**Never use Axios** — use the native `fetch()` API. Next.js extends `fetch` with built-in caching, revalidation, and deduplication.

**Suspense only works when the child component is `async` and returns a Promise.** A non-async component wrapped in `<Suspense>` has no effect.

### Mutations Strategy

Always use **Server Actions** for mutations (create, update, delete).

When the mutation is triggered from a **Client Component**, combine the Server Action with a **React Query mutation** via a custom hook for better caching, revalidation, and UX.

Flow: **Server Action → Custom Hook (useMutation) → Form/Client Component**

### Route Handlers (`app/api/`)

Use Route Handlers only when you need to avoid exposing sensitive information (tokens, API URLs) on the client. Do not create a Route Handler for every endpoint — server-side fetching directly in Server Components is preferred.

### App Directory Files

| File | Purpose |
|---|---|
| `layout.tsx` | Persistent shell — wraps all children, never re-renders on navigation |
| `page.tsx` | Route content — required in every route segment |
| `loading.tsx` | Shown while server-side promises are pending (auto Suspense boundary) |
| `error.tsx` | Catches errors in the segment — must be `"use client"` |
| `not-found.tsx` | Shown when `notFound()` is called inside the segment |
| `global-error.tsx` | Root-level error catch — required at `app/` root |

### Metadata

Export `metadata` or `generateMetadata` from every page for SEO.

### Server-Side Search (URL-based)

Search inputs must write to the URL (not local state) and must be debounced. Data must be fetched already filtered from the server — never fetch all data and filter in memory on the client.

### Images

Always use `next/image` — never use the plain `<img>` tag. The Next.js `<Image>` component provides automatic optimization, lazy loading, WebP/AVIF output, CLS prevention, and better Core Web Vitals.

## Mutations Flow

Always follow this three-layer pattern for mutations triggered from Client Components:

```
Server Action  →  Custom Hook (useMutation)  →  Form / Client Component
```

### Layer 1 — Server Action

Place in `lib/actions/<feature>.action.ts` if reused globally, or in `app/<route>/_actions/<name>.action.ts` if private to that route.

### Layer 2 — Custom Hook

Place in `hooks/<feature-name>/<hook-name>.ts` if reused, or `app/<route>/_hooks/<hook-name>.ts` if private.

Always handle `onError` inside the mutation.

### Layer 3 — Form Component

Place in `app/<route>/_components/<form-name>.tsx` or `components/features/<feature>/<form-name>.tsx`.

### Services vs Actions

| | `lib/services/` | `lib/actions/` |
|---|---|---|
| **Runs on** | Server (called from Server Components) | Server only (`"use server"`) |
| **Called from** | Server Components, Route Handlers | Client Components (via mutation hook) |
| **Use for** | GET / read operations | POST / PUT / DELETE mutations |

### Query Key Factory

Centralize all query keys — never hardcode strings inline.

```typescript
// lib/constants/query-keys.constant.ts
export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (filters?: ProductFilters) => ["products", "list", filters] as const,
    detail: (id: string) => ["products", "detail", id] as const,
  },
} as const;
```

### Read Queries (Client-side)

Wrap every `useQuery` call in a custom hook. Never call `useQuery` directly inside a component.

## Forms — React Hook Form + Zod + shadcn

### Schema First

Always define the Zod schema in `lib/schemes/<feature>.schema.ts` before writing the form. Derive the TypeScript type from the schema — never duplicate types.

```typescript
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Always derive types from schemas — never define separately
export type RegistrationFields = z.infer<typeof registerSchema>;
```

### shadcn Form Components

Always use shadcn `<Form>` components with React Hook Form. Never wire up raw native HTML forms.

### Field Comment Structure

Every form field must follow this comment structure:

```typescript
{/* Field name */}
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      {/* Label */}
      <FormLabel>{t("label")}</FormLabel>

      {/* Field */}
      <FormControl>
        <Input {...field} />
      </FormControl>

      {/* Feedback */}
      <FormMessage />
    </FormItem>
  )}
/>
```

## Component Architecture

### Component Categories

| Folder | Purpose | Example |
|---|---|---|
| `components/shared/` | Generic, small, highly reusable, no feature logic | `Headline.tsx`, `SectionWrapper.tsx` |
| `components/features/<feature>/` | Feature-specific, less customizable | `ProductCard.tsx`, `CartSummary.tsx` |
| `components/skeletons/<feature>/` | Feature skeleton loaders | `product-card.skeleton.tsx` |
| `components/skeletons/shared/` | Base skeleton building blocks | `bar.skeleton.tsx`, `circle.skeleton.tsx` |
| `components/layout/app/` | Global persistent UI | `Navbar.tsx`, `Footer.tsx` |
| `components/layout/<feature>/` | Feature-level layout UI | `AuthHeader.tsx`, `DashboardSidebar.tsx` |
| `components/ui/` | shadcn generated — never edit | `button.tsx`, `input.tsx` |
| `app/<route>/_components/` | Private components, not reused elsewhere | `register-form.tsx` |

### Loading / Error / Empty States

Every data-driven component must handle all three states: loading, error, and empty.

### Skeleton Pattern

Create a skeleton for every data-driven component. Place it in `components/skeletons/<feature>/`.

Build feature skeletons using base shared skeleton components from `components/skeletons/shared/`.

### Suspense Wrapping (Server Components)

When a component fetches data server-side, the parent wraps it in `<Suspense>` with a skeleton fallback. The fetching component must be `async`.

## Authentication — NextAuth v4

### Config (`auth.ts`)

NextAuth config lives at `auth.ts` in the project root (next to `middleware.ts`).

### Type Augmentation

Augment `Session` and `JWT` types in `lib/types/next-auth.d.ts`.

### Getting Session

- **Server Components / Route Handlers**: Use `auth()` from `@/auth`
- **Client Components**: Use `useSession()` from `next-auth/react`

### Middleware — Auth + i18n Combined

Protect routes in `middleware.ts` — not inside pages.

## Error Handling, Toasts & Performance

### Sonner Toast Patterns

Import `toast` from `sonner`. Use it inside mutation `onSuccess`/`onError` callbacks or event handlers — never inside render.

```typescript
import { toast } from "sonner";

toast.success("Product created successfully");
toast.error("Failed to delete product");
```

### API Error Handling

Always handle errors in mutation hooks — not in components.

### Providers Setup

Group all global providers in `providers/app/index.tsx`. Never scatter provider wrappers across different layout files.

### Performance — Dynamic Imports

Use `next/dynamic` to lazy-load heavy components that are not needed on initial render.

## Rules Summary

### TypeScript
- ✅ Never use `any` — use `unknown` and narrow it
- ✅ Always derive types from Zod schemas with `z.infer<typeof schema>`
- ✅ Type all function return values explicitly

### Components
- ✅ Default to Server Components — add `"use client"` only when needed
- ✅ Extract interactive parts to child `_components/` files
- ✅ Handle loading, error, and empty states for all data-driven components
- ✅ Create skeletons for every data-driven component
- ✅ Accept and forward `className` prop in reusable components
- ❌ Never use `React.FC` type — use regular function declarations
- ❌ Never edit files inside `components/ui/`

### Data Fetching
- ✅ Server-side fetching with `<Suspense>` is default
- ✅ Client-side fetching only for interactive/real-time data
- ✅ Use native `fetch()` — never Axios
- ✅ Wrap `<Suspense>` around `async` components
- ❌ Never fetch in `useEffect`

### Mutations
- ✅ Server Actions for all mutations
- ✅ Custom hook wraps every mutation/query
- ✅ Always handle `onError` in mutation hooks
- ✅ Flow: Server Action → Custom Hook → Form/Client Component

### Forms
- ✅ All schemas go in `lib/schemes/<feature>.schema.ts`
- ✅ Always use shadcn `<Form>` + `<FormField>` — never raw HTML forms
- ✅ Always use `zodResolver` — never manual validation
- ❌ Never use `useState` to track form field values

### Styling
- ✅ UI must be pixel-perfect — match Figma exactly
- ✅ Use `cn()` for all conditional/merged classNames
- ✅ Use Tailwind utility scale — no arbitrary static values
- ✅ Use CSS text casing (`uppercase`, `capitalize`)
- ✅ Use shadcn CSS variable tokens for all colors
- ✅ Always use `next/image` — never `<img>`
- ❌ Never use string concatenation for class names
- ❌ Never use hardcoded color values like `text-gray-500`

### Code Quality
- ✅ One component per file
- ✅ Named exports for components, default export for pages/layouts
- ✅ Follow import order: React/Next → Third-party → Internal → Relative
- ✅ Blank lines between sections
- ✅ Use `key={item.id}` — never `key={index}`
- ✅ Centralize query keys in constants
- ❌ No commented-out code
- ❌ No `console.log` in committed code
- ❌ No unused imports

### Authentication
- ✅ Auth config in `auth.ts` at project root
- ✅ Protect routes in `middleware.ts` — not inside pages
- ✅ Use `auth()` in Server Components, `useSession()` in Client Components

### i18n
- ✅ All UI strings through `next-intl`
- ✅ Use `useRouter`/`usePathname` from `@/i18n/navigation` (locale-aware)
- ✅ Use `useSearchParams` from `next/navigation` (NOT locale-specific)
- ❌ No hardcoded display text in components

## ESLint & Prettier

- Flat config via `eslint.config.mjs` — imports `eslint-config-next` directly (no `FlatCompat`).
- Lint script: `eslint src`. Format script: `prettier --check .` / `prettier --write .`.
- Disable a rule only with a scoped `eslint-disable` / `eslint-enable` pair and an explanatory comment.

## Out-of-Scope for Cleanup Tasks

- `src/components/ui/button.tsx` — do not modify (lead decision).
- Branch strategy (default branch, deleting `main`) — deferred until sprint/testing branch is named.
- Library version changes — do not upgrade or downgrade without explicit instruction.
- Do not commit or push unless explicitly instructed.
- Do not save terminal output to files inside the repository.
