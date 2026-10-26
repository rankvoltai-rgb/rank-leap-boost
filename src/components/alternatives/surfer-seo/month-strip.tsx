/**
 * The page's focal picture: one month, drawn as tiles.
 *
 * What makes this comparison unusual is that the volume is the same. Surfer
 * sells documents by the year, and 360 on Standard comes to about 30 a month;
 * Rankbox's plan is 30 articles a month. So the picture holds the number
 * still and shows what each tile *is*: on the Rankbox lane an article that
 * arrives written, checked, and delivered on the cadence; on the Surfer lane
 * a document in the editor, with a pointer over it, because a person opens
 * the editor each time. Every caption is read from the competitor's data.
 *
 * The month runs only while the card is about half on screen, starts over
 * when it comes back, and with reduced motion holds the full month.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "motion/react";
import { CalendarClock, CalendarDays, Check, MousePointer2, Send } from "lucide-react";
import { Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { PLAN, formatUsd } from "@/data/pricing";
import { cn } from "@/lib/utils";
import {
  RANKBOX_CELLS,
  RANKBOX_COST,
  RANKBOX_SNAPSHOT,
  costPerArticle,
  type Competitor,
} from "@/data/alternatives";
import { Kicker } from "./ui";
import { accentLastSentence } from "./text";

/** Days in the drawn month. */
const DAYS = 30;
const STEP_MS = 150;
const START_MS = 700;
const HOLD_MS = 3200;

/** True for visitors who prefer reduced motion. False on the server and first paint. */
function useStill() {
  const [still, setStill] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return still;
}

/**
 * The day the month has reached. Starts on the full month, so the server
 * render (and anyone without JavaScript) sees the finished picture.
 */
function useMonth() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const still = useStill();
  const [day, setDay] = useState(DAYS);

  useEffect(() => {
    if (still) {
      setDay(DAYS);
      return;
    }
    setDay(0);
    if (!inView) return;
    let d = 0;
    let id = 0;
    const tick = () => {
      const wait = d >= DAYS ? HOLD_MS : d === 0 ? START_MS : STEP_MS;
      id = window.setTimeout(() => {
        d = d >= DAYS ? 0 : d + 1;
        setDay(d);
        tick();
      }, wait);
    };
    tick();
    return () => window.clearTimeout(id);
  }, [inView, still]);

  return { ref, day, live: !still && day > 0 && day < DAYS };
}

/* ---------- tiles ---------- */

function ArticleTile({ on, now }: { on: boolean; now: boolean }) {
  return (
    <span
      className={cn(
        "flex aspect-square items-center justify-center rounded-[3px] md:rounded-[5px] transition-[background-color,border-color,transform,box-shadow] duration-300",
        on
          ? "scale-100 bg-cta text-white"
          : "scale-90 border border-dashed border-ink/[0.16] bg-white",
        now && "shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_22%,transparent)]",
      )}
    >
      {on && <Check className="h-[58%] w-[58%]" strokeWidth={3.5} />}
    </span>
  );
}

function DocumentTile({ on, now }: { on: boolean; now: boolean }) {
  return (
    <span
      className={cn(
        "relative flex aspect-square flex-col items-center justify-center gap-[14%] rounded-[3px] md:rounded-[5px] transition-[background-color,border-color,transform] duration-300",
        on
          ? "scale-100 border border-ink/[0.28] bg-white"
          : "scale-90 border border-dashed border-ink/[0.16] bg-white",
      )}
    >
      {on && (
        <>
          <span className="h-px w-[52%] bg-ink/40" />
          <span className="h-px w-[52%] bg-ink/40" />
          <span className="h-px w-[34%] self-start bg-ink/40 [margin-left:24%]" />
        </>
      )}
      {now && (
        <MousePointer2 className="absolute -bottom-2 -right-2 z-10 h-3.5 w-3.5 fill-ink md:-bottom-2.5 md:-right-2.5 md:h-4.5 md:w-4.5 text-white drop-shadow-[0_1px_1px_rgba(16,24,40,0.25)]" />
      )}
    </span>
  );
}

/* ---------- one lane ---------- */

