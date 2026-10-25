# Rose App

A team-ready foundation built with Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui
conventions, next-intl, and next-themes.

## Requirements

| Requirement | Version used in verification       |
| ----------- | ---------------------------------- |
| Node.js     | >= 20.9.0 (verified with v24.12.0) |
| npm         | verified with v11.6.2              |

Next.js 16 requires Node.js 20.9 or later. The project was tested with Node v24.12.0
and npm 11.6.2. Use `.nvmrc` to switch to the recommended Node version:

```bash
nvm use
```

## Installation

Install dependencies using a clean lockfile install:

```bash
npm ci
```

If `node_modules` is already present and you want a fresh install:

```bash
npm ci
```

## Running locally

Start the development server:

```bash
npm run dev
```

Open <http://localhost:3000>. Locale routes are `/en` and `/ar`.

To run the production build and start the server:

```bash
npm run build
npm run start
```

## Commands

| Command                | Description                                   |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Start the development server                  |
| `npm run build`        | Create an optimized production build          |
| `npm run start`        | Start the production server (after `build`)   |
| `npm run typecheck`    | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run format`       | Format all files with Prettier                |
| `npm run format:check` | Verify all files match Prettier formatting    |

Run `npm run typecheck` and `npm run format:check` before every commit to keep
the codebase consistent.

## File structure

```
rose-app/
├── .nvmrc                # Recommended Node.js version
├── .prettierrc.json      # Prettier configuration
├── .prettierignore        # Files excluded from Prettier
├── components.json        # shadcn/ui configuration
├── next.config.ts        # Next.js configuration (next-intl plugin)
├── postcss.config.mjs    # PostCSS configuration (Tailwind CSS v4)
├── tsconfig.json         # TypeScript configuration (strict mode)
├── messages/             # Translation files
│   ├── en.json           # English translations
│   └── ar.json           # Arabic translations
└── src/
    ├── app/
    │   ├── globals.css    # Tailwind import, semantic color tokens, font classes
    │   └── [locale]/
    │       ├── layout.tsx  # Root layout: fonts, dir, theme provider, i18n provider
    │       └── page.tsx    # Home page
    ├── components/
    │   ├── ui/            # shadcn/ui components (Button, ...)
    │   ├── providers/     # Context providers (ThemeProvider)
    │   ├── theme-switcher.tsx   # Light / Dark / System toggle
    │   └── locale-switcher.tsx # English / Arabic language switcher
    ├── i18n/
    │   ├── routing.ts    # Locale definitions (en, ar) and default locale
    │   ├── navigation.ts  # Localized navigation helpers (Link, useRouter, ...)
    │   └── request.ts    # Server-side request config for next-intl
    ├── lib/
    │   └── utils.ts       # cn() utility (clsx + tailwind-merge)
    └── proxy.ts           # next-intl middleware (locale routing)
```

## Internationalization (i18n)

The app supports English (`en`) and Arabic (`ar`). Translations live in
`messages/en.json` and `messages/ar.json`.

### Adding a translation key

1. Add the key to both message files:

```json
// messages/en.json
{
  "common": {
    "greeting": "Welcome to Rose App"
  }
}
```

```json
// messages/ar.json
{
  "common": {
    "greeting": "مرحبًا بك في تطبيق روز"
  }
}
```

2. Use it in a server component:

```tsx
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("common");
  return <h1>{t("greeting")}</h1>;
}
```

Or in a client component:

```tsx
import { useTranslations } from "next-intl";

export function Greeting() {
  const t = useTranslations("common");
  return <h1>{t("greeting")}</h1>;
}
```

### Language and direction

English uses LTR layout direction with the Sarabun font. Arabic uses RTL with the
Tajawal font. The layout switches automatically when the locale changes.

To test: open `/en`, switch to Arabic via the locale switcher, and verify that the
layout direction changes to RTL and the font updates to Tajawal.

## Colors and fonts

### Semantic color tokens

All colors are defined as semantic tokens in `src/app/globals.css`. Light mode
tokens are under `:root` and dark mode tokens are under `.dark`.

Use Tailwind utility classes instead of hardcoded color values:

```tsx
// Correct
<div className="bg-primary text-primary-foreground border-border" />

// Avoid
<div className="bg-[#c2410c] text-white border-gray-200" />
```

Available tokens: `background`, `foreground`, `card`, `card-foreground`, `popover`,
`popover-foreground`, `primary`, `primary-foreground`, `secondary`,
`secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`,
`destructive`, `border`, `input`, `ring`.

### Fonts

- **English (en)**: Sarabun — available as `font-english` class and `--font-english` CSS variable.
- **Arabic (ar)**: Tajawal — available as `font-arabic` class and `--font-arabic` CSS variable.

The layout automatically applies the correct font based on the active locale.

## Theme modes

The app supports three theme modes: **Light**, **Dark**, and **System**.

- **Light**: Applies light semantic colors consistently.
- **Dark**: Adapts semantic colors for dark mode while maintaining readability and contrast.
- **System**: Follows the operating system's light/dark preference and updates when it changes.

To test: use the theme switcher on the home page to cycle through Light, Dark, and
System modes. For System mode, change your OS appearance preference and verify that
the app theme follows.

## API documentation

API documentation is available at:
<https://rose-app.elevate-bootcamp.cloud/api-docs/>
