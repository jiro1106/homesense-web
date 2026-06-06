# HomeSense Showcase Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, horizontally-scrolling showcase for HomeSense (a thesis IoT electricity-monitoring app) with 4 full-viewport panels, a wheel→horizontal scroll hijack on desktop, and a vertical stacked fallback on mobile.

**Architecture:** A single horizontal flex track holds 4 panel components. A custom `useHorizontalScroll` hook translates vertical wheel/keyboard input into a clamped horizontal offset on desktop; under the `md` breakpoint the track becomes a normal vertical stack. Pure scroll-math helpers are unit-tested; components get render smoke tests; the build (`tsc -b && vite build`) is the type/compile gate. Styling is Tailwind-first with design tokens in `@theme`; animation is Framer Motion; icons are lucide-react.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Framer Motion, lucide-react, Plus Jakarta Sans, Vitest + React Testing Library.

---

## File Structure

All paths are under `frontend/`.

- `index.html` — add Plus Jakarta Sans `<link>`.
- `src/index.css` — Tailwind import + `@theme` design tokens + minimal base styles (replaces template CSS).
- `src/App.tsx` — renders `<HorizontalShowcase />` (replaces template).
- `src/App.css` — deleted (no longer used).
- `src/lib/scroll.ts` — pure scroll-math helpers (`clampScroll`, `getActivePanel`).
- `src/lib/scroll.test.ts` — unit tests for the helpers.
- `src/hooks/useHorizontalScroll.ts` — wheel/keyboard → horizontal offset hook.
- `src/components/Placeholder.tsx` — named asset placeholder box.
- `src/components/YellowButton.tsx` — primary yellow button.
- `src/components/IconTile.tsx` — pastel-yellow tile wrapping a darker-yellow lucide icon.
- `src/components/ProgressNav.tsx` — yellow progress bar + clickable panel dots.
- `src/components/panels/Hero.tsx` — Panel 1.
- `src/components/panels/ProductBento.tsx` — Panel 2.
- `src/components/panels/HowItWorks.tsx` — Panel 3.
- `src/components/panels/ThesisFooter.tsx` — Panel 4.
- `src/components/HorizontalShowcase.tsx` — track + hook + nav + responsive switch.
- `src/test/setup.ts` — Vitest/RTL setup.
- `src/components/*.test.tsx` — render smoke tests.
- `vite.config.ts` — add Vitest `test` config.

---

## Task 1: Install dependencies and design tokens

**Files:**
- Modify: `frontend/package.json` (via npm)
- Modify: `frontend/index.html`
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Install runtime + test dependencies**

Run from `frontend/`:

```bash
npm install framer-motion lucide-react
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Expected: packages added, `found 0 vulnerabilities`.

- [ ] **Step 2: Add the font link to `index.html`**

In `frontend/index.html`, inside `<head>` (after the existing `<link rel="icon" .../>`), add:

```html
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
```

Also set the document title — replace `<title>Vite + React + TS</title>` with:

```html
    <title>HomeSense — IoT Household Electricity Monitoring</title>
```

- [ ] **Step 3: Replace `src/index.css` with tokens + base styles**

Replace the ENTIRE contents of `frontend/src/index.css` with:

```css
@import "tailwindcss";

@theme {
  --color-paper: #ffffff;
  --color-ink: #000000;
  --color-accent: #ffcc00;
  --color-accent-hover: #f0c000;
  --color-icon-tile: #fff3c4;
  --color-icon-stroke: #e0a800;

  --font-display: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-sans: "Plus Jakarta Sans", system-ui, sans-serif;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  color: var(--color-ink);
  background: var(--color-paper);
}

/* Desktop horizontal showcase hides overflow; mobile restores normal flow. */
@media (min-width: 768px) {
  html,
  body {
    overflow: hidden;
  }
}
```

- [ ] **Step 4: Verify the build still compiles**

Run from `frontend/`:

```bash
npm run build
```

Expected: PASS — `built in ...`, no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/index.html frontend/src/index.css
git commit -m "chore: add framer-motion, lucide, test deps, font, and design tokens"
```

