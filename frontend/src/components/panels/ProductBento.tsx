import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  History,
  Wallet,
  TrendingUp,
  Lightbulb,
  BellRing,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Panel } from "./Panel";
import { IconTile } from "../IconTile";
import { Reveal, RevealGroup } from "../Reveal";

const tileBase =
  "group h-full rounded-2xl border border-ink/10 bg-paper p-5 shadow-sm shadow-ink/3 transition-colors hover:border-ink/20";
const hoverLift = { y: -6 };
const liftSpring = { type: "spring", stiffness: 300, damping: 24 } as const;

/** Generic appliances the live feed simulates. `step` is the per-tick kWh
 *  increment while the appliance is on, so usage accrues like a real meter. */
const APPLIANCES = [
  { name: "Refrigerator", location: "Kitchen", on: true, base: 0.91, step: 0.01 },
  { name: "Air Conditioner", location: "Bedroom", on: true, base: 1.24, step: 0.02 },
  { name: "Wi-Fi Router", location: "Living Room", on: true, base: 0.09, step: 0.004 },
  { name: "Washing Machine", location: "Laundry", on: false, base: 0, step: 0 },
];

/**
 * Hero tile (2×2): a live "All appliances" table mirroring the app screen. Each
 * powered-on appliance accrues kWh on a ticking interval; the total updates with
 * it. Goes still under prefers-reduced-motion.
 */
