# Bugfix Requirements Document

## Introduction

The Rose App (Next.js 14+ / TypeScript / Tailwind CSS v4 / shadcn-ui / next-intl) has accumulated
several code-quality issues across repository hygiene, font configuration, CSS architecture,
linting infrastructure, the shadcn Button component, and branch strategy. Each issue degrades
developer experience, visual fidelity, or CI reliability. This document captures the current
defective behaviors, the expected correct behaviors, and the existing behaviors that must be
preserved after all fixes are applied.

---

## Bug Analysis

### Current Behavior (Defect)

**#1 — Git log/terminal-output files**

1.1 WHEN the repository is inspected THEN the working tree contains `delete-git.txt` and
`rm-cached.txt` at the project root — plain terminal-output files that were never meant to be
committed.

1.2 WHEN a `git status` is run THEN 17 additional terminal-output `.txt` files (e.g.
`all-log.txt`, `git-log-final.txt`, `main-log.txt`, etc.) are shown as staged deletions, meaning
they were previously committed to `origin/chore/project-setup` and are now pending removal, but
their deletion has not been committed yet.

1.3 WHEN a new contributor clones the repository THEN the `.gitignore` pattern `*.txt` only
prevents future `.txt` files from being tracked — it does not remove already-committed ones, so
the history still carries the leaked local-path data.

**#2 — Code spacing**

2.1 WHEN any source file in `src/` is opened THEN there are no blank lines after the import
block and no blank lines between top-level declarations, making the code harder to read and
inconsistent with project style.

**#3 — Duplicate CSS utility classes**

3.1 WHEN `src/app/globals.css` is inspected THEN `.font-english` and `.font-arabic` classes are
defined manually in `@layer base`, while Tailwind v4's `@theme inline` block already exposes
`--font-english` and `--font-arabic` as CSS custom properties, meaning the utility classes
`font-english` / `font-arabic` are generated automatically by Tailwind — the manual definitions
are redundant and could produce specificity conflicts.

**#4 — Tajawal font missing Latin subset**

4.1 WHEN Tajawal is loaded via `next/font/google` in `src/app/[locale]/layout.tsx` THEN only the
`"arabic"` subset is requested, so Latin characters (a–z, A–Z) and digits (0–9) fall back to the
browser default font instead of being rendered in Tajawal.

**#5 — Branch strategy**

5.1 WHEN a contributor opens a pull request on GitHub THEN `main` is the default base branch,
despite the documented workflow using `chore/project-setup` (Sprint 1 working branch) as the
integration target, making it easy to accidentally merge work into `main` ahead of schedule.

5.2 WHEN the remote is inspected THEN `origin/main` contains only an empty initial commit
(`b43de2a`) while `origin/chore/project-setup` contains all real work, yet `main` is still the
GitHub default branch.

**#6 — Design system colors**

6.1 WHEN the app renders THEN it uses legacy or placeholder color values rather than the
correct primitives from the Figma Design System - NEW, so the visual output does not match the
approved design tokens.

6.2 WHEN `globals.css` is inspected THEN several primitive palette values contain copy-paste
errors (e.g. `--blue-700` is set to `#cc3a5b`, which is a soft-pink value, not a blue; `--blue-800`
and `--blue-900` are both set to `#1c398e`).

6.3 WHEN the semantic token layer is inspected THEN `-faint` / `-fade` variant naming is
inconsistent — some tokens use `-tint` where the Figma spec calls for `-faint`, requiring a
rename to align with the design system vocabulary.

**#7 — ESLint not set up**

7.1 WHEN `npm run lint` is executed THEN the command does not exist in `package.json`, so
linting cannot be run in CI or locally.

7.2 WHEN the repository is inspected THEN neither `eslint`, `eslint-config-next`, nor an ESLint
flat config file (`eslint.config.mjs`) are present, leaving the codebase without any static
analysis.

**#8 — shadcn Button not using official template**

8.1 WHEN `src/components/ui/button.tsx` is inspected THEN it is a hand-written simplification
rather than the output of `npx shadcn@latest add button`, so it is missing standard shadcn
variants (`secondary`, `destructive`, `link`, `outline` with proper tokens) and the `size` variant
axis entirely.

8.2 WHEN the Button is used in `ThemeSwitcher` THEN the `size` prop is unavailable, so callers
must override height and padding via raw `className` strings instead of using a standard `size`
variant.

---

### Expected Behavior (Correct)

**#1 — Git log/terminal-output files**

2.1 WHEN the repository is inspected THEN no `.txt` terminal-output files shall exist at the
project root — `delete-git.txt`, `rm-cached.txt`, and all 17 previously-committed files shall be
absent from both the working tree and future commits.

