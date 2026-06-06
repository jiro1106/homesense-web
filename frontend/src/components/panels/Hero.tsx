import { Panel } from "./Panel";
import { YellowButton } from "../YellowButton";
import { Placeholder } from "../Placeholder";
import { Reveal, RevealGroup } from "../Reveal";

/**
 * Panel 1. Big tagline on the left, phone mockup on the right (stacked on
 * mobile). The two columns reveal as a cascade when the panel comes into view.
 */
export function Hero() {
  return (
    <Panel>
      <RevealGroup className="grid items-center gap-12 md:grid-cols-2 md:gap-8">
        <Reveal>
          <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Monitor every watt at home.
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink/60">
            HomeSense is an IoT system that tracks your household electricity
            use in real time — straight from your phone.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <YellowButton href="#download">Download APK</YellowButton>
            <span className="text-sm text-ink/50">scroll to explore →</span>
          </div>
        </Reveal>

        <Reveal className="flex justify-center">
          <Placeholder
            name="phone-hero.png"
            className="aspect-[9/19] w-56 sm:w-64 lg:w-72"
          />
        </Reveal>
      </RevealGroup>
    </Panel>
  );
}