function Lane({
  mark,
  name,
  plan,
  count,
  day,
  live,
  tile,
  notes,
  price,
  unit,
  sum,
  keyed = false,
}: {
  mark: ReactNode;
  name: string;
  plan: string;
  count: number;
  day: number;
  live: boolean;
  tile: "article" | "document";
  notes: { icon: typeof Send; text: string }[];
  price: string;
  unit: string;
  sum: string;
  keyed?: boolean;
}) {
  const filled = Math.round((day * count) / DAYS);
  const Tile = tile === "article" ? ArticleTile : DocumentTile;
  return (
    <div
      className={cn(
        "px-5 py-6 sm:px-7 sm:py-7",
        keyed && "bg-[color-mix(in_oklab,var(--cta)_3.5%,white)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {mark}
          <div className="min-w-0">
            <p className="text-[0.95rem] font-semibold text-ink">{name}</p>
            <p className="text-[0.76rem] text-muted-foreground">{plan}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="flex items-baseline justify-end gap-1.5">
            <span
              className={cn(
                "font-display text-[1.45rem] font-medium tabular-nums tracking-[-0.02em] sm:text-[1.8rem]",
                keyed ? "text-brand-blue" : "text-ink",
              )}
            >
              {price}
            </span>
            <span className="text-[0.78rem] text-ink">{unit}</span>
          </p>
          <p className="text-[0.72rem] tabular-nums text-muted-foreground">{sum}</p>
        </div>
      </div>

      {/* Fifteen to a row on a phone, the whole month on one row from md. */}
      <div aria-hidden className="mt-5 grid grid-cols-15 gap-1.5 md:grid-cols-30 md:gap-[5px]">
        {Array.from({ length: count }, (_, i) => (
          <Tile key={i} on={i < filled} now={live && i === filled - 1} />
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-7">
        {notes.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-start gap-2 text-[0.8rem] leading-snug text-muted-foreground"
          >
            <Icon aria-hidden className="mt-[0.15em] h-3.5 w-3.5 shrink-0 text-ink/45" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- the card ---------- */

export function MonthStrip({ competitor }: { competitor: Competitor }) {
  const { ref, day, live } = useMonth();
  const c = competitor;
  const rows = c.matrix.flatMap((g) => g.rows);
  // Found by the shared Rankbox cell rather than by label, so a reworded row
  // can't break the lookup.
  const cadence = rows.find((r) => r.rankbox === RANKBOX_CELLS.autopilot);
  const theirCount = c.pricing.articles ?? DAYS;
  const theirEach = costPerArticle(c);

  return (
    <div
      ref={ref}
      className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_28px_56px_-32px_rgba(16,24,40,0.28)]"
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5 sm:px-7",
          LINE,
        )}
      >
        <span className="flex items-center gap-2 text-[0.85rem] font-medium text-ink">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
            <CalendarDays className="h-3.5 w-3.5" />
          </span>
          One month at {PLAN.articlesPerMonth}
        </span>
        <span aria-hidden className="flex items-center gap-3">
          <span className="text-[0.76rem] tabular-nums text-muted-foreground">
            Day <span className="font-semibold text-ink">{day}</span> of {DAYS}
          </span>
          <span className="relative h-1.5 w-24 overflow-hidden rounded-full bg-ink/[0.07] sm:w-32">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-cta transition-[width] duration-150 ease-linear"
              style={{ width: `${(day / DAYS) * 100}%` }}
            />
          </span>
        </span>
      </div>

      <Lane
        keyed
        mark={<RankboxMark className="h-9 w-9" />}
        name="Rankbox"
        plan={`${PLAN.name} · ${formatUsd(PLAN.monthly)}/mo`}
        count={PLAN.articlesPerMonth}
        day={day}
        live={live}
        tile="article"
        notes={[
          { icon: CalendarClock, text: RANKBOX_CELLS.autopilot.note },
          { icon: Send, text: RANKBOX_SNAPSHOT.publishing.short },
        ]}
        price={formatUsd(RANKBOX_COST.perArticle)}
        unit="an article"
        sum={`${formatUsd(PLAN.monthly)} ÷ ${PLAN.articlesPerMonth}`}
      />

      <div className={cn("border-t", LINE)}>
        <Lane
          mark={<CompetitorMark competitor={c} className="h-9 w-9" />}
          name={c.name}
          plan={`${c.pricing.plan} · ${formatUsd(c.pricing.monthly)}/mo`}
          count={theirCount}
          day={day}
          live={live}
          tile="document"
          notes={[
            ...(cadence ? [{ icon: CalendarClock, text: cadence.them.note }] : []),
            { icon: Send, text: c.snapshot.publishing.short },
          ]}
          price={theirEach !== null ? formatUsd(theirEach) : "—"}
          unit="a document"
          sum={`${formatUsd(c.pricing.monthly)} ÷ ${theirCount}`}
        />
      </div>

      <div
        aria-hidden
        className={cn(
          "flex flex-wrap items-center gap-x-6 gap-y-2 border-t px-5 py-3 text-[0.75rem] text-muted-foreground sm:px-7",
          LINE,
          PANEL,
        )}
      >
        <span className="flex items-center gap-2">
          <span className="w-3.5">
            <ArticleTile on now={false} />
          </span>
          Article, delivered
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3.5">
            <DocumentTile on now={false} />
          </span>
          Document, in the editor
        </span>
        <span className="flex items-center gap-2">
          <MousePointer2 className="h-3.5 w-3.5 fill-ink text-white drop-shadow-[0_1px_1px_rgba(16,24,40,0.25)]" />
          A person opens it
        </span>
      </div>
    </div>
  );
}

/* ---------- the section ---------- */

/* Positioning, told with the month: the title and intro are the data's own
   positioning lines, the card shows them, and the two "owns" lists close it. */
export function MonthSection({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const p = c.positioning;
  return (
    <section aria-labelledby="month-title">
      <Spacer />
      <SectionHead
        icon={CalendarDays}
        eyebrow="The real difference"
        title={<span id="month-title">{accentLastSentence(p.title)}</span>}
        subtitle={p.body}
      />
      <Band inner={PANEL}>
        <div className="px-3 py-10 sm:px-10 sm:py-14 lg:px-14">
          <Reveal y={24}>
            <MonthStrip competitor={c} />
          </Reveal>
          <p className="mx-auto mt-5 max-w-3xl text-center text-[0.78rem] leading-relaxed text-muted-foreground">
            {c.name} {c.pricing.plan}: {c.pricing.covers}.
          </p>
        </div>
      </Band>

      <Band>
        <div className="grid lg:grid-cols-2">
          <Owns
            keyed
            mark={<RankboxMark className="h-10 w-10" />}
            title={p.rankboxTitle}
            tag={p.rankboxTag ?? "An engine, not an editor"}
            items={p.rankbox}
          />
          <div className={cn("border-t lg:border-l lg:border-t-0", LINE)}>
            <Owns
              mark={<CompetitorMark competitor={c} className="h-10 w-10" />}
              title={p.themTitle}
              tag={c.category}
              items={p.them}
            />
          </div>
        </div>
      </Band>
    </section>
  );
}

function Owns({
  mark,
  title,
  tag,
  items,
  keyed = false,
}: {
  mark: ReactNode;
  title: string;
  tag: string;
  items: string[];
  keyed?: boolean;
}) {
  return (
    <Reveal
      className={cn(
        "h-full px-5 py-8 sm:px-10 sm:py-10 lg:px-12",
        keyed && "bg-[color-mix(in_oklab,var(--cta)_4%,white)]",
      )}
    >
      <div className="flex items-center gap-3">
        {mark}
        <div>
          <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">{title}</h3>
          <Kicker className="mt-0.5 normal-case tracking-normal">{tag}</Kicker>
        </div>
      </div>
      <ol className="mt-6">
        {items.map((item, i) => (
          <li
            key={item}
            className={cn(
              "flex items-start gap-3 border-t py-3 text-[0.92rem] leading-snug",
              LINE,
              keyed ? "text-ink" : "text-ink/80",
            )}
          >
            <span className="mt-[0.1em] w-5 shrink-0 text-[0.72rem] font-medium tabular-nums text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">{item}</span>
            {keyed && (
              <span className="mt-[0.1em] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                <Check aria-hidden className="h-2.5 w-2.5" strokeWidth={3.5} />
              </span>
            )}
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
