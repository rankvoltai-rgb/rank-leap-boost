/**
 * The page's focal picture: the entry's own one-line argument ("Frase closes
 * the on-page loop. Rankbox adds the off-page one.") drawn as a figure of
 * eight. The on-page loop (find, write, ship, measure) is the larger ring on
 * the left; the off-page loop (backlinks, Reddit) is the smaller one on the
 * right; they cross where an article ships. Every station shows one dot per
 * matrix row for each product, so a station where Frase is ahead (measuring)
 * shows it as plainly as one where Rankbox is.
 *
 * While about half on screen it walks the story: the on-page loop draws with
 * a dash running round it, then the off-page loop, then both rest drawn. With
 * reduced motion, on the server and off screen it rests on that last frame.
 * Below `lg` the same stations stack as two loops side by side or one above
 * the other.
 */
import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowDown, CornerLeftUp, Infinity as InfinityIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accent, Band, CELL, CellGrid, PANEL, SectionHead } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import type { CellState, Competitor } from "@/data/alternatives";
import { CompetitorMark, RankboxMark } from "../kit";
import { EASE, useLoopStory } from "./clock";
import { LOOP_LABEL, OFF_PATH, ON_PATH, VIEW, stations, type LoopId, type Station } from "./model";
import { CARD, keepHyphens, sentences } from "./helpers";
import { Pip } from "./ui";

const STORY = [4400, 4400, 5600] as const;
const PHASES: { id: LoopId | "both"; label: string }[] = [
  { id: "on", label: LOOP_LABEL.on.text },
  { id: "off", label: LOOP_LABEL.off.text },
  { id: "both", label: "Both loops" },
];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function ProductLine({
  mark,
  name,
  states,
  tone,
}: {
  mark: ReactNode;
  name: string;
  states: CellState[];
  tone: "rankbox" | "them";
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex min-w-0 items-center gap-1.5">
        {mark}
        <span className="truncate text-[0.7rem] font-medium text-ink/75">{name}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        {states.map((s, i) => (
          <Pip key={i} state={s} tone={tone} />
        ))}
      </span>
    </div>
  );
}

