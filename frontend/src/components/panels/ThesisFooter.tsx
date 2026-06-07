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
      <RevealGroup className="mx-auto max-w-3xl text-center">
        {/* Primary: the formal title carries the panel */}
        <Reveal>
          <h2 className="text-balance font-display text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.2] tracking-tight text-ink">
            <span className="font-extrabold">HomeSense</span>: An IoT-Based
            Household Electricity Monitoring System with Bill Prediction Using
            Linear Regression and Recommendation System
          </h2>
        </Reveal>
        {/* Quiet hairline rule, matching the dividers elsewhere on the site */}
        <Reveal className="mt-7">
          <div className="mx-auto h-px w-16 bg-ink/15" />
        </Reveal>
        {/* Secondary: the authors, the people a reader should notice */}
        <Reveal className="mt-7">
          <p className="text-sm text-ink/60">Submitted by</p>
          <ul className="mt-2 space-y-1 font-display text-lg font-semibold text-ink/90">
            <li>Gelligan, Xavier</li>
            <li>Layug, Jiro Rafael</li>
            <li>Punzalan, Alfeah Star</li>
          </ul>
        </Reveal>
        {/* Tertiary: institution and date, quiet supporting line */}
        <Reveal className="mt-5">
          <p className="text-sm text-ink/60">De La Salle Lipa · May 2025</p>
        </Reveal>

        {/* Action: single CTA to reach the team by email */}
        <Reveal className="mt-10 flex justify-center">
          <YellowButton href="mailto:app.homesense@gmail.com">
            Contact the team
          </YellowButton>
        </Reveal>

        <Reveal className="mt-14">
          <p className="text-xs text-ink/55">
            © 2025 HomeSense. Built as an undergraduate thesis.
          </p>
        </Reveal>
      </RevealGroup>
    </Panel>
  );
}
