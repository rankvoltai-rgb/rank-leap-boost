import { STATIONS, type Owner } from "./content";
import { MoreLinks } from "./MoreLinks";
import { OwnerChip } from "./OwnerChip";
import { SectionShell } from "./SectionShell";

const LANES: Owner[] = ["rankbox", "agency", "client"];

/**
 * 01. The owner matrix: six stations down, three lanes across (Rankbox, your
 * agency, the client). On a phone each station becomes one card with its
 * lanes stacked and labelled; from md up the lane labels move to one header
 * row and the cells line up. A station a lane has no part in says so, in
 * muted text, so the empty cells read as a fact and not as a gap.
 */
export function Stations() {
  return (
    <SectionShell id="stations" intro={STATIONS.intro}>
      <div className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        {/* Lane header, md and up. */}
        <div
          aria-hidden
          className="hidden border-b border-ink/[0.07] bg-surface/60 md:grid md:grid-cols-[10rem_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]"
        >
          <span />
          {LANES.map((lane) => (
            <span key={lane} className="px-5 py-3">
              <OwnerChip owner={lane} />
            </span>
          ))}
        </div>

        <ol>
          {STATIONS.rows.map((row, i) => (
            <li
              key={row.name}
              className="grid border-b border-ink/[0.07] last:border-b-0 md:grid-cols-[10rem_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]"
            >
              <div className="px-5 pb-2 pt-5 md:py-5">
                <p className="flex items-baseline gap-2">
                  <span className="font-mono text-[0.72rem] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.95rem] font-semibold tracking-tight text-ink">
                    {row.name}
                  </span>
                </p>
                <p className="mt-1 pl-7 text-[0.75rem] text-muted-foreground">{row.when}</p>
              </div>
              <dl className="contents">
                {LANES.map((lane) => {
                  const text = row[lane];
                  return (
                    <div
                      key={lane}
                      className={
                        lane === "rankbox"
                          ? "px-5 py-2.5 md:bg-cta-soft/40 md:py-5"
                          : "px-5 py-2.5 md:py-5 last:pb-5"
                      }
                    >
                      <dt className="mb-1.5 md:sr-only">
                        <OwnerChip owner={lane} />
                      </dt>
                      <dd
                        className={
                          text
                            ? "text-[0.86rem] leading-relaxed text-ink/80"
                            : "text-[0.82rem] text-muted-foreground/70"
                        }
                      >
                        {text || STATIONS.nothing}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-5 max-w-3xl text-[0.86rem] leading-relaxed text-muted-foreground">
        {STATIONS.apps}
      </p>
      <MoreLinks links={STATIONS.links} />
    </SectionShell>
  );
}
