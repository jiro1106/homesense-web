# Section Reveal Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-tuned per-panel entrance animations with subtle, elegant, orchestrated reveals driven by a shared motion module and two small wrapper components.

**Architecture:** A new `lib/motion.ts` holds tuned Framer Motion `Variants` (fade + short rise + light blur-in) and a staggering container variant. Two wrappers in `components/Reveal.tsx` — `RevealGroup` (owns the `whileInView` trigger + stagger) and `Reveal` (a single fade-up child, reduced-motion aware) — are used to refactor all four panels. One module tunes the whole site's feel.

**Tech Stack:** React 19, TypeScript, Framer Motion (already a dependency), Vite, Vitest + Testing Library + jsdom.

---

## File Structure

- `frontend/src/lib/motion.ts` — **create.** Pure motion tokens/variants: `EASE_OUT`, `fadeUp`, `fadeUpReduced`, `revealGroup`. Single source of motion truth.
- `frontend/src/lib/motion.test.ts` — **create.** Pure-data assertions on the variants.
- `frontend/src/components/Reveal.tsx` — **create.** `RevealGroup` + `Reveal` wrappers.
- `frontend/src/components/Reveal.test.tsx` — **create.** Smoke test: renders children, forwards className.
- `frontend/src/test/setup.ts` — **modify.** Add a `matchMedia` stub (jsdom lacks it; `useReducedMotion` needs it).
- `frontend/src/components/panels/Hero.tsx` — **modify.** Use `RevealGroup`/`Reveal`.
- `frontend/src/components/panels/ProductBento.tsx` — **modify.** Use `RevealGroup`/`Reveal`.
- `frontend/src/components/panels/HowItWorks.tsx` — **modify.** Use `RevealGroup`/`Reveal`.
- `frontend/src/components/panels/ThesisFooter.tsx` — **modify.** Use `RevealGroup`/`Reveal`.

**Unchanged:** scroll hook, `Panel`, `App`, `HorizontalShowcase`, `ProgressNav`, existing panel test files (they assert on content, which is preserved).

> **Commands** run from the `frontend/` directory.

---

## Task 1: Motion tokens module

**Files:**
- Create: `frontend/src/lib/motion.ts`
- Test: `frontend/src/lib/motion.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/lib/motion.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { EASE_OUT, fadeUp, fadeUpReduced, revealGroup } from "./motion";

describe("EASE_OUT", () => {
  it("is the shared 4-point cubic-bezier curve", () => {
    expect(EASE_OUT).toEqual([0.22, 1, 0.36, 1]);
  });
});

describe("fadeUp", () => {
  it("starts transparent, lowered, and blurred", () => {
    expect(fadeUp.hidden).toMatchObject({
      opacity: 0,
      y: 18,
      filter: "blur(6px)",
    });
  });

  it("ends opaque, in place, and unblurred", () => {
    const show = fadeUp.show as {
      opacity: number;
      y: number;
      filter: string;
      transition: { duration: number; ease: number[] };
    };
    expect(show.opacity).toBe(1);
    expect(show.y).toBe(0);
    expect(show.filter).toBe("blur(0px)");
    expect(show.transition.duration).toBe(0.6);
    expect(show.transition.ease).toEqual(EASE_OUT);
  });
});

describe("fadeUpReduced", () => {
  it("animates opacity only (no movement or blur)", () => {
    expect(fadeUpReduced.hidden).toEqual({ opacity: 0 });
    const show = fadeUpReduced.show as {
      opacity: number;
      transition: { duration: number };
    };
    expect(show.opacity).toBe(1);
    expect(show).not.toHaveProperty("y");
    expect(show).not.toHaveProperty("filter");
  });
});

describe("revealGroup", () => {
  it("staggers its children when shown", () => {
    const show = revealGroup.show as {
      transition: { staggerChildren: number; delayChildren: number };
    };
    expect(show.transition.staggerChildren).toBe(0.09);
    expect(show.transition.delayChildren).toBe(0.05);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/motion.test.ts`
Expected: FAIL — cannot resolve `./motion` / exports undefined.

- [ ] **Step 3: Implement the module**

Create `frontend/src/lib/motion.ts`:

