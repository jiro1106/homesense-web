import { Fragment } from "react";
import { motion } from "framer-motion";
import { PlugZap, Database, BrainCircuit, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Panel } from "./Panel";
import { IconTile } from "../IconTile";
import { Reveal, RevealGroup } from "../Reveal";
import { Wire } from "../Wire";

const steps = [
  {
    icon: PlugZap,
    label: "Smart Plug",
    copy: "Measures appliance-level energy use in real time.",
  },
  {
    icon: Database,
    label: "Database Storage",
    copy: "Readings stream to the database, filtered by plug, appliance, and whole-home use.",
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

/**
 * The stack, grouped by engineering layer. Every item lands in exactly one
 * group, so "Built with" reads as a structured manifest rather than an
 * undifferentiated badge soup. The ML work lives inside the Python API, so it
 * rides along with the backend rather than claiming an empty row.
 */
const stackByLayer = [
  { layer: "Hardware", tech: ["2 Pin Flat 20A WiFi Tuya Smart Plug"] },
  { layer: "Deployment", tech: ["Render", "Expo Go"] },
  { layer: "Frontend", tech: ["React Native", "React", "TypeScript"] },
  { layer: "Database", tech: ["MongoDB"] },
  { layer: "Backend & ML", tech: ["Python", "FastAPI", "Flask"] },
];

/**
 * Tech-stack manifest. Each row pairs an engineering layer with the badges that
 * power it. Hovering a single badge lifts it and fills it accent yellow; the
 * others are left untouched, so the chips read as information rather than a
 * selectable control.
 */
function TechStack() {
  return (
    <dl className="grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2">
      {stackByLayer.map(({ layer, tech }) => (
        <div
          key={layer}
          className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6"
        >
          <dt className="font-display text-xs font-bold uppercase tracking-wider text-ink/35 md:w-28 md:shrink-0 md:pt-2.5">
            {layer}
          </dt>
          <dd className="m-0 flex flex-wrap gap-2.5">
            {tech.map((t) => (
              <motion.span
                key={t}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="cursor-default rounded-full border border-ink/10 bg-ink/[0.03] px-4 py-2 text-sm font-semibold text-ink/70 shadow-accent/40 transition-colors hover:border-accent hover:bg-accent hover:text-ink hover:shadow-sm"
              >
                {t}
              </motion.span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** One borderless pipeline node: icon tile, step number, label, one-line copy. */
function StepNode({
  icon,
  label,
  copy,
  index,
}: {
  icon: LucideIcon;
  label: string;
  copy: string;
  index: number;
}) {
  return (
    <div className="flex w-full flex-col items-center text-center md:w-48">
      <IconTile icon={icon} label={label} />
      <span className="mt-3 font-display text-xs font-bold text-ink/30">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-1 font-display text-lg font-semibold text-balance md:flex md:min-h-14 md:items-center md:justify-center">
        {label}
      </h3>
      <p className="mt-1 text-sm text-ink/55">{copy}</p>
    </div>
  );
}

/**
 * Panel 3. Four-step IoT pipeline (Smart Plug → Database → API & ML → App)
 * with tech-stack badges. The heading, step nodes, and tech-stack badges each
 * reveal in cascade; nodes are connected by decorative animated wire traces.
 */
export function HowItWorks() {
  return (
    <Panel>
      <RevealGroup className="text-center md:text-left">
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            How it works
          </h2>
        </Reveal>
      </RevealGroup>

      <RevealGroup className="mt-10 flex flex-col items-center sm:mt-12 md:flex-row md:items-start md:justify-between">
        {steps.map((s, i) => (
          <Fragment key={s.label}>
            <Reveal className="w-full md:w-auto md:shrink-0">
              <StepNode icon={s.icon} label={s.label} copy={s.copy} index={i} />
            </Reveal>
            {i < steps.length - 1 && <Wire delay={i * 600} />}
          </Fragment>
        ))}
      </RevealGroup>

      <RevealGroup className="mt-10 border-t border-ink/10 pt-6 sm:mt-12">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink">
            Built with
          </p>
        </Reveal>
        <Reveal className="mt-5">
          <TechStack />
        </Reveal>
      </RevealGroup>
    </Panel>
  );
}
