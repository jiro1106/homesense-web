import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Router, Cloud, Smartphone } from "lucide-react";
import { Panel } from "./Panel";
import { IconTile } from "../IconTile";
import { Reveal, RevealGroup } from "../Reveal";

const steps = [
  { icon: Cpu, label: "Sensor", copy: "Clamp meter reads current draw." },
  { icon: Router, label: "Gateway", copy: "Microcontroller relays the data." },
  { icon: Cloud, label: "Cloud", copy: "Stored, then your bill is predicted." },
  { icon: Smartphone, label: "App", copy: "You see it live on your phone." },
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
    <div className="flex flex-wrap gap-3" onMouseLeave={() => setHovered(null)}>
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
          <Reveal key={s.label} className="h-full">
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group h-full rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm shadow-ink/3 transition-colors hover:border-ink/20 hover:shadow-xl hover:shadow-ink/10"
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-sm font-bold text-ink/30 transition-colors group-hover:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <IconTile icon={s.icon} label={s.label} />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">
                {s.label}
              </h3>
              <p className="mt-1 text-sm text-ink/55">{s.copy}</p>
            </motion.div>
          </Reveal>
        ))}
      </RevealGroup>

      <RevealGroup className="mt-12">
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
