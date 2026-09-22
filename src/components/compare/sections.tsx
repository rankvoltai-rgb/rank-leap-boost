/**
 * A head-to-head page, built in the landing's language — blue pixel hero,
 * bordered cards, alternating surfaces — around one question: A or B?
 *
 * The order is the order a buyer's questions arrive in, and every section can
 * be read alone because answer engines lift chunks, not pages:
 *
 *   the call (hero verdict) → the facts (tale of the tape) → why (the rounds)
 *   → for me? (the picker) → the detail (matrix) → the cost (pricing)
 *   → neither? (the disclosed third option) → the rest (FAQ, sources).
 *
 * Both contenders get identical treatment: same tile, same surface, same
 * weight. The only emphasis on the page is a round's winner, earned per round.
 */
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleDollarSign,
  RotateCcw,
  Scale,
} from "lucide-react";
import { Md } from "@/components/ai-seo/kit";
import { FaqList, SourceList } from "@/components/ai-seo/sections";
import { PixelField, UrlForm } from "@/components/landing/Hero";
import { Eyebrow, Reveal } from "@/components/landing/shared";
import { COMPETITOR_SLUGS } from "@/data/alternatives";
import {
  RANKBOX_PRICE_LINE,
  RANKBOX_SHIPS,
  getCategory,
  matchupTitle,
  relatedMatchups,
  sidesOf,
  type Matchup,
} from "@/data/compare/matchups";
import { tallyOf } from "@/data/compare/entries";
import { scoreFinder } from "@/data/compare/finder";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Plan, ProductPricing, Round, Side, Winner } from "@/data/compare/types";
import { TRIAL_DAYS, formatUsd } from "@/data/pricing";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import {
  CELL_LEGEND,
  CellBadge,
  CellBody,
  FaceOff,
  ProductMark,
  RankboxTile,
  TrophyTag,
  WinnerChip,
  WinnerDot,
  jumpTo,
  useActiveSection,
} from "./kit";

const SIDES: Side[] = ["a", "b"];

/* ---------- shared ---------- */

function Heading({
  id,
  eyebrow,
  title,
  intro,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
      >
        {title}
      </h2>
      {intro && <p className="mt-4 text-balance text-lg text-muted-foreground">{intro}</p>}
    </Reveal>
  );
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** "Teams that…" → "teams that…", but "SEOs who…" stays as written. */
const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);

/**
 * The rounds as a row of winner marks — wins for A, then draws, then wins for
 * B — so the score reads without either side needing a colour of its own.
 */
function RoundPips({ rounds, sides }: { rounds: Round[]; sides: Record<Side, Product> }) {
  const order: Winner[] = ["a", "draw", "b"];
  const sorted = [...rounds].sort((x, y) => order.indexOf(x.winner) - order.indexOf(y.winner));
  return (
    <span className="flex items-center gap-1" aria-hidden>
      {sorted.map((r) => (
        <WinnerDot key={r.id} winner={r.winner} sides={sides} />
      ))}
    </span>
  );
}

function tallyLabel(tally: Record<Winner, number>, sides: Record<Side, Product>): string {
  const draws = tally.draw ? `, ${plural(tally.draw, "draw")}` : "";
  return `${sides.a.name} ${tally.a}, ${sides.b.name} ${tally.b}${draws}`;
}

/* ---------- 1. Hero ---------- */

