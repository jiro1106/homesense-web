import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import { PlugZap, Database, BrainCircuit, Smartphone } from "lucide-react";
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

const stack = [
  "Tuya Smart Plug",
  "React Native",
  "Typescript",
  "Python",
  "FastAPI",
  "Flask",
  "MongoDB",
  "Expo Go",
  "Render",
];

/**
 * Row of tech-stack badges. The one under the pointer lifts and highlights in
 * accent yellow while the rest dim back, so attention follows the cursor.
 */
function TechStack() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="flex flex-wrap justify-center gap-3 md:justify-start"
      onMouseLeave={() => setHovered(null)}
    >
      {stack.map((tech) => {
        const isActive = hovered === tech;
        const isDimmed = hovered !== null && !isActive;
        return (
          <motion.span
            key={tech}
            onMouseEnter={() => setHovered(tech)}
            whileHover={{ y: -3 }}
            animate={{ opacity: isDimmed ? 0.4 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={
              "cursor-default rounded-full border px-4 py-2 text-sm font-semibold transition-colors " +
              (isActive
                ? "border-accent bg-accent text-ink shadow-sm shadow-accent/40"
                : "border-ink/15 text-ink/70")
            }
          >
            {tech}
          </motion.span>
        );
      })}
    </div>
  );
}

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

/**
 * Panel 3. Four-step IoT pipeline (Smart Plug → Database → API & ML → App)
 * wired together with animated circuit traces, plus tech-stack badges.
 * Heading, wired flow, and badges each reveal in cascade.
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

      <RevealGroup className="mt-10 text-center sm:mt-12 md:text-left">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink/40">
            Built with
          </p>
        </Reveal>
        <Reveal className="mt-4">
          <TechStack />
        </Reveal>
      </RevealGroup>
    </Panel>
  );
}