```ts
import type { Variants } from "framer-motion";

/** Smooth expo-style deceleration curve shared by every reveal. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** A single element fading and rising into place with a light blur-in. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

/** Reduced-motion fallback: fade only, no movement or blur. */
export const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } },
};

/** Container that cascades its `fadeUp` children when it scrolls into view. */
export const revealGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/motion.test.ts`
Expected: PASS — all assertions green.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/motion.ts frontend/src/lib/motion.test.ts
git commit -m "feat: add shared motion tokens for section reveals"
```

---

## Task 2: Reveal wrapper components + test setup stub

**Files:**
- Modify: `frontend/src/test/setup.ts`
- Create: `frontend/src/components/Reveal.tsx`
- Test: `frontend/src/components/Reveal.test.tsx`

- [ ] **Step 1: Add a `matchMedia` stub to the test setup**

`useReducedMotion()` (used by `Reveal`) calls `window.matchMedia`, which jsdom does not implement. Add this stub to `frontend/src/test/setup.ts`, after the existing `IntersectionObserver` stub block:

```ts
// framer-motion's useReducedMotion calls window.matchMedia, which jsdom does
// not implement. Provide a stub that reports "no preference".
if (typeof window.matchMedia === "undefined") {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
```

- [ ] **Step 2: Write the failing test**

Create `frontend/src/components/Reveal.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal, RevealGroup } from "./Reveal";

