import { Panel } from "./Panel";
import { YellowButton } from "../YellowButton";
import { Reveal, RevealGroup } from "../Reveal";
import { DOWNLOAD_APK_URL, PORTFOLIO_URL } from "../../lib/links";
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
          <p className="mt-5 text-xs text-ink/45">
            Web preview built and designed by{" "}
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-ink/70 underline decoration-ink/20 underline-offset-2 transition-colors hover:text-ink hover:decoration-ink/50"
            >
              Jiro Layug
            </a>
          </p>
        </Reveal>

        <Reveal className="flex justify-center md:justify-end">
          <div className="flex justify-center">
            <div className="relative flex justify-center sm:flex-row sm:items-end">
              {/* Phone */}
              <div className="z-10">
                <img
                  src={phoneHero}
                  alt="HomeSense app running on a phone"
                  className="aspect-9/19 w-64 object-contain sm:w-72 lg:w-80"
                />
              </div>

              {/* Smart plug */}
              <div className="absolute -bottom-4 -right-12 z-20 rotate-0 sm:relative sm:bottom-auto sm:right-auto sm:-ml-20 sm:translate-y-4 lg:-ml-24">
                <img
                  src={smartPlug}
                  alt="HomeSense smart plug"
                  className="w-28 -rotate-30 object-contain sm:w-50 lg:w-60"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </RevealGroup>
    </Panel>
  );
}
