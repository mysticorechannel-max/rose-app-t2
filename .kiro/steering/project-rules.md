# Rose App — Project Rules for AI Agents

## Project Stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5.8 · Tailwind CSS v4
- next-intl (en/ar, LTR/RTL) · next-themes (light/dark/system) · shadcn/ui · Prettier · ESLint 9

## Naming

- Boolean state: `isMounted`, `isPending`, `isOpen` — not `mounted`, `pending`, `open`.
- Functions: verb-first — `handleLocaleChange`, `fetchUser`, `buildUrl`.
- One term per concept across the codebase — do not rename shared tokens, i18n keys, or API contracts for stylistic reasons.
- Variables close to their use site; constants independent of a component declared outside it.

## React Component Order

Follow this sequence (include only sections that exist):

1. Translation — `useTranslations`
2. Navigation — `useLocale`, `usePathname`, `useRouter`
3. State — `useState`
4. Ref — `useRef`
5. Context — `useContext`, `useTheme`
6. Query / Mutation
7. Other hooks
8. Variables derived from the above
9. Functions / handlers
10. Effects — `useEffect`
11. Return JSX

Use short organisational comments (`// State`, `// Effects`) only in components longer than ~40 lines.

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

## i18n & Theme

- Locales: `en` (LTR, Sarabun) and `ar` (RTL, Tajawal). Both subsets include `latin`.
- All UI strings go through `next-intl` — no hardcoded display text in components.
- Preserve `isMounted` hydration guard in `ThemeSwitcher`; preserve the scoped `eslint-disable` block.
- Do not change `useEffect` to `useLayoutEffect` to silence lint.

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
