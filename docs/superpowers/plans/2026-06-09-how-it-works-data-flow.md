# How It Works Wired Data-Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the boxed-card "How it works" steps with accurate content shown as flowing nodes wired together by animated circuit-board traces (horizontal on desktop, vertical on mobile).

**Architecture:** A new decorative `Wire` component renders the SVG connector (a horizontal variant and a vertical variant, toggled by Tailwind breakpoints). `HowItWorks` is rebuilt as a flex `Flow` that maps the four real steps to borderless nodes and interleaves a `<Wire>` between them. The accent "charge" pulse is a CSS `stroke-dashoffset` animation defined in `index.css`, staggered per wire, frozen under `prefers-reduced-motion`.

**Tech Stack:** React 19, TypeScript, Tailwind v4 (`@theme` tokens), Framer Motion (`Reveal`/`RevealGroup`), lucide-react, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-06-09-how-it-works-data-flow-design.md`

---

### Task 1: `Wire` connector component

**Files:**
- Create: `frontend/src/components/Wire.tsx`
- Test: `frontend/src/components/Wire.test.tsx`

The connector draws a PCB-style trace with right-angle bends. Two SVGs are
rendered: a **horizontal** one shown at `md+` (`flex-1`, fills the row gap) and a
**vertical** one shown below `md` (connects the stacked nodes). Both paths use
`vectorEffect="non-scaling-stroke"` so the 2px stroke and the dash pattern stay
crisp and uniform when `preserveAspectRatio="none"` stretches the geometry. The
animated accent path carries the class `wire-charge` (animation defined in
Task 2) plus a per-wire `animationDelay` for the propagation stagger.

- [ ] **Step 1: Write the failing test**

```tsx
// frontend/src/components/Wire.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Wire } from "./Wire";