function StationCard({
  s,
  competitor,
  focus,
  className,
  style,
}: {
  s: Station;
  competitor: Competitor;
  /** "on" when its loop is the one being shown, "off" when another is. */
  focus: "lit" | "dim" | "rest";
  className?: string;
  style?: CSSProperties;
}) {
  const Icon = s.icon;
  const lit = focus === "lit";
  return (
    <div
      style={style}
      className={cn(
        CARD,
        "p-3 transition-[opacity,border-color,box-shadow] duration-500 motion-reduce:transition-none",
        lit &&
          "border-cta/40 shadow-[0_0_0_4px_rgba(22,111,229,0.08),0_22px_44px_-26px_rgba(16,24,40,0.34)]",
        focus === "dim" && "opacity-45",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-500",
            lit ? "bg-cta text-white" : "bg-cta-soft text-brand-blue",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="text-[0.78rem] font-semibold leading-tight text-ink">{s.title}</span>
      </div>
      <div className="mt-2.5 space-y-1.5 border-t border-ink/[0.06] pt-2.5">
        <ProductLine
          mark={<RankboxMark className="h-4 w-4" />}
          name="Rankbox"
          states={s.rows.map((r) => r.rankbox.state)}
          tone="rankbox"
        />
        <ProductLine
          mark={<CompetitorMark competitor={competitor} className="h-4 w-4 text-[0.45rem]" />}
          name={competitor.name}
          states={s.rows.map((r) => r.them.state)}
          tone="them"
        />
      </div>
    </div>
  );
}

function focusOf(s: Station, shown: LoopId | "both"): "lit" | "dim" | "rest" {
  if (shown === "both") return "rest";
  return s.loops.includes(shown) ? "lit" : "dim";
}

/* ---------- the drawing, lg and up ---------- */

function Drawing({
  competitor,
  shown,
  moving,
  still,
}: {
  competitor: Competitor;
  shown: LoopId | "both";
  moving: boolean;
  still: boolean;
}) {
  const { on, junction, off } = stations(competitor);
  const all = [...on, ...(junction ? [junction] : []), ...off];
  const drawn = { on: shown !== "off", off: shown !== "on" };
  const draw = (loop: LoopId) => ({
    pathLength: drawn[loop] ? 1 : 0,
    opacity: drawn[loop] ? 1 : 0,
  });
  const t = { duration: still ? 0 : 1.3, ease: EASE };

  return (
    <div className="relative mx-auto aspect-[2/1] w-full max-w-[1000px]">
      <svg
        aria-hidden
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        fill="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <path d={ON_PATH} className="stroke-ink/[0.12]" strokeWidth={1.5} />
        <path d={OFF_PATH} className="stroke-ink/[0.12]" strokeWidth={1.5} strokeDasharray="4 6" />
        <motion.path
          d={ON_PATH}
          className="stroke-cta"
          strokeWidth={2.25}
          strokeLinecap="round"
          initial={false}
          animate={draw("on")}
          transition={t}
        />
        <motion.path
          d={OFF_PATH}
          className="stroke-cta"
          strokeWidth={2.25}
          strokeLinecap="round"
          initial={false}
          animate={draw("off")}
          transition={t}
        />
        {moving && shown !== "both" && (
          <motion.path
            key={shown}
            d={shown === "on" ? ON_PATH : OFF_PATH}
            className="stroke-cta"
            strokeWidth={6}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(22,111,229,0.5))" }}
            initial={{ pathLength: 0.05, pathOffset: 0, opacity: 0 }}
            animate={{ pathOffset: 0.95, opacity: 1 }}
            transition={{
              pathOffset: {
                duration: shown === "on" ? 3.4 : 2.4,
                ease: "linear",
                repeat: Infinity,
              },
              opacity: { duration: 0.4, delay: 0.5 },
            }}
          />
        )}
      </svg>

      {(Object.keys(LOOP_LABEL) as LoopId[]).map((id) => {
        const l = LOOP_LABEL[id];
        const lit = shown === id;
        return (
          <span
            key={id}
            aria-hidden
            style={{ left: pct(l.x, VIEW.w), top: pct(l.y, VIEW.h) }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border bg-white/85 px-2 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] backdrop-blur-sm transition-colors duration-500",
              lit ? "border-cta/30 text-cta" : "border-ink/[0.08] text-muted-foreground",
            )}
          >
            {l.text}
          </span>
        );
      })}

      {all.map((s) => (
        <StationCard
          key={s.key}
          s={s}
          competitor={competitor}
          focus={focusOf(s, shown)}
          className="absolute w-[12.5rem] -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(s.x, VIEW.w), top: pct(s.y, VIEW.h) }}
        />
      ))}
    </div>
  );
}

/* ---------- the same stations, stacked, below lg ---------- */

function LoopColumn({
  id,
  list,
  competitor,
  shown,
}: {
  id: LoopId;
  list: Station[];
  competitor: Competitor;
  shown: LoopId | "both";
}) {
  const lit = shown === id;
  const first = list[0];
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white/60 p-3 transition-[border-color,opacity] duration-500 sm:p-4",
        lit ? "border-cta/35" : "border-ink/[0.07]",
      )}
    >
      <p
        className={cn(
          "flex items-center gap-2 px-1 pb-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-500",
          lit ? "text-cta" : "text-muted-foreground",
        )}
      >
        <InfinityIcon aria-hidden className="h-3.5 w-3.5" />
        {LOOP_LABEL[id].text}
      </p>
      <ol className="space-y-0">
        {list.map((s, i) => (
          <li key={s.key}>
            {i > 0 && (
              <span aria-hidden className="flex justify-center py-1.5 text-ink/30">
                <ArrowDown className="h-3.5 w-3.5" />
              </span>
            )}
            <StationCard s={s} competitor={competitor} focus={focusOf(s, shown)} />
          </li>
        ))}
      </ol>
      {first && (
        <p className="flex items-center gap-1.5 px-1 pt-2.5 text-[0.72rem] text-muted-foreground">
          <CornerLeftUp aria-hidden className="h-3.5 w-3.5" />
          {first.title}
        </p>
      )}
    </div>
  );
}

/* ---------- the section ---------- */

