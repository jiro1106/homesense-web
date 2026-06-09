import { Panel } from "./Panel";
import { YellowButton } from "../YellowButton";
import { Reveal, RevealGroup } from "../Reveal";
import { DOWNLOAD_APK_URL } from "../../lib/links";
import phoneHero from "../../assets/app-screen-1.png";
import smartPlug from "../../assets/smartplug.png";

/**
 * Panel 1. Big tagline on the left, phone mockup on the right (stacked on
 * mobile). The two columns reveal as a cascade when the panel comes into view.
 */
export function Hero() {
  return (
    <Panel>
      <RevealGroup className="grid items-center gap-12 md:grid-cols-2 md:gap-8">
        <Reveal className="text-center md:text-left">
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Monitor every watt at home
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg text-ink/60 md:mx-0">
            See exactly how much electricity your home is using, live, right on
            your phone.
          </p>
          <div className="mt-8 flex justify-center md:justify-start">
            <YellowButton href={DOWNLOAD_APK_URL} target="_blank">
              Download APK
            </YellowButton>
          </div>
        </Reveal>

        <Reveal className="flex justify-center md:justify-end">
          <div className="relative">
            <img
              src={phoneHero}
              alt="HomeSense app running on a phone"
              className="aspect-9/19 w-64 object-contain sm:w-72 lg:w-80"
            />
            <img
              src={smartPlug}
              alt="HomeSense smart plug"
              className="absolute -bottom-3 -right-32 w-40 -rotate-30 object-contain sm:w-50 lg:w-60"
            />
          </div>
        </Reveal>
      </RevealGroup>
    </Panel>
  );
}