---

## Task 2: Configure Vitest

**Files:**
- Modify: `frontend/vite.config.ts`
- Create: `frontend/src/test/setup.ts`
- Modify: `frontend/package.json` (add test script)

- [ ] **Step 1: Create the test setup file**

Create `frontend/src/test/setup.ts`:

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 2: Add Vitest config to `vite.config.ts`**

Replace the ENTIRE contents of `frontend/vite.config.ts` with:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

- [ ] **Step 3: Add the test script to `package.json`**

In `frontend/package.json`, add a `"test"` entry to `"scripts"`:

```json
    "test": "vitest run",
```

- [ ] **Step 4: Write a trivial test to prove the harness runs**

Create `frontend/src/test/sanity.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("test harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run the test**

Run from `frontend/`:

```bash
npm test
```

Expected: PASS — 1 passed.

- [ ] **Step 6: Commit**

```bash
git add frontend/vite.config.ts frontend/src/test/setup.ts frontend/src/test/sanity.test.ts frontend/package.json
git commit -m "test: configure vitest + react testing library"
```

---

## Task 3: Pure scroll-math helpers (TDD)

**Files:**
- Create: `frontend/src/lib/scroll.ts`
- Test: `frontend/src/lib/scroll.test.ts`

- [ ] **Step 1: Write the failing test**

Create `frontend/src/lib/scroll.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { clampScroll, getActivePanel } from "./scroll";

describe("clampScroll", () => {
  it("returns the value when within range", () => {
    expect(clampScroll(50, 0, 100)).toBe(50);
  });
  it("clamps below min", () => {
    expect(clampScroll(-20, 0, 100)).toBe(0);
  });
  it("clamps above max", () => {
    expect(clampScroll(180, 0, 100)).toBe(100);
  });
});