export function LoopsSection({ competitor }: { competitor: Competitor }) {
  const p = competitor.positioning;
  const [lead, ...tail] = sentences(p.title);
  const { ref, phase, still, moving, pin } = useLoopStory<HTMLDivElement>(STORY);
  const shown = PHASES[phase].id;
  const { on, junction, off } = stations(competitor);

  const onList = [...on.slice(0, 2), ...(junction ? [junction] : []), ...on.slice(2)];
  const offList = [...(junction ? [junction] : []), ...off];
  const label = `${p.title} ${LOOP_LABEL.on.text}: ${onList.map((s) => s.title).join(", ")}. ${LOOP_LABEL.off.text}: ${offList.map((s) => s.title).join(", ")}. Each station shows, for Rankbox and ${competitor.name}, one mark per row of the full comparison below.`;

  return (
    <section aria-labelledby="loops-title">
      <SectionHead
        icon={InfinityIcon}
        eyebrow="The real difference"
        title={
          <span id="loops-title">
            {tail.length ? (
              <>
                {keepHyphens(lead)} <Accent>{keepHyphens(tail.join(" "))}</Accent>
              </>
            ) : (
              <Accent>{keepHyphens(p.title)}</Accent>
            )}
          </span>
        }
        subtitle={p.body}
      >
        <div
          role="group"
          aria-label="Show one loop"
          className="mt-8 inline-flex rounded-lg border border-ink/[0.08] bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
        >
          {PHASES.map((ph, i) => (
            <button
              key={ph.id}
              type="button"
              aria-pressed={phase === i}
              onClick={() => pin(i)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[0.8rem] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                phase === i ? "bg-cta-soft text-cta" : "text-muted-foreground hover:text-ink",
              )}
            >
              {ph.label}
            </button>
          ))}
        </div>
      </SectionHead>

      <Band inner={cn(PANEL, "overflow-hidden px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12")}>
        {/* A faint dot field, so the white stations sit on a surface. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--ink)_9%,transparent)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_70%_75%_at_50%_50%,#000_30%,transparent_100%)]"
        />
        <div ref={ref} role="img" aria-label={label} className="relative">
          <div className="hidden lg:block">
            <Drawing competitor={competitor} shown={shown} moving={moving} still={still} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:hidden">
            <LoopColumn id="on" list={onList} competitor={competitor} shown={shown} />
            <LoopColumn id="off" list={offList} competitor={competitor} shown={shown} />
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.75rem] text-muted-foreground lg:mt-4">
          {(["yes", "partial", "no"] as const).map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <Pip state={s} tone="them" />
              {s === "yes" ? "Included" : s === "partial" ? "Partly" : "Not its focus"}
            </span>
          ))}
          <span>
            One dot per row of the{" "}
            <a
              href="#compare"
              className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
            >
              full comparison
            </a>
            ; Rankbox&rsquo;s in blue
          </span>
        </div>
      </Band>

      <Band>
        <CellGrid className="md:grid-cols-2">
          <li className={cn(CELL, "p-6 sm:p-8 lg:p-10")}>
            <Reveal>
              <div className="flex items-center gap-3">
                <CompetitorMark competitor={competitor} className="h-9 w-9" />
                <div>
                  <h3 className="text-[0.95rem] font-semibold text-ink">{p.themTitle}</h3>
                  <p className="text-xs text-muted-foreground">{competitor.category}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3.5">
                {p.them.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.92rem] leading-snug text-ink/80">
                    <span
                      aria-hidden
                      className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
          <li
            className={cn(CELL, "bg-[color-mix(in_oklab,var(--cta)_4%,white)] p-6 sm:p-8 lg:p-10")}
          >
            <Reveal delay={0.06}>
              <div className="flex items-center gap-3">
                <RankboxMark className="h-9 w-9" />
                <div>
                  <h3 className="text-[0.95rem] font-semibold text-ink">{p.rankboxTitle}</h3>
                  {p.rankboxTag && <p className="text-xs text-muted-foreground">{p.rankboxTag}</p>}
                </div>
              </div>
              <ul className="mt-6 space-y-3.5">
                {p.rankbox.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.92rem] leading-snug text-ink">
                    <span
                      aria-hidden
                      className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-cta"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        </CellGrid>
      </Band>
    </section>
  );
}
