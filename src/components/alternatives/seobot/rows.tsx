/**
 * Every row of the comparison, read as the autopilot's own pipeline: find
 * what to write, write it, ship it, grow its authority, and what the plan
 * covers. On wide screens the five stages run down a sticky rail on the left
 * and light up as you read; each stage is its own small table.
 *
 * Each row puts its question across the full width and the two answers side
 * by side under it, so a phone shows both answers without a sideways scroll
 * and nothing is rendered twice. Each row is its own <tbody>, headed by the
 * question (scope="rowgroup"), under the stage's Rankbox / SEObot columns.
 */
import { useEffect, useRef, useState } from "react";
import { Columns2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/landing/shared";
import { Accent, Band, LINE, SectionHead, Spacer } from "@/components/landing/frame";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { formatCheckedOn, type Competitor } from "@/data/alternatives";
import { StateMark } from "./atoms";
import { RANKBOX_TINT, STATE_LABEL } from "./tokens";

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function Legend() {
  return (
    <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {(["yes", "partial", "no"] as const).map((s) => (
        <li key={s} className="flex items-center gap-2 text-[0.8rem] text-muted-foreground">
          <span aria-hidden>
            <StateMark state={s} brand />
          </span>
          {STATE_LABEL[s]}
        </li>
      ))}
    </ul>
  );
}

export function Rows({ competitor }: { competitor: Competitor }) {
  const groups = competitor.matrix;
  const rowCount = groups.reduce((n, g) => n + g.rows.length, 0);
  const [active, setActive] = useState(0);
  const stages = useRef<(HTMLDivElement | null)[]>([]);

  // Light the last stage whose table has reached a line two-fifths of the
  // way down the screen. Read from positions on scroll rather than observer
  // crossings, so a jump (an anchor link, a fling) can't skip a stage.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let next = 0;
      stages.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) next = i;
      });
      setActive(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Columns2}
        eyebrow="Side by side"
        title={
          <span id="compare-title">
            Rankbox vs {competitor.name}, <Accent>in {rowCount} rows</Accent>
          </span>
        }
        subtitle={
          <>
            Every row is something a growth programme needs. Where {competitor.name} isn&rsquo;t
            built for one, we say what it <em>is</em> built for instead.
          </>
        }
      >
        <Legend />
      </SectionHead>

      <Band>
        <div className="grid lg:grid-cols-[15.5rem_minmax(0,1fr)]">
          <nav aria-label="Comparison stages" className={cn("hidden border-r lg:block", LINE)}>
            <ol className="sticky top-[calc(var(--top-chrome)+1.25rem)] space-y-0.5 px-4 py-6">
              {groups.map((g, i) => {
                const Icon = g.icon;
                const on = active === i;
                return (
                  <li key={g.group}>
                    <a
                      href={`#stage-${slug(g.group)}`}
                      aria-current={on ? "true" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[0.85rem] transition-colors duration-300",
                        on
                          ? "bg-cta-soft font-medium text-cta-hover"
                          : "text-muted-foreground hover:bg-ink/[0.03] hover:text-ink",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors duration-300",
                          on
                            ? "border-cta/30 bg-white text-brand-blue"
                            : "border-ink/[0.08] bg-white text-muted-foreground",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1 leading-snug">{g.group}</span>
                      <span className="text-[0.72rem] tabular-nums opacity-70">
                        {g.rows.length}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div>
            {groups.map((g, gi) => {
              const Icon = g.icon;
              const gid = `stage-${slug(g.group)}`;
              return (
                <div
                  key={g.group}
                  id={gid}
                  data-stage={gi}
                  ref={(el) => {
                    stages.current[gi] = el;
                  }}
                  className={cn("scroll-mt-20", gi > 0 && "border-t", LINE)}
                >
                  <Reveal y={12}>
                    <table className="w-full table-fixed border-collapse text-left">
                      <caption className="px-5 pb-3 pt-6 text-left sm:px-8">
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-[0.7rem] font-semibold tabular-nums text-muted-foreground">
                            {String(gi + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[1.02rem] font-medium tracking-tight text-ink">
                            {g.group}
                          </span>
                        </span>
                      </caption>
                      <thead>
                        <tr className={cn("border-t", LINE)}>
                          <th
                            scope="col"
                            id={`${gid}-rankbox`}
                            className={cn("px-5 py-2.5 sm:px-8", RANKBOX_TINT)}
                          >
                            <span className="flex items-center gap-2 text-[0.78rem] font-semibold text-ink">
                              <RankboxMark className="h-5 w-5" />
                              Rankbox
                            </span>
                          </th>
                          <th
                            scope="col"
                            id={`${gid}-them`}
                            className={cn("border-l px-5 py-2.5 sm:px-8", LINE)}
                          >
                            <span className="flex min-w-0 items-center gap-2 text-[0.78rem] font-semibold text-ink">
                              <CompetitorMark
                                competitor={competitor}
                                className="h-5 w-5 text-[0.45rem]"
                              />
                              <span className="truncate">{competitor.name}</span>
                            </span>
                          </th>
                        </tr>
                      </thead>
                      {g.rows.map((r, ri) => {
                        const rid = `${gid}-r${ri}`;
                        return (
                          <tbody key={r.label}>
                            <tr className={cn("border-t", LINE)}>
                              <th
                                id={rid}
                                scope="rowgroup"
                                colSpan={2}
                                className="px-5 pb-1.5 pt-4 font-normal sm:px-8"
                              >
                                <span className="block text-[0.92rem] font-medium text-ink sm:inline">
                                  {r.label}
                                </span>
                                <span className="mt-0.5 block text-[0.8rem] leading-snug text-muted-foreground sm:ml-2 sm:mt-0 sm:inline">
                                  {r.detail}
                                </span>
                              </th>
                            </tr>
                            <tr>
                              <td
                                headers={`${gid}-rankbox ${rid}`}
                                className={cn("px-5 pb-4 pt-2 align-top sm:px-8", RANKBOX_TINT)}
                              >
                                <span className="flex gap-2.5">
                                  <StateMark state={r.rankbox.state} brand />
                                  <span className="text-[0.82rem] leading-snug text-ink/85">
                                    {r.rankbox.note}
                                  </span>
                                </span>
                              </td>
                              <td
                                headers={`${gid}-them ${rid}`}
                                className={cn("border-l px-5 pb-4 pt-2 align-top sm:px-8", LINE)}
                              >
                                <span className="flex gap-2.5">
                                  <StateMark state={r.them.state} />
                                  <span
                                    className={cn(
                                      "text-[0.82rem] leading-snug",
                                      r.them.state === "no"
                                        ? "text-muted-foreground"
                                        : "text-ink/85",
                                    )}
                                  >
                                    {r.them.note}
                                  </span>
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}
                    </table>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </Band>

      <Band inner="px-5 py-4 text-center sm:px-8">
        <p className="mx-auto max-w-3xl text-[0.78rem] leading-relaxed text-muted-foreground">
          Compiled from {competitor.name}&rsquo;s public documentation and pricing pages, last
          reviewed {formatCheckedOn(competitor.pricing.checkedOn)}. Products change — check theirs
          before you decide, and tell us if we have a row wrong.
        </p>
      </Band>
    </section>
  );
}
