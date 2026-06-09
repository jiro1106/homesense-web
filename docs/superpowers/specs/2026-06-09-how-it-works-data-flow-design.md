# How It Works — Wired Data-Flow Redesign

Date: 2026-06-09
Component: `frontend/src/components/panels/HowItWorks.tsx`

## Problem

The current "How it works" panel shows four generic, inaccurate steps
(Sensor / Gateway / Cloud / App) as hover-lift **cards**. The copy does not
match how the real HomeSense system works, and the boxed-card layout reads as
four separate things rather than one connected pipeline.

## Goal

Replace the boxed cards with **flowing nodes wired together** so the four real
steps read as a single data pipeline with data visibly flowing from one step to
the next — horizontally on desktop, vertically on mobile.

## Accurate Content

Four steps, condensed to one accurate line each:

| # | Label | Icon (lucide) | Copy |
|---|-------|---------------|------|
| 01 | Smart Plug | `PlugZap` | Measures appliance-level energy use in real time. |
| 02 | Database Storage | `Database` | Readings stream to MongoDB, filtered by plug, appliance, and whole-home use. |
| 03 | API & Machine Learning | `BrainCircuit` | An API feeds the app, drives bill prediction (linear regression), and flags personalized savings. |
| 04 | Mobile App | `Smartphone` | Monitor appliances, track usage, and get live insights. |

Source of truth (full descriptions these condense from):

1. Smart Plug measures appliance-level energy consumption in real time.
2. Data gathered by the smart plug is sent to a MongoDB database and stored and
   filtered there: individual smart plug info, overall household consumption, and
   individual appliance consumption.
3. Backend calls an API for data to ready it for visualization in the mobile app;
   data is also used for the linear-regression ML for bill prediction, and is
   tested under energy thresholds to provide personalized recommendations.
4. Users monitor appliances, track usage, and receive insights in real time.

## Layout

Boxed cards are removed entirely. Each step becomes a **node**:

- the existing `IconTile` (pastel-yellow tile, lucide icon)
- a `01`–`04` step number
- the label (`font-display`, semibold)
- the one-line copy

Nodes have **no border, no card background, and no hover-lift box.**

### Desktop (`md` and up)

- Nodes sit in a single horizontal row, evenly distributed.
- Between each consecutive pair of nodes sits a `Wire` that fills the gap.
- Wire = **circuit-board trace**: a horizontal PCB-style path with right-angle
  bends, drawn in `ink/15`, with an accent-yellow "charge" path animating along
  the same path.

### Mobile (`< md`)

- Nodes stack vertically (matches the panel's existing `flex-col` mobile mode).
- The wire between consecutive nodes becomes a **short vertical trace** so the
  flow turns downward and visibly connects the stacked nodes.
- Same `Wire` component; orientation is toggled by Tailwind responsive classes
  (horizontal variant `hidden md:block`, vertical variant `block md:hidden`, or
  equivalent). The vertical variant must be present and visible on mobile — the
  connection must never disappear when stacked.

## Motion (calm, continuous)

- Each wire's accent "charge" path animates `stroke-dashoffset` on a slow
  ~2.5s linear loop — a single soft glowing pulse gliding through, not a blink.
- Wires carry a small staggered `animation-delay` (node 01→02, 02→03, 03→04) so
  the charge reads as propagating along the whole chain rather than four
  independent animations.
- Keyframes are defined in `src/index.css`.
- Accessibility: the existing `prefers-reduced-motion` block in `index.css`
  freezes the pulse (sets the charge animation to none). The static base trace
  and accent charge path remain visible, so the connection still reads without
  motion. Node entrance still uses the existing `Reveal` / `RevealGroup`
  cascade (which already honors reduced motion).

## Components

### New: `frontend/src/components/Wire.tsx`

A small presentational component rendering the connecting trace so the SVG
markup is not duplicated three times inline.

- Renders inline SVG with two paths sharing the same `d`: a base trace
  (`ink/15`) and a `live` accent charge path (animated dash).
- Provides a **horizontal** path (right-angle bends) and a **vertical** path,
  shown/hidden by breakpoint as described in Layout.
- Accepts a prop to set the per-wire `animation-delay` (the stagger).
- Decorative: `aria-hidden`, no semantic role.

### Changed: `frontend/src/components/panels/HowItWorks.tsx`

- Update the `steps` array to the four accurate steps, labels, icons, and
  condensed copy above. Import `PlugZap`, `Database`, `BrainCircuit`,
  `Smartphone` from `lucide-react`; drop `Cpu`, `Router`, `Cloud`.
- Replace the grid-of-cards `RevealGroup` with a **`Flow`** layout that maps the
  steps to nodes and interleaves a `<Wire>` between consecutive nodes
  (`flex-col` on mobile, `flex-row` on `md+`).
- Each node is wrapped in a `Reveal` so the cascade entrance is preserved.
- The **tech-stack section below is unchanged.**

### Changed: `frontend/src/index.css`

- Add the `@keyframes` for the dash animation under `@theme`/global scope.
- Add the charge-animation freeze inside the existing
  `prefers-reduced-motion` block.

## Out of Scope

- The tech-stack badge row (`TechStack`) — untouched.
- `IconTile`, `Reveal`/`RevealGroup`, `Panel` — reused as-is, not modified.
- Any other panel.

## Testing

- `npm run build` (type-check + build) passes.
- `npm run lint` passes.
- Existing component smoke test for the showcase still passes; if a
  `HowItWorks`-specific assertion references old labels (e.g. "Sensor"),
  update it to the new labels.
- Manual check: desktop shows horizontal wires with a flowing accent pulse
  staggered across the four nodes; mobile (`< 768px`) shows the nodes stacked
  with **vertical** wires connecting them; `prefers-reduced-motion` shows static
  traces with no pulse.