export function MatchupHero({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const category = getCategory(matchup.category);
  const tally = tallyOf(entry.rounds);

  return (
    <section
      id="top"
      aria-labelledby="vs-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-5xl px-5 pb-16 pt-10 sm:pb-20 lg:pt-12">
        <Reveal>
          <nav aria-label="Breadcrumb" className="flex justify-center">
            <ol className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium text-white/65">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                <Link to="/compare" className="transition-colors hover:text-white">
                  Compare
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li aria-current="page" className="text-white">
                {matchupTitle(matchup)}
              </li>
            </ol>
          </nav>
        </Reveal>

        <div className="mt-10 flex flex-col items-center text-center">
          <FaceOff a={sides.a} b={sides.b} onDark />

          <Reveal delay={0.08}>
            <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              {category.name} · 2026 head-to-head
            </span>
          </Reveal>

          <Reveal delay={0.12}>
            <h1
              id="vs-title"
              className="mt-5 font-display text-balance text-[2.5rem] font-bold leading-[1.04] tracking-tight sm:text-[3.5rem] xl:text-[4rem]"
            >
              {sides.a.name} <span className="font-semibold text-white/55">vs</span> {sides.b.name}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-white/80">
              {entry.subhead}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.8rem] font-medium text-white/65">
              <span>
                Updated{" "}
                <time dateTime={matchup.updated} className="text-white">
                  {formatDate(matchup.updated)}
                </time>
              </span>
              <span aria-hidden>·</span>
              <span>{plural(entry.rounds.length, "round")}</span>
              <span aria-hidden>·</span>
              <a href="#sources" className="underline-offset-4 hover:text-white hover:underline">
                {plural(entry.sources.length, "cited source")}
              </a>
            </p>
          </Reveal>
        </div>

        {/* The verdict, on a card — the page's answer, above the fold. */}
        <Reveal delay={0.24} y={24}>
          <div className="mt-12 overflow-hidden rounded-3xl bg-card text-ink shadow-2xl shadow-brand-blue-deep/40">
            <div className="p-6 sm:p-9">
              <h2 className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-volt">
                <Scale className="h-3.5 w-3.5" aria-hidden />
                The short answer
              </h2>
              <p className="mt-4 text-[1.05rem] leading-[1.7] text-ink sm:text-[1.18rem]">
                <Md text={entry.shortAnswer} />
              </p>
            </div>

            <div className="grid border-t border-border sm:grid-cols-2">
              {SIDES.map((side) => (
                <div
                  key={side}
                  className={cn(
                    "p-6 sm:p-8",
                    side === "b" && "border-t border-border sm:border-l sm:border-t-0",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <ProductMark product={sides[side]} className="h-9 w-9 text-sm" />
                    <h3 className="text-[0.95rem] font-semibold text-ink">
                      Choose {sides[side].name} if&hellip;
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {entry.picks[side].map((p) => (
                      <li key={p} className="flex gap-2.5 text-[0.93rem] leading-snug text-ink/85">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-success"
                          strokeWidth={3}
                          aria-hidden
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-border bg-surface/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-9">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Rounds won
                </span>
                <span className="sr-only">{tallyLabel(tally, sides)}</span>
                {/* Names on wide screens; on a phone the marks carry them, so
                    the score stays on one line. */}
                <span aria-hidden className="flex items-center gap-2.5 text-sm font-semibold">
                  <span className="flex items-center gap-1.5 tabular-nums">
                    <ProductMark product={sides.a} className="h-5 w-5 text-[0.5rem] sm:hidden" />
                    <span className="hidden sm:inline">{sides.a.name}</span> {tally.a}
                  </span>
                  <RoundPips rounds={entry.rounds} sides={sides} />
                  <span className="flex items-center gap-1.5 tabular-nums">
                    {tally.b} <span className="hidden sm:inline">{sides.b.name}</span>
                    <ProductMark product={sides.b} className="h-5 w-5 text-[0.5rem] sm:hidden" />
                  </span>
                </span>
              </p>
              <a
                href="#rounds"
                onClick={(e) => jumpTo(e, "rounds")}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-volt"
              >
                See every round
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 2. Tale of the tape ---------- */

/* Mirrored like a fight card: each product's value faces the other across the
   label. A real table, because that's what it is — and what answer engines
   parse best. */
export function TaleOfTheTape({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <section aria-labelledby="tape-title" className="border-b border-border bg-card py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-5">
        <Heading id="tape-title" eyebrow="Tale of the tape" title="The facts, side by side" />
        <Reveal delay={0.08}>
          <table className="mt-10 w-full table-fixed border-collapse">
            <caption className="sr-only">
              {sides.a.name} and {sides.b.name} at a glance
            </caption>
            <thead>
              <tr>
                <th scope="col" className="pb-4 pr-3 text-right">
                  <span className="inline-flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-ink sm:text-base">
                      {sides.a.name}
                    </span>
                    <ProductMark product={sides.a} className="h-8 w-8 text-xs" />
                  </span>
                </th>
                <th scope="col" className="w-[5.5rem] pb-4 sm:w-44">
                  <span className="sr-only">Attribute</span>
                </th>
                <th scope="col" className="pb-4 pl-3 text-left">
                  <span className="inline-flex items-center gap-2.5">
                    <ProductMark product={sides.b} className="h-8 w-8 text-xs" />
                    <span className="text-sm font-semibold text-ink sm:text-base">
                      {sides.b.name}
                    </span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {entry.tape.map((row) => (
                <tr key={row.label} className="border-t border-border">
                  <td className="py-4 pr-3 text-right align-middle text-[0.88rem] font-medium leading-snug text-ink sm:text-[0.98rem]">
                    {row.a}
                  </td>
                  <th
                    scope="row"
                    className="px-1 py-4 text-center align-middle text-[0.6rem] font-semibold uppercase leading-snug tracking-[0.12em] text-muted-foreground sm:text-[0.66rem]"
                  >
                    {row.label}
                  </th>
                  <td className="py-4 pl-3 text-left align-middle text-[0.88rem] font-medium leading-snug text-ink sm:text-[0.98rem]">
                    {row.b}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 3. The rounds ---------- */

function Scorecard({
  rounds,
  sides,
  active,
}: {
  rounds: Round[];
  sides: Record<Side, Product>;
  active: string | null;
}) {
  const tally = tallyOf(rounds);
  return (
    <nav aria-label="Rounds" className="rounded-2xl border border-border bg-card p-5 shadow-1">
      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Scorecard
      </p>
      <div className="mt-4 flex items-end justify-between gap-2">
        {SIDES.map((side, i) => (
          <div
            key={side}
            className={cn("flex flex-col gap-1.5", i === 0 ? "items-start" : "order-3 items-end")}
          >
            <ProductMark product={sides[side]} className="h-9 w-9 text-sm" />
            <span className="font-display text-3xl font-bold leading-none tabular-nums text-ink">
              {tally[side]}
            </span>
          </div>
        ))}
        <span className="order-2 pb-1 text-center text-[0.7rem] font-medium text-muted-foreground">
          {tally.draw ? plural(tally.draw, "draw") : "no draws"}
        </span>
      </div>
      <ol className="mt-5 space-y-0.5 border-t border-border pt-3">
        {rounds.map((r, i) => {
          const on = active === r.id;
          return (
            <li key={r.id}>
              <a
                href={`#${r.id}`}
                onClick={(e) => jumpTo(e, r.id)}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.8rem] leading-snug transition-colors",
                  on ? "bg-surface font-semibold text-ink" : "text-muted-foreground hover:text-ink",
                )}
              >
                <span className="w-3.5 shrink-0 text-[0.7rem] tabular-nums">{i + 1}</span>
                <span className="min-w-0 flex-1">{r.title}</span>
                <WinnerDot winner={r.winner} sides={sides} />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function RoundCard({
  round,
  index,
  sides,
}: {
  round: Round;
  index: number;
  sides: Record<Side, Product>;
}) {
  return (
    <article
      id={round.id}
      aria-labelledby={`${round.id}-title`}
      className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-1 sm:p-8"
    >
      {/* The chip shares the eyebrow's line rather than the title's, so it
          sits in the same place at every width instead of wrapping under
          long titles on a phone. */}
      <header>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-volt tabular-nums">
            Round {index + 1}
          </p>
          <WinnerChip winner={round.winner} sides={sides} />
        </div>
        <h3
          id={`${round.id}-title`}
          className="mt-2 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl"
        >
          {round.title}
        </h3>
      </header>

      <p className="mt-4 text-[1.02rem] leading-relaxed text-ink">
        <Md text={round.verdict} />
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {SIDES.map((side) => {
          const won = round.winner === side;
          return (
            <div
              key={side}
              className={cn(
                "rounded-xl border p-4 sm:p-5",
                won ? "border-brand-blue/25 bg-brand-blue/[0.04]" : "border-border bg-surface/40",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ProductMark product={sides[side]} className="h-6 w-6 text-[0.6rem]" />
                  <p className="text-sm font-semibold text-ink">{sides[side].name}</p>
                </div>
                {won && <TrophyTag />}
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                <Md text={round[side]} />
              </p>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export function Rounds({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const ids = useMemo(() => entry.rounds.map((r) => r.id), [entry.rounds]);
  const active = useActiveSection(ids);
  const tally = tallyOf(entry.rounds);

  return (
    <section id="rounds" aria-labelledby="rounds-title" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="rounds-title"
          eyebrow="Round by round"
          title={`${entry.rounds.length} rounds, one call each`}
          intro="Every round names a winner and says why. Where the gap is too small to decide anything, it's a draw."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Scorecard rounds={entry.rounds} sides={sides} active={active} />
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            {/* Phones get the score without the rail. */}
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-1 lg:hidden">
              <span className="sr-only">{tallyLabel(tally, sides)}</span>
              <span
                aria-hidden
                className="flex items-center gap-2 font-display text-xl font-bold tabular-nums"
              >
                <ProductMark product={sides.a} className="h-7 w-7 text-xs" />
                {tally.a}
              </span>
              <span aria-hidden>
                <RoundPips rounds={entry.rounds} sides={sides} />
              </span>
              <span
                aria-hidden
                className="flex items-center gap-2 font-display text-xl font-bold tabular-nums"
              >
                {tally.b}
                <ProductMark product={sides.b} className="h-7 w-7 text-xs" />
              </span>
            </div>

            {entry.rounds.map((r, i) => (
              <Reveal key={r.id} delay={0.03}>
                <RoundCard round={r} index={i} sides={sides} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. Which one fits you? ---------- */

export function Finder({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const result = scoreFinder(entry.finder, answers);
  const complete = result.answered === result.total;

  return (
    <section
      id="fit"
      aria-labelledby="fit-title"
      className="scroll-mt-20 border-y border-border bg-surface/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="fit-title"
          eyebrow="Your situation"
          title="Which one fits you?"
          intro="Three questions. The pick updates as you answer, and tells you why."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
          <div className="space-y-8">
            {entry.finder.map((q, qi) => (
              <fieldset key={q.id}>
                <legend className="flex gap-2.5 text-base font-semibold text-ink">
                  <span className="tabular-nums text-volt">{qi + 1}.</span>
                  {q.question}
                </legend>
                <div
                  className={cn(
                    "mt-3 grid gap-2",
                    q.options.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3",
                  )}
                >
                  {q.options.map((o, oi) => (
                    <label
                      key={o.label}
                      className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium leading-snug text-ink shadow-1 transition-all hover:border-ink/25 has-[:checked]:border-brand-blue has-[:checked]:bg-brand-blue/[0.05] has-[:checked]:ring-2 has-[:checked]:ring-brand-blue/15 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-volt"
                    >
                      <input
                        type="radio"
                        name={`${matchup.slug}-${q.id}`}
                        checked={answers[q.id] === oi}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-ink/25 transition-colors peer-checked:border-brand-blue peer-checked:bg-brand-blue"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            {/* On a phone the result card sits below the questions, out of
                sight while you answer. This bar rides the bottom of the screen
                through the questions and settles above the card. */}
            {result.pick && (
              <a
                href="#fit-result"
                onClick={(e) => jumpTo(e, "fit-result")}
                className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-background shadow-3 lg:hidden"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  {result.pick === "a" || result.pick === "b" ? (
                    <ProductMark product={sides[result.pick]} className="h-6 w-6 text-[0.6rem]" />
                  ) : result.pick === "rankbox" ? (
                    <RankboxTile className="h-6 w-6" />
                  ) : null}
                  <span className="truncate">
                    {complete ? "Your pick" : "Leaning"}:{" "}
                    {result.pick === "tie"
                      ? "either one"
                      : result.pick === "rankbox"
                        ? "possibly neither"
                        : sides[result.pick].name}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-background/70">
                  Why
                  <ArrowDown className="h-4 w-4" aria-hidden />
                </span>
              </a>
            )}
          </div>

          <div id="fit-result" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
            <div
              aria-live="polite"
              className="rounded-3xl border border-border bg-card p-6 shadow-2 sm:p-7"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {complete ? "Your pick" : result.pick ? "Leaning toward" : "Your pick"}
                </p>
                <span
                  className="flex items-center gap-1"
                  aria-label={`${result.answered} of ${result.total} answered`}
                >
                  {entry.finder.map((q) => (
                    <span
                      key={q.id}
                      className={cn(
                        "h-1.5 w-5 rounded-full transition-colors",
                        answers[q.id] !== undefined ? "bg-brand-blue" : "bg-border",
                      )}
                    />
                  ))}
                </span>
              </div>

              <FinderResultBody pick={result.pick} sides={sides} />

              {result.reasons.length > 0 && (
                <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                  {result.reasons.map((r) => (
                    <li key={r} className="flex gap-2.5 text-sm leading-snug text-ink/85">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-success"
                        strokeWidth={3}
                        aria-hidden
                      />
                      {r}
                    </li>
                  ))}
                </ul>
              )}

              {result.answered > 0 && (
                <button
                  type="button"
                  onClick={() => setAnswers({})}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-ink"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  Start over
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinderResultBody({
  pick,
  sides,
}: {
  pick: ReturnType<typeof scoreFinder>["pick"];
  sides: Record<Side, Product>;
}) {
  if (pick === null) {
    return (
      <div className="mt-6 flex flex-col items-center py-4 text-center">
        <FaceOff a={sides.a} b={sides.b} size="sm" />
        <p className="mt-5 max-w-[15rem] text-sm leading-relaxed text-muted-foreground">
          Answer the questions and the better fit for your situation shows up here.
        </p>
      </div>
    );
  }

  if (pick === "tie") {
    return (
      <div className="mt-5">
        <div className="flex -space-x-2">
          <ProductMark product={sides.a} className="h-12 w-12 text-lg ring-2 ring-card" />
          <ProductMark product={sides.b} className="h-12 w-12 text-lg ring-2 ring-card" />
        </div>
        <p className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">
          Either will do
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          What you&rsquo;ve told us fits both equally. Start with whichever trial is easier to get,
          and judge it on your own content.
        </p>
      </div>
    );
  }

  if (pick === "rankbox") {
    return (
      <div className="mt-5">
        <RankboxTile className="h-12 w-12" />
        <p className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">
          Possibly neither
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Both are built around someone doing the work in the tool. If nobody will, a system that
          writes and delivers the articles fits better. We make one, so weigh that.
        </p>
        <a
          href="#third-option"
          onClick={(e) => jumpTo(e, "third-option")}
          className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-volt"
        >
          See the third option
          <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </a>
      </div>
    );
  }

  const p = sides[pick];
  return (
    <div className="mt-5">
      <ProductMark product={p} className="h-12 w-12 text-lg" />
      <p className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">{p.name}</p>
      <p className="mt-1 text-sm text-muted-foreground">{p.kind}</p>
      <a
        href={`https://${p.domain}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-volt"
      >
        Visit {p.domain}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

/* ---------- 5. Feature matrix ---------- */

/* One DOM, two shapes, like the /alternatives matrix: each row is a grid that
   collapses from three columns to a card on a phone, so the text is never
   shipped twice. Unlike that matrix, neither column is tinted — this page has
   no home team. */
export function FeatureMatrix({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const rowCount = entry.matrix.reduce((n, g) => n + g.rows.length, 0);

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="features-title"
          eyebrow="Feature by feature"
          title={`Everything else, in ${rowCount} rows`}
          intro="Where a product isn't built for something, the cell says what it's built for instead."
        />
        <Reveal>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {CELL_LEGEND.map((l) => (
              <span key={l.state} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span aria-hidden>
                  <CellBadge state={l.state} />
                </span>
                {l.label}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.06} className="mt-12">
          <div className="sticky top-[var(--top-chrome)] z-20 hidden lg:block">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] overflow-hidden rounded-t-2xl border border-border bg-card/90 backdrop-blur-md">
              <div className="flex items-center px-6 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Capability
                </span>
              </div>
              {SIDES.map((side) => (
                <div
                  key={side}
                  className="flex items-center gap-2.5 border-l border-border px-5 py-4"
                >
                  <ProductMark product={sides[side]} className="h-8 w-8 text-xs" />
                  <span className="text-sm font-semibold text-ink">{sides[side].name}</span>
                </div>
              ))}
            </div>
          </div>

          {entry.matrix.map((g, gi) => (
            <div
              key={g.group}
              className={cn(
                "lg:border-x lg:border-border",
                // Clip the square row corners to the block's rounded bottom.
                gi === entry.matrix.length - 1 && "lg:overflow-hidden lg:rounded-b-2xl lg:border-b",
              )}
            >
              <h3 className="mb-3 pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-ink lg:mb-0 lg:border-y lg:border-border lg:bg-surface/70 lg:px-6 lg:py-3">
                {g.group}
              </h3>
              {g.rows.map((row, ri) => (
                <div
                  key={row.label}
                  className={cn(
                    "mb-3 grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card",
                    "lg:mb-0 lg:grid-cols-[1.1fr_1fr_1fr] lg:rounded-none lg:border-x-0 lg:border-b-0 lg:transition-colors lg:hover:bg-surface/40",
                    ri === 0 ? "lg:border-t-0" : "lg:border-t",
                  )}
                >
                  <p className="px-5 pb-1 pt-5 text-sm font-semibold text-ink lg:px-6 lg:py-5">
                    {row.label}
                  </p>
                  {SIDES.map((side) => (
                    <div
                      key={side}
                      className={cn(
                        "px-5 lg:border-l lg:border-border lg:px-5 lg:py-5",
                        side === "a" ? "py-3" : "pb-5 pt-0",
                      )}
                    >
                      <div className="rounded-xl border border-border p-3.5 lg:rounded-none lg:border-0 lg:p-0">
                        <div className="mb-2 flex items-center gap-2 lg:hidden">
                          <ProductMark product={sides[side]} className="h-5 w-5 text-[0.55rem]" />
                          <span className="text-xs font-semibold text-ink">{sides[side].name}</span>
                        </div>
                        <CellBody cell={row[side]} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 6. Pricing ---------- */

function entryPrice(p: ProductPricing): { monthly: number; annual?: number } | null {
  // A free tier isn't a starting price: it's the trial line's job to say so.
  const priced = p.plans.filter(
    (pl): pl is Plan & { monthly: number } =>
      pl.monthly !== null && pl.monthly > 0 && !pl.forAgencies,
  );
  if (priced.length === 0) return null;
  const cheapest = priced.reduce((x, y) => (y.monthly < x.monthly ? y : x));
  return { monthly: cheapest.monthly, annual: cheapest.annual };
}

function PlanList({ plans, className }: { plans: Plan[]; className?: string }) {
  return (
    <ul className={cn("divide-y divide-border border-y border-border", className)}>
      {plans.map((pl) => (
        <li key={pl.name} className="flex items-start justify-between gap-4 py-3.5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">{pl.name}</p>
            <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{pl.includes}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold tabular-nums text-ink">
              {pl.monthly === null
                ? "Custom"
                : pl.monthly === 0
                  ? "Free"
                  : `${formatUsd(pl.monthly)}/mo`}
            </p>
            {pl.annual !== undefined && pl.monthly !== null && pl.annual < pl.monthly && (
              <p className="mt-0.5 text-[0.7rem] tabular-nums text-muted-foreground">
                {formatUsd(pl.annual)}/mo yearly
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function PriceCard({ product, pricing }: { product: Product; pricing: ProductPricing }) {
  const from = entryPrice(pricing);
  const brandPlans = pricing.plans.filter((pl) => !pl.forAgencies);
  const agencyPlans = pricing.plans.filter((pl) => pl.forAgencies);
  return (
    <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-1 sm:p-8">
      <div className="flex items-center gap-3">
        <ProductMark product={product} className="h-10 w-10 text-sm" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{product.name}</p>
          <p className="text-xs text-muted-foreground">{pricing.model}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Starts at
        </p>
        {from ? (
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-4xl font-bold tracking-tight text-ink">
              {formatUsd(from.monthly)}
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
            {from.annual !== undefined && from.annual < from.monthly && (
              <span className="text-sm text-muted-foreground">
                · {formatUsd(from.annual)}/mo billed yearly
              </span>
            )}
          </p>
        ) : (
          <p className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
            Custom quote
          </p>
        )}
      </div>

      <div className="mt-6 flex-1">
        <PlanList plans={brandPlans} />
        {agencyPlans.length > 0 && (
          <>
            <p className="mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              For agencies
            </p>
            <PlanList plans={agencyPlans} className="mt-2" />
          </>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <CircleDollarSign className="h-4 w-4 shrink-0" aria-hidden />
          {pricing.trial}
        </p>
        <a
          href={pricing.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1 text-xs font-semibold text-ink underline-offset-4 hover:underline"
        >
          Pricing page
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}

export function PricingFaceOff({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="scroll-mt-20 border-t border-border bg-surface/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="pricing-title"
          eyebrow="Pricing"
          title="What each one costs"
          intro={`Published list prices, read from both pricing pages on ${formatDate(entry.pricing.checkedOn)}.`}
        />
        <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
          {SIDES.map((side, i) => (
            <Reveal key={side} delay={i * 0.06}>
              <PriceCard product={sides[side]} pricing={entry.pricing[side]} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            <Md text={entry.pricing.note} />
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 7. The third option ---------- */

/**
 * Rankbox, disclosed, once, after the reader has had the whole comparison.
 * Styled as an aside — dashed border, no brand-blue field — so it reads as a
 * note from the people who wrote the page, not as the page's real purpose.
 * The claims are RANKBOX_SHIPS and nothing else.
 */
export function ThirdOption({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const ours = SIDES.map((s) => sides[s]).filter((p) =>
    (COMPETITOR_SLUGS as readonly string[]).includes(p.slug),
  );

  return (
    <section
      id="third-option"
      aria-labelledby="third-title"
      className="scroll-mt-20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-5">
        <Reveal>
          <div className="rounded-3xl border border-dashed border-ink/20 bg-background p-6 sm:p-10">
            <div className="flex items-center gap-3">
              <RankboxTile className="h-10 w-10" />
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                A third option · from the team that wrote this page
              </p>
            </div>
            <h2
              id="third-title"
              className="mt-6 font-display text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
            >
              {entry.thirdOption.title}
            </h2>
            <p className="mt-3 text-[1rem] leading-relaxed text-muted-foreground">
              <Md text={entry.thirdOption.body} />
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {RANKBOX_SHIPS.map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-snug text-ink">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    strokeWidth={3}
                    aria-hidden
                  />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                to="/features"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink px-5 text-sm font-semibold text-background transition-all hover:-translate-y-0.5 hover:bg-ink/90"
              >
                See how Rankbox works
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              {ours.map((p) => (
                <Link
                  key={p.slug}
                  to="/alternatives/$slug"
                  params={{ slug: p.slug }}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-volt"
                >
                  Rankbox vs {p.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
              <span className="text-sm text-muted-foreground">{RANKBOX_PRICE_LINE}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 8. FAQ, method, sources ---------- */

export function MatchupFaq({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-20 border-t border-border py-20 sm:py-28"
    >
      <div className="mx-auto max-w-3xl px-5">
        <Heading
          id="faq-title"
          eyebrow="FAQ"
          title={`${matchupTitle(matchup)}: common questions`}
        />
        <FaqList faqs={entry.faqs} />

        <aside
          aria-label="How this comparison was made"
          className="mt-14 rounded-2xl border border-border bg-surface/60 p-5 text-sm leading-relaxed text-muted-foreground sm:p-6"
        >
          <p className="font-semibold text-ink">How we compared</p>
          <p className="mt-2">
            From {sides.a.name}&rsquo;s and {sides.b.name}&rsquo;s own pricing pages, documentation
            and changelogs, plus dated third-party reporting, last read on{" "}
            {formatDate(entry.pricing.checkedOn)}. We haven&rsquo;t benchmarked either product
            ourselves, so where a round turns on judgment the verdict says so, and every factual
            claim traces to a source below. Rankbox makes a product in this space; it appears once,
            as the third option, and nowhere in the scoring.
          </p>
        </aside>

        <SourceList id="sources" sources={entry.sources} />
      </div>
    </section>
  );
}

/* ---------- 9. Cards, related, CTA ---------- */

export function TallyPill({ matchup }: { matchup: Matchup }) {
  const { a, b, draw } = matchup.tally;
  const sides = sidesOf(matchup);
  return (
    <span
      title={`Rounds won: ${sides.a.name} ${a}, ${sides.b.name} ${b}${draw ? `, ${plural(draw, "draw")}` : ""}`}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold tabular-nums text-ink"
    >
      {a}&ndash;{b}
      {draw > 0 && (
        <span className="font-medium text-muted-foreground">· {plural(draw, "draw")}</span>
      )}
    </span>
  );
}

export function MatchupCard({
  matchup,
  showCategory = false,
}: {
  matchup: Matchup;
  /** On the hub, where cards from every category share one grid. */
  showCategory?: boolean;
}) {
  const sides = sidesOf(matchup);
  return (
    <Link
      to="/compare/$slug"
      params={{ slug: matchup.slug }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-1 transition-all hover:-translate-y-1 hover:border-ink/15 hover:shadow-3"
    >
      <div className="flex items-center justify-between gap-3">
        <FaceOff a={sides.a} b={sides.b} size="sm" />
        <TallyPill matchup={matchup} />
      </div>
      {showCategory && (
        <p className="mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-volt">
          {getCategory(matchup.category).name}
        </p>
      )}
      <h3
        className={cn(
          "font-display text-lg font-semibold tracking-tight text-ink",
          showCategory ? "mt-1" : "mt-5",
        )}
      >
        {matchupTitle(matchup)}
      </h3>
      <ul className="mt-4 flex-1 space-y-3 border-t border-border pt-4">
        {SIDES.map((side) => (
          <li key={side} className="flex gap-2.5 text-[0.84rem] leading-snug">
            <ProductMark product={sides[side]} className="mt-px h-5 w-5 text-[0.5rem]" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-ink">{sides[side].name}</span> for{" "}
              {lowerFirst(matchup.bestFor[side])}
            </span>
          </li>
        ))}
      </ul>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
        Read the verdict
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function RelatedMatchups({ matchup }: { matchup: Matchup }) {
  const related = relatedMatchups(matchup);
  if (related.length === 0) return null;
  return (
    <section aria-labelledby="related-title" className="border-t border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="related-title"
              className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            >
              Still shortlisting?
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              The same rounds, run on the other pairs people weigh.
            </p>
          </div>
          <Link
            to="/compare"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
          >
            All head-to-heads
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((m, i) => (
            <Reveal key={m.slug} delay={i * 0.05}>
              <MatchupCard matchup={m} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The closing ask, kept to what happens next: paste a URL and onboarding
 * reads the site and shows its content gaps, competitors and topic clusters.
 * No claim about a card — the trial itself takes one.
 */
export function CompareCta() {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="compare-cta-title" className="px-5 pb-24 pt-16 sm:pb-28 sm:pt-20">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-brand-blue px-6 py-14 text-center sm:px-12 sm:py-16">
          <PixelField seed={5} />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            <h2
              id="compare-cta-title"
              className="text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-[2.6rem] sm:leading-[1.08]"
            >
              Rather have the articles than another tool?
            </h2>
            <p className="mt-4 max-w-xl text-balance text-base leading-relaxed text-white/80">
              Paste your URL. Rankbox reads your site and shows the content gaps, the competitors
              you&rsquo;re up against, and the topics it would write first.
            </p>
            <div className="mt-8 flex w-full flex-col items-center gap-3">
              <UrlForm url={url} onChange={setUrl} />
              <p className="text-sm text-white/70">
                Free to look · {TRIAL_DAYS}-day trial when you&rsquo;re ready
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