describe("getActivePanel", () => {
  it("returns 0 at the start", () => {
    expect(getActivePanel(0, 1000, 4)).toBe(0);
  });
  it("returns the nearest panel index by rounding", () => {
    expect(getActivePanel(1200, 1000, 4)).toBe(1);
    expect(getActivePanel(1600, 1000, 4)).toBe(2);
  });
  it("never exceeds the last panel index", () => {
    expect(getActivePanel(99999, 1000, 4)).toBe(3);
  });
  it("never goes below 0", () => {
    expect(getActivePanel(-500, 1000, 4)).toBe(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- scroll`
Expected: FAIL — cannot find module `./scroll` / `clampScroll is not a function`.

- [ ] **Step 3: Write the minimal implementation**

Create `frontend/src/lib/scroll.ts`:

```ts
/** Clamp a scroll offset between min and max (inclusive). */
export function clampScroll(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Given a horizontal scroll offset and per-panel width, return the index of
 * the panel nearest to the current position, clamped to [0, count - 1].
 */
export function getActivePanel(
  scrollX: number,
  panelWidth: number,
  count: number
): number {
  if (panelWidth <= 0) return 0;
  const raw = Math.round(scrollX / panelWidth);
  return clampScroll(raw, 0, count - 1);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- scroll`
Expected: PASS — all assertions green.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/scroll.ts frontend/src/lib/scroll.test.ts
git commit -m "feat: add pure scroll-math helpers with tests"
```

---

## Task 4: Shared primitives — Placeholder, YellowButton, IconTile

**Files:**
- Create: `frontend/src/components/Placeholder.tsx`
- Create: `frontend/src/components/YellowButton.tsx`
- Create: `frontend/src/components/IconTile.tsx`
- Test: `frontend/src/components/primitives.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/primitives.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Zap } from "lucide-react";
import { Placeholder } from "./Placeholder";
import { YellowButton } from "./YellowButton";
import { IconTile } from "./IconTile";

describe("Placeholder", () => {
  it("shows the asset name hint", () => {
    render(<Placeholder name="phone-mockup.png" />);
    expect(screen.getByText("phone-mockup.png")).toBeInTheDocument();
  });
});

describe("YellowButton", () => {
  it("renders its label", () => {
    render(<YellowButton>Download APK</YellowButton>);
    expect(
      screen.getByRole("button", { name: "Download APK" })
    ).toBeInTheDocument();
  });
});

describe("IconTile", () => {
  it("renders an accessible label", () => {
    render(<IconTile icon={Zap} label="Real-time" />);
    expect(screen.getByLabelText("Real-time")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- primitives`
Expected: FAIL — cannot find the component modules.

- [ ] **Step 3: Implement `Placeholder.tsx`**

Create `frontend/src/components/Placeholder.tsx`:

```tsx
type PlaceholderProps = {
  /** Asset filename hint shown in the box, e.g. "app-dashboard.png". */
  name: string;
  className?: string;
};

/**
 * A labeled stand-in for an image the user will supply later. Dashed border,
 * light fill, filename hint centered. Swap by dropping in the named asset.
 */
export function Placeholder({ name, className = "" }: PlaceholderProps) {
  return (
    <div
      className={
        "flex items-center justify-center rounded-2xl border border-dashed border-ink/30 bg-ink/5 text-ink/40 " +
        className
      }
    >
      <span className="px-3 text-center font-mono text-xs sm:text-sm">
        {name}
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Implement `YellowButton.tsx`**

Create `frontend/src/components/YellowButton.tsx`:

```tsx
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type YellowButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
};

/**
 * Primary call-to-action. Yellow fill, black text. Renders an anchor when
 * `href` is provided, otherwise a button. Subtle press/hover via Framer Motion.
 */
export function YellowButton({
  children,
  href,
  onClick,
  className = "",
}: YellowButtonProps) {
  const classes =
    "inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink " +
    className;

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={classes}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
```

- [ ] **Step 5: Implement `IconTile.tsx`**

Create `frontend/src/components/IconTile.tsx`:

```tsx
import type { LucideIcon } from "lucide-react";

type IconTileProps = {
  icon: LucideIcon;
  /** Accessible label describing the icon's meaning. */
  label: string;
  className?: string;
};

/**
 * A pastel-yellow rounded tile holding a darker-yellow lucide icon. The tile is
 * labeled for assistive tech; the icon itself is decorative.
 */
export function IconTile({ icon: Icon, label, className = "" }: IconTileProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={
        "flex h-14 w-14 items-center justify-center rounded-2xl bg-icon-tile " +
        className
      }
    >
      <Icon className="h-7 w-7 text-icon-stroke" strokeWidth={2.25} aria-hidden />
    </div>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- primitives`
Expected: PASS — all three components render.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/Placeholder.tsx frontend/src/components/YellowButton.tsx frontend/src/components/IconTile.tsx frontend/src/components/primitives.test.tsx
git commit -m "feat: add Placeholder, YellowButton, IconTile primitives"
```

---

## Task 5: The `useHorizontalScroll` hook

**Files:**
- Create: `frontend/src/hooks/useHorizontalScroll.ts`

This hook has DOM/event behavior that is awkward to unit-test in jsdom (no layout). Its pure math already lives in `scroll.ts` (tested in Task 3). Verification here is the type/compile gate plus integration in Task 10.

- [ ] **Step 1: Implement the hook**

Create `frontend/src/hooks/useHorizontalScroll.ts`:

```ts
import { useEffect, useRef, useState } from "react";
import { clampScroll, getActivePanel } from "../lib/scroll";

type UseHorizontalScroll = {
  /** Ref to attach to the moving track element. */
  trackRef: React.RefObject<HTMLDivElement | null>;
  /** Current panel index (0-based). */
  active: number;
  /** Scroll progress 0..1 across the whole track. */
  progress: number;
  /** Programmatically move to a panel (used by dot-nav / keyboard). */
  goTo: (index: number) => void;
};

/**
 * Translates vertical wheel/trackpad and keyboard input into a clamped
 * horizontal offset on a track of `count` full-viewport panels. Active only at
 * >= 768px; below that it no-ops so the track can stack vertically via CSS.
 */
export function useHorizontalScroll(count: number): UseHorizontalScroll {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

    const panelWidth = () => window.innerWidth;
    const maxOffset = () => panelWidth() * (count - 1);

    const apply = () => {
      const track = trackRef.current;
      if (!track) return;
      const max = maxOffset();
      track.style.transform = `translateX(-${offsetRef.current}px)`;
      setActive(getActivePanel(offsetRef.current, panelWidth(), count));
      setProgress(max > 0 ? offsetRef.current / max : 0);
    };

    const goTo = (index: number) => {
      offsetRef.current = clampScroll(index, 0, count - 1) * panelWidth();
      apply();
    };

    const onWheel = (e: WheelEvent) => {
      if (!isDesktop()) return;
      // Use whichever axis has the larger delta (trackpads send both).
      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      e.preventDefault();
      offsetRef.current = clampScroll(
        offsetRef.current + delta,
        0,
        maxOffset()
      );
      apply();
    };

    const onKey = (e: KeyboardEvent) => {
      if (!isDesktop()) return;
      const current = getActivePanel(offsetRef.current, panelWidth(), count);
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goTo(current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goTo(current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(count - 1);
      }
    };

    const onResize = () => {
      // Re-snap to the active panel so resizing keeps alignment.
      const idx = getActivePanel(offsetRef.current, panelWidth(), count);
      goTo(idx);
    };

    // Expose goTo to the component via a custom property on the ref element.
    // (Read again in the returned closure below.)
    goToRef.current = goTo;

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  const goToRef = useRef<(index: number) => void>(() => {});

  return {
    trackRef,
    active,
    progress,
    goTo: (index: number) => goToRef.current(index),
  };
}
```

- [ ] **Step 2: Verify it compiles**

Run from `frontend/`: `npm run build`
Expected: PASS — no TypeScript errors. (If `goToRef` ordering triggers a "used before declaration" error, move the `const goToRef = useRef...` line ABOVE the `useEffect` and re-run.)

> **Note for implementer:** `goToRef` MUST be declared before the `useEffect` that assigns `goToRef.current`. If you hit a TS/ESLint error, reorder so `const goToRef = useRef<(index: number) => void>(() => {});` sits directly under the `progress` state declaration, before `useEffect`.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/hooks/useHorizontalScroll.ts
git commit -m "feat: add useHorizontalScroll wheel/keyboard hook"
```

---

## Task 6: ProgressNav (bar + dots)

**Files:**
- Create: `frontend/src/components/ProgressNav.tsx`
- Test: `frontend/src/components/ProgressNav.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/ProgressNav.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProgressNav } from "./ProgressNav";

describe("ProgressNav", () => {
  it("renders one dot per panel", () => {
    render(
      <ProgressNav count={4} active={0} progress={0} onJump={() => {}} />
    );
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("calls onJump with the dot index when clicked", async () => {
    const onJump = vi.fn();
    render(
      <ProgressNav count={4} active={0} progress={0} onJump={onJump} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Go to panel 3" }));
    expect(onJump).toHaveBeenCalledWith(2);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- ProgressNav`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `ProgressNav.tsx`**

Create `frontend/src/components/ProgressNav.tsx`:

```tsx
import { motion } from "framer-motion";

type ProgressNavProps = {
  count: number;
  active: number;
  /** 0..1 overall scroll progress. */
  progress: number;
  onJump: (index: number) => void;
};

/**
 * Fixed top progress bar (yellow fill) plus a row of clickable panel dots.
 * Hidden on mobile where the page scrolls vertically.
 */
export function ProgressNav({ count, active, progress, onJump }: ProgressNavProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden md:block">
      <div className="h-1 w-full bg-ink/10">
        <motion.div
          className="h-full bg-accent"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <div className="pointer-events-auto mt-4 flex justify-center gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to panel ${i + 1}`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => onJump(i)}
            className={
              "h-2.5 rounded-full transition-all " +
              (i === active ? "w-8 bg-accent" : "w-2.5 bg-ink/25 hover:bg-ink/50")
            }
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- ProgressNav`
Expected: PASS — 2 passing.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ProgressNav.tsx frontend/src/components/ProgressNav.test.tsx
git commit -m "feat: add ProgressNav bar + dots"
```

---

## Task 7: Panel shell + Hero (Panel 1)

**Files:**
- Create: `frontend/src/components/panels/Panel.tsx`
- Create: `frontend/src/components/panels/Hero.tsx`
- Test: `frontend/src/components/panels/Hero.test.tsx`

- [ ] **Step 1: Create the shared `Panel` shell**

Create `frontend/src/components/panels/Panel.tsx`:

```tsx
import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
};

/**
 * One full-viewport panel. On desktop it is exactly one screen wide and sits in
 * the horizontal track; on mobile it becomes a normal full-height stacked
 * section (the parent flex-row switches to flex-col below md).
 */
export function Panel({ children, className = "" }: PanelProps) {
  return (
    <section
      className={
        "flex min-h-svh w-full shrink-0 flex-col justify-center px-6 py-20 md:h-svh md:w-screen md:px-16 lg:px-24 " +
        className
      }
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
```

- [ ] **Step 2: Write the failing Hero test**

Create `frontend/src/components/panels/Hero.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the big tagline and the primary CTA", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { name: /monitor every watt/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /download apk/i })
    ).toBeInTheDocument();
  });

  it("renders the phone mockup placeholder", () => {
    render(<Hero />);
    expect(screen.getByText("phone-hero.png")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- Hero`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement `Hero.tsx`**

Create `frontend/src/components/panels/Hero.tsx`:

```tsx
import { motion } from "framer-motion";
import { Panel } from "./Panel";
import { YellowButton } from "../YellowButton";
import { Placeholder } from "../Placeholder";

/**
 * Panel 1. Big tagline on the left, phone mockup on the right (stacked on
 * mobile). No eyebrow text above the headline.
 */
export function Hero() {
  return (
    <Panel>
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Monitor every watt at home.
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink/60">
            HomeSense is an IoT system that tracks your household electricity
            use in real time — straight from your phone.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <YellowButton href="#download">Download APK</YellowButton>
            <span className="text-sm text-ink/50">scroll to explore →</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="flex justify-center"
        >
          <Placeholder
            name="phone-hero.png"
            className="aspect-[9/19] w-56 sm:w-64 lg:w-72"
          />
        </motion.div>
      </div>
    </Panel>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- Hero`
Expected: PASS — 2 passing.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/panels/Panel.tsx frontend/src/components/panels/Hero.tsx frontend/src/components/panels/Hero.test.tsx
git commit -m "feat: add Panel shell and Hero panel"
```

---

## Task 8: ProductBento (Panel 2)

**Files:**
- Create: `frontend/src/components/panels/ProductBento.tsx`
- Test: `frontend/src/components/panels/ProductBento.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/panels/ProductBento.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductBento } from "./ProductBento";

describe("ProductBento", () => {
  it("renders the section heading", () => {
    render(<ProductBento />);
    expect(
      screen.getByRole("heading", { name: /the app/i })
    ).toBeInTheDocument();
  });

  it("renders the primary app screenshot placeholder", () => {
    render(<ProductBento />);
    expect(screen.getByText("app-dashboard.png")).toBeInTheDocument();
  });

  it("renders feature labels", () => {
    render(<ProductBento />);
    expect(screen.getByText(/real-time feed/i)).toBeInTheDocument();
    expect(screen.getByText(/cost estimate/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- ProductBento`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `ProductBento.tsx`**

Create `frontend/src/components/panels/ProductBento.tsx`:

```tsx
import { motion } from "framer-motion";
import { Activity, History, Wallet, BellRing } from "lucide-react";
import { Panel } from "./Panel";
import { Placeholder } from "../Placeholder";
import { IconTile } from "../IconTile";

const cellBase =
  "rounded-2xl border border-ink/10 bg-paper p-5 flex flex-col justify-between";

const features = [
  { icon: Activity, label: "Real-time feed", copy: "Live wattage as it happens." },
  { icon: History, label: "Usage history", copy: "Trends by day, week, month." },
  { icon: Wallet, label: "Cost estimate", copy: "See pesos, not just kWh." },
  { icon: BellRing, label: "Alerts", copy: "Spikes flagged instantly." },
];

/**
 * Panel 2. Tarsi-style bento grid: one large app screenshot plus four feature
 * cells. Hairline borders, ~16px radius, white fills, flat.
 */
export function ProductBento() {
  return (
    <Panel>
      <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        The app
      </h2>
      <p className="mt-3 max-w-md text-ink/60">
        Everything your household's energy is doing, in one place.
      </p>

      <div className="mt-10 grid auto-rows-[minmax(120px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Large screenshot spans 2 cols / 2 rows on wide screens. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="sm:col-span-2 lg:row-span-2"
        >
          <Placeholder name="app-dashboard.png" className="h-full min-h-64 w-full" />
        </motion.div>

        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 * (i + 1) }}
            className={cellBase}
          >
            <IconTile icon={f.icon} label={f.label} />
            <div className="mt-4">
              <h3 className="font-display text-lg font-semibold">{f.label}</h3>
              <p className="mt-1 text-sm text-ink/55">{f.copy}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- ProductBento`
Expected: PASS — 3 passing.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/panels/ProductBento.tsx frontend/src/components/panels/ProductBento.test.tsx
git commit -m "feat: add ProductBento panel"
```

---

## Task 9: HowItWorks (Panel 3)

**Files:**
- Create: `frontend/src/components/panels/HowItWorks.tsx`
- Test: `frontend/src/components/panels/HowItWorks.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/panels/HowItWorks.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HowItWorks } from "./HowItWorks";

describe("HowItWorks", () => {
  it("renders the section heading", () => {
    render(<HowItWorks />);
    expect(
      screen.getByRole("heading", { name: /how it works/i })
    ).toBeInTheDocument();
  });

  it("renders all four pipeline steps", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Sensor")).toBeInTheDocument();
    expect(screen.getByText("Gateway")).toBeInTheDocument();
    expect(screen.getByText("Cloud")).toBeInTheDocument();
    expect(screen.getByText("App")).toBeInTheDocument();
  });

  it("renders tech-stack badges", () => {
    render(<HowItWorks />);
    expect(screen.getByText("[ESP32]")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- HowItWorks`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `HowItWorks.tsx`**

Create `frontend/src/components/panels/HowItWorks.tsx`:

```tsx
import { motion } from "framer-motion";
import { Cpu, Router, Cloud, Smartphone } from "lucide-react";
import { Panel } from "./Panel";
import { IconTile } from "../IconTile";

const steps = [
  { icon: Cpu, label: "Sensor", copy: "Clamp meter reads current draw." },
  { icon: Router, label: "Gateway", copy: "Microcontroller relays the data." },
  { icon: Cloud, label: "Cloud", copy: "Readings stored and processed." },
  { icon: Smartphone, label: "App", copy: "You see it live on your phone." },
];

// Placeholder stack — replace bracketed names with the real tools.
const stack = ["[ESP32]", "[MQTT]", "[Firebase]", "[Flutter]", "[Node.js]"];

/**
 * Panel 3. Four-step IoT pipeline (Sensor → Gateway → Cloud → App) plus
 * tech-stack badges. This is the engineering-credibility panel.
 */
export function HowItWorks() {
  return (
    <Panel>
      <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        How it works
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 * i }}
            className="rounded-2xl border border-ink/10 p-6"
          >
            <div className="flex items-center gap-3">
              <span className="font-display text-sm font-bold text-ink/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <IconTile icon={s.icon} label={s.label} />
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">{s.label}</h3>
            <p className="mt-1 text-sm text-ink/55">{s.copy}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-ink/40">
          Built with
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-ink/15 px-4 py-2 font-mono text-sm text-ink/70"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Panel>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- HowItWorks`
Expected: PASS — 3 passing.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/panels/HowItWorks.tsx frontend/src/components/panels/HowItWorks.test.tsx
git commit -m "feat: add HowItWorks panel"
```

---

## Task 10: ThesisFooter (Panel 4)

**Files:**
- Create: `frontend/src/components/panels/ThesisFooter.tsx`
- Test: `frontend/src/components/panels/ThesisFooter.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/panels/ThesisFooter.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThesisFooter } from "./ThesisFooter";

describe("ThesisFooter", () => {
  it("renders the primary credit heading", () => {
    render(<ThesisFooter />);
    expect(
      screen.getByRole("heading", { name: /a thesis project/i })
    ).toBeInTheDocument();
  });

  it("renders the download CTA", () => {
    render(<ThesisFooter />);
    expect(
      screen.getByRole("link", { name: /download apk/i })
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- ThesisFooter`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `ThesisFooter.tsx`**

Create `frontend/src/components/panels/ThesisFooter.tsx`:

```tsx
import { motion } from "framer-motion";
import { Panel } from "./Panel";
import { YellowButton } from "../YellowButton";

/**
 * Panel 4. Thesis credit close with clear text hierarchy: primary line, then
 * institution/year, then authors, then actions. Minimal and formal.
 */
export function ThesisFooter() {
  return (
    <Panel className="md:justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl"
      >
        {/* Primary */}
        <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          A thesis project
        </h2>
        {/* Secondary */}
        <p className="mt-4 text-xl text-ink/70">
          HomeSense — [University Name], [Year]
        </p>
        {/* Tertiary */}
        <p className="mt-2 text-base text-ink/50">
          By [Author One], [Author Two], [Author Three]
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <YellowButton href="#download">Download APK</YellowButton>
          <a
            href="#contact"
            className="text-sm font-medium text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Contact the team
          </a>
        </div>

        <p className="mt-12 text-xs text-ink/40">
          © [Year] HomeSense. Built as an undergraduate thesis.
        </p>
      </motion.div>
    </Panel>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- ThesisFooter`
Expected: PASS — 2 passing.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/panels/ThesisFooter.tsx frontend/src/components/panels/ThesisFooter.test.tsx
git commit -m "feat: add ThesisFooter panel"
```

---

## Task 11: Assemble HorizontalShowcase + wire into App

**Files:**
- Create: `frontend/src/components/HorizontalShowcase.tsx`
- Test: `frontend/src/components/HorizontalShowcase.test.tsx`
- Modify: `frontend/src/App.tsx`
- Delete: `frontend/src/App.css`

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/HorizontalShowcase.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HorizontalShowcase } from "./HorizontalShowcase";

describe("HorizontalShowcase", () => {
  it("renders all four panel headings", () => {
    render(<HorizontalShowcase />);
    expect(
      screen.getByRole("heading", { name: /monitor every watt/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /the app/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /how it works/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /a thesis project/i })
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- HorizontalShowcase`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `HorizontalShowcase.tsx`**

Create `frontend/src/components/HorizontalShowcase.tsx`:

```tsx
import { useHorizontalScroll } from "../hooks/useHorizontalScroll";
import { ProgressNav } from "./ProgressNav";
import { Hero } from "./panels/Hero";
import { ProductBento } from "./panels/ProductBento";
import { HowItWorks } from "./panels/HowItWorks";
import { ThesisFooter } from "./panels/ThesisFooter";

const PANEL_COUNT = 4;

/**
 * Top-level showcase. On desktop (>= md) the panels sit in a horizontal track
 * moved by the wheel/keyboard hook; below md the same track stacks vertically
 * (flex-col) and the hook no-ops, giving normal vertical scroll.
 */
export function HorizontalShowcase() {
  const { trackRef, active, progress, goTo } = useHorizontalScroll(PANEL_COUNT);

  return (
    <main className="relative md:h-svh md:overflow-hidden">
      <ProgressNav
        count={PANEL_COUNT}
        active={active}
        progress={progress}
        onJump={goTo}
      />
      <div
        ref={trackRef}
        className="flex flex-col will-change-transform md:h-svh md:flex-row md:flex-nowrap"
      >
        <Hero />
        <ProductBento />
        <HowItWorks />
        <ThesisFooter />
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Replace `App.tsx`**

Replace the ENTIRE contents of `frontend/src/App.tsx` with:

```tsx
import { HorizontalShowcase } from "./components/HorizontalShowcase";

function App() {
  return <HorizontalShowcase />;
}

export default App;
```

- [ ] **Step 5: Delete the unused template stylesheet**

```bash
git rm frontend/src/App.css
```

(If `App.css` was already untracked/removed, run `rm -f frontend/src/App.css` instead.)

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- HorizontalShowcase`
Expected: PASS — all four headings found.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/HorizontalShowcase.tsx frontend/src/components/HorizontalShowcase.test.tsx frontend/src/App.tsx
git commit -m "feat: assemble HorizontalShowcase and wire into App"
```

---

## Task 12: Reduced-motion, full build, lint, manual verification

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Add a `prefers-reduced-motion` safeguard**

Append to the end of `frontend/src/index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Run the full test suite**

Run from `frontend/`: `npm test`
Expected: PASS — all suites green (scroll, primitives, ProgressNav, Hero, ProductBento, HowItWorks, ThesisFooter, HorizontalShowcase, sanity).

- [ ] **Step 3: Run the production build**

Run from `frontend/`: `npm run build`
Expected: PASS — `built in ...`, no TS errors.

- [ ] **Step 4: Run lint**

Run from `frontend/`: `npm run lint`
Expected: PASS (or only pre-existing template warnings). Fix any errors introduced by new files.

- [ ] **Step 5: Manual visual check (human/agent with a browser)**

Run from `frontend/`: `npm run dev`, open the local URL.
Verify:
- Desktop: vertical wheel/trackpad moves the page LEFT→RIGHT through 4 panels; progress bar fills; dots highlight + click-to-jump works; arrow keys navigate.
- Resize below 768px: layout stacks and scrolls vertically; nav dots hidden; all content readable.
- Yellow appears only on buttons, icon tiles (pastel), icon strokes (darker), and the progress bar.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/index.css
git commit -m "feat: add reduced-motion safeguard and finalize showcase"
```

---

## Self-Review Notes

- **Spec coverage:** Hero w/ big tagline + phone mockup (Task 7) ✓; bento product panel (Task 8) ✓; how-it-works + tech stack (Task 9) ✓; thesis footer w/ hierarchy (Task 10) ✓; wheel→horizontal hijack + keyboard/a11y (Task 5) ✓; mobile vertical fallback (Panel shell Task 7 + showcase Task 11 + CSS Task 1) ✓; white/black/`#ffcc00` tokens + pastel/darker yellow icon tokens (Task 1) ✓; lucide icons (Tasks 4/8/9) ✓; Plus Jakarta Sans (Task 1) ✓; no eyebrows (Hero/footer copy has none) ✓; Framer Motion (Tasks 4,7–11) ✓; Tailwind-first (all components) ✓; named placeholders (Task 4 + usage) ✓; reduced-motion (Task 12) ✓.
- **Placeholder scan:** Bracketed `[University Name]`, `[ESP32]`, etc. are intentional content placeholders per the spec's "user will provide later", clearly marked — not plan TODOs.
- **Type consistency:** `useHorizontalScroll` returns `{ trackRef, active, progress, goTo }`, consumed verbatim by `HorizontalShowcase`; `ProgressNav` props `{ count, active, progress, onJump }` match the call site; `IconTile`/`Placeholder`/`YellowButton` signatures match every usage.
