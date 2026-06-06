# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HomeSense is an IoT electricity monitoring product. This repo contains a marketing/landing page (`frontend/`) built as a horizontal scroll showcase.

## Commands

All commands run from `frontend/`:

```bash
npm run dev       # dev server (Vite)
npm run build     # type-check + production build
npm run lint      # ESLint
npm run test      # Vitest (run once, no watch)
```

To run a single test file:
```bash
npx vitest run src/components/HorizontalShowcase.test.tsx
```

## Architecture

The app is a single-page horizontal scroll showcase. The data flow is:

```
App
└── MotionConfig (reducedMotion="user")
    └── HorizontalShowcase
        ├── useHorizontalScroll(4)   ← wheel / keyboard → translateX on track
        ├── ProgressNav              ← progress bar + dot nav (desktop only)
        └── track div (4 × Panel)
            ├── Hero
            ├── ProductBento
            ├── HowItWorks
            └── ThesisFooter
```

**`useHorizontalScroll`** (`src/hooks/useHorizontalScroll.ts`) is the core interaction layer. It intercepts `wheel`, `keydown`, and `resize` events and applies a `translateX` transform to the track ref. On `< 768px` it no-ops completely — the same CSS track becomes a normal vertical stack via `flex-col`.

**`Panel`** (`src/components/panels/Panel.tsx`) is the layout primitive for every section. It is `min-h-svh / w-full` on mobile and `h-svh / w-screen` on desktop.

**Design tokens** are defined in `src/index.css` under `@theme` (Tailwind v4 syntax):
- Colors: `paper` (#fff), `ink` (#000), `accent` (#ffcc00), `icon-tile`, `icon-stroke`
- Font: Plus Jakarta Sans → `font-display` / `font-sans`

**Animations** use Framer Motion `whileInView` with `viewport={{ once: true }}`. The global `MotionConfig reducedMotion="user"` and the CSS `prefers-reduced-motion` block in `index.css` both handle accessibility.

**`Placeholder`** (`src/components/Placeholder.tsx`) is a temporary image slot — replace with real `<img>` assets when available.

## Testing

- Vitest + jsdom + `@testing-library/react`
- `src/test/setup.ts` stubs `IntersectionObserver` (required because jsdom lacks it and Framer Motion's `whileInView` depends on it)
- Pure utility tests live in `src/lib/`; component smoke tests live alongside their source files
