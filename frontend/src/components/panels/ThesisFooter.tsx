import { motion } from "framer-motion";
import { Panel } from "./Panel";
import { YellowButton } from "../YellowButton";

/**
 * Panel 4. Thesis credit close with clear text hierarchy: primary line, then
 * institution/year, then authors, then actions. Minimal and formal.
 */
export function ThesisFooter() {
  return (
    <Panel className="md:justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl"
      >
        {/* Primary */}
        <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          A thesis project
        </h2>
        {/* Secondary */}
        <p className="mt-4 text-xl text-ink/70">
          HomeSense — [University Name], [Year]
        </p>
        {/* Tertiary */}
        <p className="mt-2 text-base text-ink/50">
          By [Author One], [Author Two], [Author Three]
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <YellowButton href="#download">Download APK</YellowButton>
          <a
            href="#contact"
            className="text-sm font-medium text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Contact the team
          </a>
        </div>

        <p className="mt-12 text-xs text-ink/40">
          © [Year] HomeSense. Built as an undergraduate thesis.
        </p>
      </motion.div>
    </Panel>
  );
}
