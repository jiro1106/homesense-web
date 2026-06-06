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