describe("Wire", () => {
  it("renders both a horizontal and a vertical trace", () => {
    const { container } = render(<Wire />);
    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });

  it("is hidden from assistive tech", () => {
    const { container } = render(<Wire />);
    expect(container.firstChild).toHaveAttribute("aria-hidden");
  });

  it("applies the stagger delay to the animated charge paths", () => {
    const { container } = render(<Wire delay={600} />);
    const charges = container.querySelectorAll<SVGPathElement>(".wire-charge");
    expect(charges).toHaveLength(2);
    charges.forEach((c) => expect(c.style.animationDelay).toBe("600ms"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/components/Wire.test.tsx`
Expected: FAIL — cannot resolve `./Wire`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// frontend/src/components/Wire.tsx

/** Right-angle PCB trace path, horizontal (viewBox 0 0 100 40). */
const H_PATH = "M0,20 H30 V10 H50 V30 H70 V20 H100";
/** Right-angle PCB trace path, vertical (viewBox 0 0 40 60). */
const V_PATH = "M20,0 V18 H30 V42 H10 V60";

type WireProps = {
  /** Milliseconds to delay the charge pulse, for propagation stagger. */
  delay?: number;
};

/**
 * Decorative connector between two pipeline steps. Draws a static circuit
 * trace plus an accent-yellow charge that glides along it (CSS `.wire-charge`).
 * Horizontal variant fills the row gap on desktop; vertical variant connects
 * the stacked nodes on mobile.
 */
export function Wire({ delay = 0 }: WireProps) {
  const style = { animationDelay: `${delay}ms` };
  return (
    <div
      aria-hidden
      className="flex items-center justify-center py-1 md:flex-1 md:py-0"
    >
      {/* Desktop: horizontal trace */}
      <svg
        className="hidden h-10 w-full md:block"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <path
          d={H_PATH}
          className="fill-none stroke-ink/15"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={H_PATH}
          className="wire-charge fill-none stroke-accent"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={style}
        />
      </svg>

      {/* Mobile: vertical trace */}
      <svg
        className="h-12 w-10 md:hidden"
        viewBox="0 0 40 60"
        preserveAspectRatio="none"
      >
        <path
          d={V_PATH}
          className="fill-none stroke-ink/15"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={V_PATH}
          className="wire-charge fill-none stroke-accent"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={style}
        />
      </svg>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/components/Wire.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/Wire.tsx frontend/src/components/Wire.test.tsx
git commit -m "feat: add Wire connector component for data-flow pipeline"
```

---

### Task 2: Charge animation + reduced-motion freeze in CSS

**Files:**
- Modify: `frontend/src/index.css` (append keyframes; extend the existing `prefers-reduced-motion` block at lines 35-42)

The pulse is a single short lit dash gliding along the trace. A large dash gap
(`12 600`) guarantees only one lit segment is visible at a time across typical
gap widths. `linear` + `infinite` keeps the glide perfectly smooth with no
visible restart jump. The accent path gets a soft glow via `drop-shadow`. Under
reduced motion the animation is removed (`animation: none`) so a static lit nub
remains at the trace start, keeping the connection legible without motion.

- [ ] **Step 1: Append the charge animation rules to `index.css`**

Add at the end of the file (after the existing `prefers-reduced-motion` block):

```css
/* Animated "charge" that glides along a Wire's accent trace. */
@keyframes wire-flow {
  to {
    stroke-dashoffset: -612;
  }
}

.wire-charge {
  stroke-dasharray: 12 600;
  filter: drop-shadow(0 0 3px rgba(255, 204, 0, 0.7));
  animation: wire-flow 2.5s linear infinite;
}
```

- [ ] **Step 2: Freeze the charge under reduced motion**

Edit the existing `prefers-reduced-motion` block (currently lines 35-42). Add a
`.wire-charge` rule inside the same media query so the pulse holds static:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }

  .wire-charge {
    animation: none;
    stroke-dashoffset: 0;
  }
}
```

- [ ] **Step 3: Verify the app still type-checks/builds**

Run: `cd frontend && npm run build`
Expected: build succeeds (CSS is valid; no TS errors).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/index.css
git commit -m "feat: add smooth wire-flow charge animation with reduced-motion freeze"
```

---

### Task 3: Rebuild `HowItWorks` with accurate steps and wired flow

**Files:**
- Modify: `frontend/src/components/panels/HowItWorks.tsx` (replace `steps` array lines 8-13, imports line 3, and the step-cards `RevealGroup` lines 79-100; keep `TechStack`, `stack`, and the tech-stack `RevealGroup` untouched)
- Modify: `frontend/src/components/panels/HowItWorks.test.tsx` (update the four-step assertions)

Cards become borderless nodes (`IconTile` + number + label + one-line copy),
laid out `flex-col` on mobile and `flex-row` on `md+`, with a `<Wire>`
interleaved between consecutive nodes. Each node stays wrapped in `Reveal` to
preserve the existing cascade; wires are decorative and render immediately.
Stagger delays are `index * 600` (0 / 600 / 1200 ms) so the charge propagates
01→02→03→04.

- [ ] **Step 1: Update the test to the new labels (failing)**

Replace the body of `frontend/src/components/panels/HowItWorks.test.tsx` with:

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

  it("renders all four accurate pipeline steps", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Smart Plug")).toBeInTheDocument();
    expect(screen.getByText("Database Storage")).toBeInTheDocument();
    expect(screen.getByText("API & Machine Learning")).toBeInTheDocument();
    expect(screen.getByText("Mobile App")).toBeInTheDocument();
  });

  it("wires the steps together with three connectors", () => {
    const { container } = render(<HowItWorks />);
    // 3 Wire components between 4 nodes; each Wire has 2 svgs.
    expect(container.querySelectorAll(".wire-charge")).toHaveLength(6);
  });

  it("renders tech-stack badges by plain name", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Tuya Smart Plug")).toBeInTheDocument();
    expect(screen.getByText("FastAPI")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd frontend && npx vitest run src/components/panels/HowItWorks.test.tsx`
Expected: FAIL — old labels gone / no `.wire-charge` elements yet.

- [ ] **Step 3: Update imports and the `steps` array**

In `frontend/src/components/panels/HowItWorks.tsx`, replace the icon import
(line 3) and the `steps` array (lines 8-13):

```tsx
import { PlugZap, Database, BrainCircuit, Smartphone } from "lucide-react";
```

```tsx
const steps = [
  {
    icon: PlugZap,
    label: "Smart Plug",
    copy: "Measures appliance-level energy use in real time.",
  },
  {
    icon: Database,
    label: "Database Storage",
    copy: "Readings stream to MongoDB, filtered by plug, appliance, and whole-home use.",
  },
  {
    icon: BrainCircuit,
    label: "API & Machine Learning",
    copy: "An API feeds the app, drives bill prediction (linear regression), and flags personalized savings.",
  },
  {
    icon: Smartphone,
    label: "Mobile App",
    copy: "Monitor appliances, track usage, and get live insights.",
  },
];
```

- [ ] **Step 4: Add the `Wire` import and a `StepNode` helper**

Add `Wire` to the imports near the top (after the `Reveal` import line 6):

```tsx
import { Wire } from "../Wire";
```

Add this helper above the `HowItWorks` function (after the `TechStack`
function):

```tsx
/** One borderless pipeline node: icon tile, step number, label, one-line copy. */
function StepNode({
  icon,
  label,
  copy,
  index,
}: {
  icon: typeof PlugZap;
  label: string;
  copy: string;
  index: number;
}) {
  return (
    <div className="flex w-full flex-col items-center text-center md:w-44">
      <IconTile icon={icon} label={label} />
      <span className="mt-3 font-display text-xs font-bold text-ink/30">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-1 font-display text-lg font-semibold">{label}</h3>
      <p className="mt-1 text-sm text-ink/55">{copy}</p>
    </div>
  );
}
```

- [ ] **Step 5: Replace the step-cards block with the wired flow**

Replace the entire step-cards `RevealGroup` (lines 79-100, the
`<RevealGroup className="mt-8 grid ...">...</RevealGroup>`) with:

```tsx
      <RevealGroup className="mt-10 flex flex-col items-center sm:mt-12 md:flex-row md:items-start md:justify-between">
        {steps.map((s, i) => (
          <Fragment key={s.label}>
            <Reveal className="w-full md:w-auto md:shrink-0">
              <StepNode
                icon={s.icon}
                label={s.label}
                copy={s.copy}
                index={i}
              />
            </Reveal>
            {i < steps.length - 1 && <Wire delay={i * 600} />}
          </Fragment>
        ))}
      </RevealGroup>
```

- [ ] **Step 6: Add the `Fragment` import**

Update the React import at the top of the file (line 1) so `Fragment` is
available:

```tsx
import { Fragment, useState } from "react";
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `cd frontend && npx vitest run src/components/panels/HowItWorks.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 8: Commit**

```bash
git add frontend/src/components/panels/HowItWorks.tsx frontend/src/components/panels/HowItWorks.test.tsx
git commit -m "feat: rebuild How It Works as accurate wired data-flow pipeline"
```

---

### Task 4: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `cd frontend && npm run test`
Expected: all tests pass (including `Wire` and `HowItWorks`).

- [ ] **Step 2: Lint**

Run: `cd frontend && npm run lint`
Expected: no errors.

- [ ] **Step 3: Type-check + production build**

Run: `cd frontend && npm run build`
Expected: build succeeds with no TS errors.

- [ ] **Step 4: Manual visual check**

Run: `cd frontend && npm run dev`, open the How It Works panel, and confirm:
- Desktop (`>= 768px`): four borderless nodes in a row, horizontal circuit
  traces between them, a single accent pulse gliding smoothly through each wire,
  staggered 01→02→03→04.
- Mobile (`< 768px`, narrow the window): nodes stacked vertically with
  **vertical** traces connecting them top-to-bottom (connection never
  disappears).
- With OS "reduce motion" on: traces are static (no pulse), still legible.
- Tech-stack badges below are unchanged.

- [ ] **Step 5: Final commit (only if Step 4 surfaced fixes)**

```bash
git add -A
git commit -m "fix: How It Works data-flow visual adjustments"
```
```

(Skip if no changes were needed.)