describe("Reveal", () => {
  it("renders children and forwards className onto the animated element", () => {
    render(
      <RevealGroup className="group-cls">
        <Reveal className="child-cls">hello reveal</Reveal>
      </RevealGroup>
    );
    const el = screen.getByText("hello reveal");
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("child-cls");
  });

  it("renders a group with multiple children", () => {
    render(
      <RevealGroup>
        <Reveal>one</Reveal>
        <Reveal>two</Reveal>
      </RevealGroup>
    );
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/components/Reveal.test.tsx`
Expected: FAIL — cannot resolve `./Reveal`.

- [ ] **Step 4: Implement the components**

Create `frontend/src/components/Reveal.tsx`:

```tsx
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, fadeUpReduced, revealGroup } from "../lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A single element that fades, rises, and unblurs into place. Inside a
 * <RevealGroup> it inherits the group's staggered timing automatically.
 * Honors prefers-reduced-motion by falling back to a fade-only variant.
 */
export function Reveal({ children, className }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div variants={reduced ? fadeUpReduced : fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Container that reveals its <Reveal> children in a smooth cascade the first
 * time it scrolls into view. Owns the IntersectionObserver trigger.
 */
export function RevealGroup({ children, className }: RevealProps) {
  return (
    <motion.div
      variants={revealGroup}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/Reveal.test.tsx`
Expected: PASS — both cases green.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/test/setup.ts frontend/src/components/Reveal.tsx frontend/src/components/Reveal.test.tsx
git commit -m "feat: add Reveal/RevealGroup components with reduced-motion support"
```

---

## Task 3: Refactor Hero panel

**Files:**
- Modify: `frontend/src/components/panels/Hero.tsx`
- Existing test (must stay green): `frontend/src/components/panels/Hero.test.tsx`

- [ ] **Step 1: Replace the file contents**

Overwrite `frontend/src/components/panels/Hero.tsx` with:

```tsx
import { Panel } from "./Panel";
import { YellowButton } from "../YellowButton";
import { Placeholder } from "../Placeholder";
import { Reveal, RevealGroup } from "../Reveal";

/**
 * Panel 1. Big tagline on the left, phone mockup on the right (stacked on
 * mobile). The two columns reveal as a cascade when the panel comes into view.
 */
export function Hero() {
  return (
    <Panel>
      <RevealGroup className="grid items-center gap-12 md:grid-cols-2 md:gap-8">
        <Reveal>
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
        </Reveal>

        <Reveal className="flex justify-center">
          <Placeholder
            name="phone-hero.png"
            className="aspect-[9/19] w-56 sm:w-64 lg:w-72"
          />
        </Reveal>
      </RevealGroup>
    </Panel>
  );
}
```

- [ ] **Step 2: Run the Hero test to verify it still passes**

Run: `npx vitest run src/components/panels/Hero.test.tsx`
Expected: PASS — tagline, CTA, and `phone-hero.png` placeholder all still render.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/panels/Hero.tsx
git commit -m "refactor: drive Hero reveals with Reveal/RevealGroup"
```

---

## Task 4: Refactor ProductBento panel

**Files:**
- Modify: `frontend/src/components/panels/ProductBento.tsx`
- Existing test (must stay green): `frontend/src/components/panels/ProductBento.test.tsx`

- [ ] **Step 1: Replace the file contents**

Overwrite `frontend/src/components/panels/ProductBento.tsx` with:

```tsx
import { Activity, History, Wallet, BellRing } from "lucide-react";
import { Panel } from "./Panel";
import { Placeholder } from "../Placeholder";
import { IconTile } from "../IconTile";
import { Reveal, RevealGroup } from "../Reveal";

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
 * cells. Heading/intro reveal first, then the grid cells cascade in.
 */
export function ProductBento() {
  return (
    <Panel>
      <RevealGroup>
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            The app
          </h2>
        </Reveal>
        <Reveal className="mt-3 max-w-md">
          <p className="text-ink/60">
            Everything your household's energy is doing, in one place.
          </p>
        </Reveal>
      </RevealGroup>

      <RevealGroup className="mt-10 grid auto-rows-[minmax(120px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Large screenshot spans 2 cols / 2 rows on wide screens. */}
        <Reveal className="sm:col-span-2 lg:row-span-2">
          <Placeholder name="app-dashboard.png" className="h-full min-h-64 w-full" />
        </Reveal>

        {features.map((f) => (
          <Reveal key={f.label} className={cellBase}>
            <IconTile icon={f.icon} label={f.label} />
            <div className="mt-4">
              <h3 className="font-display text-lg font-semibold">{f.label}</h3>
              <p className="mt-1 text-sm text-ink/55">{f.copy}</p>
            </div>
          </Reveal>
        ))}
      </RevealGroup>
    </Panel>
  );
}
```

- [ ] **Step 2: Run the ProductBento test to verify it still passes**

Run: `npx vitest run src/components/panels/ProductBento.test.tsx`
Expected: PASS — heading, `app-dashboard.png` placeholder, and feature labels all render.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/panels/ProductBento.tsx
git commit -m "refactor: drive ProductBento reveals with Reveal/RevealGroup"
```

---

## Task 5: Refactor HowItWorks panel

**Files:**
- Modify: `frontend/src/components/panels/HowItWorks.tsx`
- Existing test (must stay green): `frontend/src/components/panels/HowItWorks.test.tsx`

- [ ] **Step 1: Replace the file contents**

Overwrite `frontend/src/components/panels/HowItWorks.tsx` with:

```tsx
import { Cpu, Router, Cloud, Smartphone } from "lucide-react";
import { Panel } from "./Panel";
import { IconTile } from "../IconTile";
import { Reveal, RevealGroup } from "../Reveal";

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
 * tech-stack badges. Heading, step cards, and badges each reveal in cascade.
 */
export function HowItWorks() {
  return (
    <Panel>
      <RevealGroup>
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            How it works
          </h2>
        </Reveal>
      </RevealGroup>

      <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.label} className="rounded-2xl border border-ink/10 p-6">
            <div className="flex items-center gap-3">
              <span className="font-display text-sm font-bold text-ink/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <IconTile icon={s.icon} label={s.label} />
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">{s.label}</h3>
            <p className="mt-1 text-sm text-ink/55">{s.copy}</p>
          </Reveal>
        ))}
      </RevealGroup>

      <RevealGroup className="mt-12">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink/40">
            Built with
          </p>
        </Reveal>
        <Reveal className="mt-4 flex flex-wrap gap-3">
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-ink/15 px-4 py-2 font-mono text-sm text-ink/70"
            >
              {tech}
            </span>
          ))}
        </Reveal>
      </RevealGroup>
    </Panel>
  );
}
```

- [ ] **Step 2: Run the HowItWorks test to verify it still passes**

Run: `npx vitest run src/components/panels/HowItWorks.test.tsx`
Expected: PASS — heading, four step labels, and `[ESP32]` badge all render.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/panels/HowItWorks.tsx
git commit -m "refactor: drive HowItWorks reveals with Reveal/RevealGroup"
```

---

## Task 6: Refactor ThesisFooter panel + full verification

**Files:**
- Modify: `frontend/src/components/panels/ThesisFooter.tsx`
- Existing test (must stay green): `frontend/src/components/panels/ThesisFooter.test.tsx`

- [ ] **Step 1: Replace the file contents**

Overwrite `frontend/src/components/panels/ThesisFooter.tsx` with:

```tsx
import { Panel } from "./Panel";
import { YellowButton } from "../YellowButton";
import { Reveal, RevealGroup } from "../Reveal";

/**
 * Panel 4. Thesis credit close with clear text hierarchy. The lines reveal in a
 * gentle top-to-bottom cascade.
 */
export function ThesisFooter() {
  return (
    <Panel className="md:justify-center">
      <RevealGroup className="max-w-2xl">
        {/* Primary */}
        <Reveal>
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            A thesis project
          </h2>
        </Reveal>
        {/* Secondary */}
        <Reveal className="mt-4">
          <p className="text-xl text-ink/70">
            HomeSense — [University Name], [Year]
          </p>
        </Reveal>
        {/* Tertiary */}
        <Reveal className="mt-2">
          <p className="text-base text-ink/50">
            By [Author One], [Author Two], [Author Three]
          </p>
        </Reveal>

        {/* Actions */}
        <Reveal className="mt-8 flex flex-wrap items-center gap-4">
          <YellowButton href="#download">Download APK</YellowButton>
          <a
            href="#contact"
            className="text-sm font-medium text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Contact the team
          </a>
        </Reveal>

        <Reveal className="mt-12">
          <p className="text-xs text-ink/40">
            © [Year] HomeSense. Built as an undergraduate thesis.
          </p>
        </Reveal>
      </RevealGroup>
    </Panel>
  );
}
```

- [ ] **Step 2: Run the ThesisFooter test to verify it still passes**

Run: `npx vitest run src/components/panels/ThesisFooter.test.tsx`
Expected: PASS — credit heading and download CTA render.

- [ ] **Step 3: Type-check and lint**

Run: `npm run build`
Expected: PASS — no TypeScript errors (`tsc -b` clean, then vite build succeeds).

Run: `npm run lint`
Expected: PASS — no ESLint errors.

- [ ] **Step 4: Run the full test suite**

Run: `npm run test`
Expected: PASS — all suites green (motion, Reveal, all four panels, showcase, progress nav, primitives, scroll).

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/panels/ThesisFooter.tsx
git commit -m "refactor: drive ThesisFooter reveals with Reveal/RevealGroup"
```

---

## Task 7: Manual browser verification

**Files:** none (manual check).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open the shown local URL at desktop width (>= 768px).

- [ ] **Step 2: Verify per-panel reveals on horizontal scroll**

Scroll through all four panels. Expected: each panel's content fades + rises + unblurs in a smooth staggered cascade as the panel enters view (Hero animates on load). Headings, cards, images, and footer lines all participate.

- [ ] **Step 3: Verify reveals fire once and don't replay**

Scroll past a panel and back. Expected: content stays visible; the reveal does not replay (`once: true`).

- [ ] **Step 4: Verify reduced motion**

Enable OS "reduce motion" (macOS: System Settings → Accessibility → Display → Reduce motion), reload. Expected: content still appears via a plain fade — no rise, no blur — and nothing is left invisible.

- [ ] **Step 5: Verify mobile stack**

Narrow below 768px. Expected: panels stack vertically; reveals trigger on normal vertical scroll as each section enters view.

- [ ] **Step 6: (Optional) tune the feel**

If too fast/slow or stagger too tight/loose, adjust `fadeUp` duration, `EASE_OUT`, or `revealGroup` `staggerChildren`/`delayChildren` in `frontend/src/lib/motion.ts` — one edit retunes the whole site. Vite hot-reloads. Commit if changed.

---

## Self-Review Notes

- **Spec coverage:** `motion.ts` tokens incl. `EASE_OUT`/`fadeUp`/`revealGroup` (Task 1) ✓; `motion.test.ts` (Task 1) ✓; `Reveal`/`RevealGroup` with `whileInView` + `viewport={{ once: true, amount: 0.2 }}` + className forwarding (Task 2) ✓; reduced-motion handled — spec promised "no blur," delivered via `fadeUpReduced` + `useReducedMotion` + matchMedia stub (Task 2) ✓; all four panel refactors dropping manual delays/inline motion (Tasks 3–6) ✓; existing smoke tests preserved (content unchanged, re-run each task) ✓; manual reliability/reduced-motion/mobile verification (Task 7) ✓.
- **Naming consistency:** `EASE_OUT`, `fadeUp`, `fadeUpReduced`, `revealGroup`, `Reveal`, `RevealGroup`, `RevealProps` used consistently across tasks.
- **No placeholders:** every code step shows complete file or block contents.
- **Note vs. spec:** the spec said rely on the global `MotionConfig reducedMotion="user"`; the plan implements explicit `useReducedMotion` because that global only strips transforms, not the `filter: blur` — explicit handling is required to honor the spec's stated "no blur" outcome.