function LiveFeedTile() {
  const reduced = useReducedMotion();
  const [usage, setUsage] = useState(() => APPLIANCES.map((a) => a.base));

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setUsage((prev) =>
        prev.map((u, i) => (APPLIANCES[i].on ? u + APPLIANCES[i].step : u))
      );
    }, 1800);
    return () => clearInterval(id);
  }, [reduced]);

  const total = usage.reduce((sum, u) => sum + u, 0);

  return (
    <Reveal className="h-full sm:col-span-2 sm:row-span-2 lg:col-span-6 lg:row-span-2">
      <motion.div
        whileHover={hoverLift}
        transition={liftSpring}
        className={"flex flex-col overflow-hidden " + tileBase}
      >
        <div className="flex items-center gap-3">
          <IconTile icon={Activity} label="Real-time feed" size="sm" />
          <h3 className="font-display text-lg font-semibold">Real-time feed</h3>
        </div>

        <div className="mt-3 flex-1">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wide text-ink/40">
                <th className="pb-1.5 font-semibold">Appliance</th>
                <th className="hidden pb-1.5 font-semibold sm:table-cell">
                  Location
                </th>
                <th className="pb-1.5 font-semibold">Status</th>
                <th className="pb-1.5 text-right font-semibold">Usage</th>
              </tr>
            </thead>
            <tbody>
              {APPLIANCES.map((a, i) => (
                <tr key={a.name} className="border-t border-ink/5">
                  <td className="py-1.5 font-medium">{a.name}</td>
                  <td className="hidden py-1.5 text-ink/55 sm:table-cell">
                    {a.location}
                  </td>
                  <td className="py-1.5">
                    <span
                      className={
                        "inline-flex items-center gap-1.5 text-xs font-semibold " +
                        (a.on ? "text-emerald-600" : "text-rose-500")
                      }
                    >
                      <span
                        className={
                          "h-1.5 w-1.5 rounded-full " +
                          (a.on ? "bg-emerald-500" : "bg-rose-400")
                        }
                      />
                      {a.on ? "On" : "Off"}
                    </span>
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {usage[i].toFixed(2)}
                    <span className="ml-1 text-xs text-ink/40">kWh</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-ink/10 pt-2 text-sm">
          <span className="text-ink/50">Total today</span>
          <span className="font-display font-bold tabular-nums">
            {total.toFixed(2)}
            <span className="ml-1 text-xs font-semibold text-ink">
              kWh
            </span>
          </span>
        </div>
      </motion.div>
    </Reveal>
  );
}

/** Wide tile (2×1): projected next bill with an upward forecast sparkline. */
function BillPredictionTile() {
  return (
    <Reveal className="h-full sm:col-span-2 lg:col-span-6">
      <motion.div whileHover={hoverLift} transition={liftSpring} className={tileBase}>
        <div className="flex h-full items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <IconTile icon={TrendingUp} label="Bill prediction" size="sm" />
              <h3 className="font-display text-lg font-semibold">
                Bill prediction
              </h3>
            </div>
            <p className="mt-3 text-sm text-ink/55">
              Forecasts your next bill with linear regression.
            </p>
            <p className="mt-3">
              <span className="font-display text-2xl font-extrabold tabular-nums">
                ₱346
              </span>
              <span className="ml-2 text-xs font-semibold text-ink/45">
                projected this month
              </span>
            </p>
          </div>
          <svg
            viewBox="0 0 120 64"
            className="hidden h-16 w-32 shrink-0 sm:block"
            aria-hidden
          >
            {/* horizontal gridlines for the trend to read against */}
            <g stroke="var(--color-ink)" strokeOpacity="0.1" strokeWidth="1">
              <line x1="0" y1="16" x2="120" y2="16" />
              <line x1="0" y1="32" x2="120" y2="32" />
              <line x1="0" y1="48" x2="120" y2="48" />
            </g>
            {/* baseline + left axis */}
            <g stroke="var(--color-ink)" strokeOpacity="0.2" strokeWidth="1">
              <line x1="0" y1="63" x2="120" y2="63" />
              <line x1="1" y1="0" x2="1" y2="63" />
            </g>
            <polyline
              points="0,52 24,46 48,48 72,32 96,28 120,12"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="120" cy="12" r="4" fill="var(--color-accent)" />
          </svg>
        </div>
      </motion.div>
    </Reveal>
  );
}

const TIPS = ["Run laundry off-peak", "Unplug idle chargers"];

/** Wide tile (2×1): actionable saving tips rendered as chips. */
function RecommendationsTile() {
  return (
    <Reveal className="h-full sm:col-span-2 lg:col-span-6">
      <motion.div whileHover={hoverLift} transition={liftSpring} className={tileBase}>
        <div className="flex items-center gap-3">
          <IconTile icon={Lightbulb} label="Recommendations" size="sm" />
          <h3 className="font-display text-lg font-semibold">Recommendations</h3>
        </div>
        <p className="mt-3 text-sm text-ink/55">Smart tips to trim your usage.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {TIPS.map((tip) => (
            <span
              key={tip}
              className="rounded-full bg-icon-tile px-3 py-1.5 text-xs font-semibold text-icon-stroke"
            >
              {tip}
            </span>
          ))}
        </div>
      </motion.div>
    </Reveal>
  );
}

type SmallTile = { icon: LucideIcon; label: string; copy: string };

const smallTiles: SmallTile[] = [
  { icon: History, label: "Usage history", copy: "Trends by day, week, month." },
  { icon: Wallet, label: "Cost estimate", copy: "See pesos, not just kWh." },
  { icon: BellRing, label: "Alerts", copy: "Spikes flagged instantly." },
];

/** Minor tier (1×1): the supporting features. */
function MiniTile({ icon, label, copy }: SmallTile) {
  return (
    <Reveal className="h-full lg:col-span-4">
      <motion.div whileHover={hoverLift} transition={liftSpring} className={tileBase}>
        <IconTile icon={icon} label={label} size="sm" />
        <div className="mt-3">
          <h3 className="font-display text-base font-semibold">{label}</h3>
          <p className="mt-1 text-sm text-ink/55">{copy}</p>
        </div>
      </motion.div>
    </Reveal>
  );
}

/**
 * Panel 2. Importance-weighted bento: the three flagship features (real-time
 * feed, bill prediction, recommendations) take the largest tiles; the rest sit
 * in the minor tier. Each tile is tailored to its feature rather than a uniform
 * card. Heading/intro reveal first, then the grid cascades in.
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

      <RevealGroup className="mt-[clamp(1.5rem,4vh,2.5rem)] grid auto-rows-[minmax(88px,1fr)] grid-flow-dense grid-cols-1 gap-[clamp(0.75rem,1.6vh,1rem)] sm:grid-cols-2 md:auto-rows-[minmax(88px,clamp(8rem,18vh,10.5rem))] lg:grid-cols-12">
        <LiveFeedTile />
        <BillPredictionTile />
        <RecommendationsTile />
        {smallTiles.map((t) => (
          <MiniTile key={t.label} {...t} />
        ))}
      </RevealGroup>
    </Panel>
  );
}
