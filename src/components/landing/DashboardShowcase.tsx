/**
 * The product shot under the hero: the Rankbox workspace in white, at the
 * size of the app window in Profound's hero (1320 × 720 at desktop). Like
 * theirs it is wider than the page's column, so the page's rails run on
 * behind it rather than boxing it in. Then rows of everything it connects
 * to.
 *
 * It stands on Daybreak (workspace/Daybreak.tsx): the white page dawning
 * into brand blue, lit from behind the window.
 *
 * The window runs its own loop (workspace/), so the section itself stays
 * still: nothing here moves with the scroll.
 */
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Band, LINE } from "./frame";
import { WorkspaceReplica } from "./workspace/WorkspaceReplica";
import { Daybreak } from "./workspace/Daybreak";
import { ConnectorRows } from "./connector-rows";

/* The window's shadow, tinted navy for the blue it falls on ("r g b"). */
const SHADE = { "--ws-shade": "4 30 84" } as CSSProperties;

export function DashboardShowcase() {
  return (
    <section aria-label="The Rankbox workspace">
      <div className={cn("relative overflow-hidden border-t bg-white", LINE)}>
        <Daybreak />
        <div className="relative mx-auto w-full max-w-[1320px] px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-28 xl:px-0">
          <div style={SHADE}>
            <WorkspaceReplica />
          </div>
          <p className="mt-5 text-center text-[0.72rem] text-white/75">
            A sample workspace. Driftmoor Coffee is a fictional site.
          </p>
        </div>
      </div>
      <Band>
        <ConnectorRows />
      </Band>
    </section>
  );
}