2.2 WHEN `.gitignore` is checked THEN the `*.txt` pattern (excluding `README.md`) SHALL already
prevent any new `.txt` files from being committed.

**#2 — Code spacing**

2.3 WHEN any source file in `src/` is opened THEN there SHALL be one blank line after the import
block and one blank line between every top-level declaration (function, const, type, export),
consistent across all files.

**#3 — Duplicate CSS utility classes**

2.4 WHEN `globals.css` is reviewed THEN the manually-written `.font-english` and `.font-arabic`
rules SHALL be removed from `@layer base` because Tailwind v4 generates equivalent utilities
automatically from the `@theme inline` font variables.

**#4 — Tajawal font Latin subset**

2.5 WHEN Tajawal is loaded THEN the `subsets` array SHALL include both `"arabic"` and `"latin"`
so that Latin characters and numerals render in Tajawal rather than the browser fallback.

**#5 — Branch strategy**

2.6 WHEN a contributor opens a pull request THEN the default base branch on GitHub SHALL be the
active Sprint 1 branch (or `testing` branch), not `main`, so PRs cannot accidentally target
`main`.

2.7 WHEN the branch strategy is applied THEN `main` SHALL be deleted from the remote to prevent
it from being used as a PR target during Sprint 1; it SHALL be recreated at the appropriate
milestone.

**#6 — Design system colors**

2.8 WHEN `globals.css` is rendered THEN ALL primitive palette values SHALL match the approved
Figma Design System - NEW values exactly, with no copy-paste errors (e.g. `--blue-700` SHALL be
`#1d4ed8`, not `#cc3a5b`).

2.9 WHEN semantic tokens are read THEN light-mode and dark-mode values SHALL correctly reference
the right primitive steps as defined in the Figma semantic token tables.

2.10 WHEN component code uses semantic tokens THEN the token names SHALL follow the final
agreed naming convention (e.g. `-fade` for the lightest tint if that is the Figma convention)
consistently across `bg-*`, `text-*`, and `border-*` namespaces.

**#7 — ESLint setup**

2.11 WHEN `npm run lint` is executed THEN it SHALL run ESLint against all `src/**/*.{ts,tsx}`
files using `eslint-config-next` rules and exit with a zero code when there are no errors.

2.12 WHEN the repository is inspected THEN `eslint` and `eslint-config-next` SHALL be present in
`devDependencies` and an `eslint.config.mjs` flat-config file SHALL be present at the project
root.

**#8 — shadcn Button**

2.13 WHEN `src/components/ui/button.tsx` is inspected THEN it SHALL be the official shadcn
Button generated by `npx shadcn@latest add button --overwrite`, extended with any project-specific
variants (e.g. `secondary`, `destructive`, `link`) and the `size` variant axis.

2.14 WHEN the Button's `size` variant is used THEN callers SHALL be able to pass `size="sm"`,
`size="default"`, `size="lg"`, or `size="icon"` without needing raw className overrides for
height and padding.

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the app is run after the fixes THEN the existing page layout, routing, and
internationalization (next-intl `en` / `ar`) SHALL CONTINUE TO work correctly.

3.2 WHEN a locale is switched THEN the `LocaleSwitcher` component SHALL CONTINUE TO update the
URL locale segment and re-render in the correct direction (`ltr` / `rtl`).

3.3 WHEN the theme is toggled THEN the `ThemeSwitcher` component SHALL CONTINUE TO switch
between `light`, `dark`, and `system` themes via `next-themes`.

3.4 WHEN Arabic locale is active THEN the Tajawal font SHALL CONTINUE TO be applied to the
`<body>` via the `font-arabic` class.

3.5 WHEN English locale is active THEN the Sarabun font SHALL CONTINUE TO be applied to the
`<body>` via the `font-english` class.

3.6 WHEN existing Button usages in `ThemeSwitcher` are reviewed THEN they SHALL CONTINUE TO
render with `variant="default"` and `variant="ghost"`, with no visual regression.

3.7 WHEN the design system semantic tokens are consumed THEN the shadcn compatibility tokens
(`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`,
`--destructive`, `--border`, `--input`, `--ring`, and their foreground counterparts) SHALL
CONTINUE TO be mapped correctly so all shadcn components remain styled consistently.

3.8 WHEN the build is run THEN TypeScript compilation (`tsc --noEmit`) SHALL CONTINUE TO pass
with zero errors.

3.9 WHEN Prettier is run THEN `prettier --check .` SHALL CONTINUE TO pass with no formatting
violations after spacing changes are applied.
