import { Panel } from "./Panel";
import { YellowButton } from "../YellowButton";
import { Reveal, RevealGroup } from "../Reveal";

/**
 * Panel 4. Thesis credit close with clear text hierarchy. The lines reveal in a
 * gentle top-to-bottom cascade.
 */
export function ThesisFooter() {
  return (
    <Panel className="md:justify-center">
      <RevealGroup className="max-w-2xl">
        {/* Primary */}
        <Reveal>
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            A thesis project
          </h2>
        </Reveal>
        {/* Secondary */}
        <Reveal className="mt-4">
          <p className="text-xl text-ink/70">
            HomeSense — [University Name], [Year]
          </p>
        </Reveal>
        {/* Tertiary */}
        <Reveal className="mt-2">
          <p className="text-base text-ink/50">
            By [Author One], [Author Two], [Author Three]
          </p>
        </Reveal>

        {/* Actions */}
        <Reveal className="mt-8 flex flex-wrap items-center gap-4">
          <YellowButton href="#download">Download APK</YellowButton>
          <a
            href="#contact"
            className="text-sm font-medium text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Contact the team
          </a>
        </Reveal>

        <Reveal className="mt-12">
          <p className="text-xs text-ink/40">
            © [Year] HomeSense. Built as an undergraduate thesis.
          </p>
        </Reveal>
      </RevealGroup>
    </Panel>
  );
}
