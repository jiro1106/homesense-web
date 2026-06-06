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
