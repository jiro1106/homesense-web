import { Panel } from "./Panel";
import { Reveal, RevealGroup } from "../Reveal";
import screen1 from "../../assets/bare-app-screen-1.png";
import screen2 from "../../assets/bare-app-screen-2.png";
import screen3 from "../../assets/bare-app-screen-3.png";
import screen4 from "../../assets/bare-app-screen-4.png";
import screen5 from "../../assets/bare-app-screen-5.png";
import screen6 from "../../assets/bare-app-screen-6.png";

const screens = [
  { src: screen1, alt: "Appliance records screen" },
  { src: screen2, alt: "Usage history screen" },
  { src: screen3, alt: "Cost estimate screen" },
  { src: screen4, alt: "Bill prediction screen" },
  { src: screen5, alt: "Recommendations screen" },
  { src: screen6, alt: "Alerts screen" },
];

/**
 * Panel 3. A filmstrip of bare app screens. On desktop the six screens fit
 * evenly across the panel width; on mobile the row becomes a horizontally
 * scrollable strip so each screen stays legible. Each screen gets rounded
 * corners + a soft shadow, and the row cascades in via <RevealGroup>.
 */
export function AppGallery() {
  return (
    <Panel>
      <RevealGroup>
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            See it in action
          </h2>
        </Reveal>
        <Reveal className="mt-3 max-w-md">
          <p className="text-ink/60">
            A look at the screens you'll live in every day.
          </p>
        </Reveal>
      </RevealGroup>

      <RevealGroup className="mt-10 flex gap-4 overflow-x-auto pb-2 md:overflow-x-visible">
        {screens.map((screen) => (
          <Reveal
            key={screen.src}
            className="aspect-[9/19] w-40 shrink-0 md:w-auto md:flex-1"
          >
            <img
              src={screen.src}
              alt={screen.alt}
              className="h-full w-full rounded-2xl border border-ink/10 object-cover shadow-lg shadow-ink/10"
            />
          </Reveal>
        ))}
      </RevealGroup>
    </Panel>
  );
}
