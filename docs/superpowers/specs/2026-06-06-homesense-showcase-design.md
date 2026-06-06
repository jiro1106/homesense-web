# HomeSense Showcase Website — Design Spec

**Date:** 2026-06-06
**Status:** Approved direction, pending final spec review
**Project:** Single-page horizontal-scrolling showcase for HomeSense (a thesis IoT household-electricity-monitoring mobile app distributed as an APK).

---

## 1. Purpose & success criteria

HomeSense is a thesis project: an IoT-based household electricity monitoring **mobile app** shipped as an APK (not on any store). This website is its **public-facing showcase** — the place a hiring manager or thesis panelist lands to understand the project and download the APK.

**Success = the site impresses a hiring manager.** It must read as confident, polished, minimalist, and engineering-credible — communicating *what the app does*, *what it looks like*, *how the IoT system works*, and *who built it*, in a memorable horizontal journey.

## 2. Aesthetic direction

A **light-mode, formal, minimalist** site with a confident display-typographic voice (inspired by getkeeby.com's confidence) and a **bento-grid product showcase** (inspired by tarsi.cloud).

- **Palette:** `#ffffff` background, `#000000` ink/text. Yellow `#ffcc00` reserved for primary buttons, key accents, and the scroll-progress bar.
- **Icons:** `lucide-react`. Each icon sits on a **pastel-yellow tile background** with a **darker-yellow icon stroke**. Working tokens (adjustable): tile `#fff3c4`, stroke `#e0a800`.
- **Typography:** **Plus Jakarta Sans** as the single family for both display and body. Big, tight display weights for headlines; regular weights for body.
- **No eyebrows** — do not place small kicker/label text above headings anywhere.
- **Cards/bento:** hairline 1px black borders, ~14px radius, white fills, flat (no heavy shadows).
- **Motion:** Framer Motion throughout — eased panel transitions, subtle entrance/parallax on cells, slim yellow scroll-progress indicator.

## 3. Interaction model

### Desktop (≥ 768px)
- **Wheel→horizontal hijack:** vertical mouse-wheel / trackpad delta is translated into horizontal `translateX` movement across a single horizontal track of 4 full-viewport panels (`100vw × 100svh`).
- Eased momentum; a slim yellow **scroll-progress bar** and **clickable panel dots** reflect/drive position.
- **Accessibility:** Arrow keys, PageUp/PageDown, and Home/End also navigate panels; dot-nav is focusable/clickable. Respect `prefers-reduced-motion` (reduce/disable easing & parallax).

### Mobile (< 768px)
- Scroll-hijack is **disabled**. Panels **stack and scroll vertically** as normal full-height sections.
- Responsive breakpoints tune type scale, bento layout (multi-column → single/two-column), and the hero (side-by-side → stacked) for readability.

## 4. The 4 panels

```
┌─ PANEL 1 ─────┐┌─ PANEL 2 ──────┐┌─ PANEL 3 ──────┐┌─ PANEL 4 ──────┐
│  HERO         ││  PRODUCT       ││  HOW IT WORKS  ││  THESIS        │
│  tagline +    ││  (bento grid)  ││  + TECH STACK  ││  CREDIT FOOTER │
│  phone mockup ││                ││                ││                │
└───────────────┘└────────────────┘└────────────────┘└────────────────┘
   ───────────────────────  scroll →  ──────────────────────────────►
```

### Panel 1 — Hero
- **BIG tagline** headline on one side, **phone mockup** of the app beside it (side-by-side on desktop; stacked on mobile).
- One **yellow primary button** (e.g., "Download APK").
- A subtle "scroll to explore →" affordance.
- No eyebrow text above the tagline.

### Panel 2 — Product (bento grid, Tarsi-style)
- Variable-span bento cells, ~14px radius, hairline black borders, white fills.
- Each cell = an app-screenshot placeholder **or** a short feature label (e.g., real-time feed, usage history, cost estimate, alerts).
- Kept as previously designed.

### Panel 3 — How it works + Tech stack
- A **4-step IoT pipeline**: Sensor → Gateway → Cloud → App, each with a lucide icon (pastel-yellow tile, darker-yellow stroke).
- **Tech-stack badges** below the pipeline (placeholder names until confirmed).
- Kept as previously designed.

### Panel 4 — Thesis credit footer
- **Strong text hierarchy** (best practices): a clear primary line ("A thesis project" / project name), secondary line (university, year), tertiary detail (authors), and actions (Download APK, contact/links).
- Minimal, clean, formal close.

## 5. Placeholders strategy

The user will supply real assets later. Every image becomes a **labeled placeholder** (light-gray fill, dashed border, filename hint such as `app-dashboard.png`, `phone-mockup.png`). Text the user must supply is marked in `[brackets]` (university, year, author names, exact tech-stack items, real tagline copy). Placeholders are named so assets can be dropped in by filename.

## 6. Component structure

- `HorizontalShowcase` — owns the horizontal track + wheel-hijack hook + progress/dot nav; switches to vertical stacking under the mobile breakpoint.
- `Hero` — tagline + phone mockup + primary button.
- `ProductBento` — bento grid of screenshot/feature cells.
- `HowItWorks` — IoT pipeline + tech-stack badges.
- `ThesisFooter` — credit footer with hierarchy.
- Shared: `Placeholder` (named asset box), `YellowButton`, `IconTile` (pastel-yellow tile + darker-yellow lucide icon), `ProgressNav` (bar + dots).

## 7. Technical constraints

- **Tailwind CSS first** for all styling; drop to custom CSS only where Tailwind genuinely can't express it (e.g., the wheel-hijack transform math lives in JS/hook, not utility classes).
- **Framer Motion** for animations.
- **lucide-react** for icons.
- **Plus Jakarta Sans** loaded (via Fontshare/Google Fonts or self-host).
- Built on the existing Vite + React + TypeScript + Tailwind v4 setup in `frontend/`.
- Respect `prefers-reduced-motion`.

## 8. Out of scope (YAGNI)

- No real backend, analytics, or APK hosting logic (the Download button is a placeholder link).
- No CMS — content is in-code.
- No dark mode.
- No additional panels beyond the 4 (features fold into the bento; how-it-works + tech stack share Panel 3).

## 9. Open content the user will provide later

- Real tagline / headline copy.
- App screenshots + phone mockup image.
- Exact tech-stack items and IoT hardware names.
- University name, year, author names, contact/links.
- Final yellow shades for the icon tile/stroke if different from the working tokens.
