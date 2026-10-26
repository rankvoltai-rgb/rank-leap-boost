/**
 * Each side's wins, Jasper's first. The honest part is set plainly, in white
 * cells with Jasper's mark, and closes on the matrix rows where Jasper has
 * the tick, so the reader can see the claim and its evidence together. Then
 * the three places Rankbox is built to go further, each with a small
 * diagram of the work (no figures, no sample results) and a link to the
 * feature page that owns it.
 */
import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Swords, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  PANEL,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark } from "@/components/alternatives/kit";
import { getFeature } from "@/data/features";
import type { Battleground, Competitor } from "@/data/alternatives";
import { allRows } from "./helpers";
import { StateToken } from "./parts";

/* ---------- When Jasper is the better choice ---------- */

export function BetterWhen({ competitor }: { competitor: Competitor }) {
  const ticks = allRows(competitor).filter((r) => r.them.state === "yes");
  return (
    <section aria-labelledby="better-title">
      <Spacer />
      <SectionHead
        icon={ThumbsUp}
        eyebrow="The honest part"
        title={
          <span id="better-title">
            When {competitor.name} is the <Accent>better choice</Accent>
          </span>
        }
        subtitle={`We'd rather you picked the right tool than churned in a month. ${competitor.name} is genuinely the better buy in these cases.`}
      />
      <Band>
        <CellGrid className="md:grid-cols-3">
          {competitor.betterWhen.map((w, i) => (
            <li key={w.title} className={CELL}>
              <Reveal delay={i * 0.06} className="flex h-full flex-col px-6 py-8 sm:px-8 sm:py-10">
                <div className="flex items-center justify-between">
                  <CompetitorMark competitor={competitor} className="h-9 w-9" />
                  <span className="font-display text-[1.6rem] font-medium tabular-nums tracking-[-0.03em] text-ink/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-[1.05rem] font-semibold leading-snug tracking-tight text-ink">
                  {w.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{w.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
      {ticks.length > 0 && (
        <Band inner={PANEL}>
          <div className="grid lg:grid-cols-[13rem_minmax(0,1fr)]">
            <p
              className={cn(
                "border-b px-6 py-4 text-[0.82rem] font-medium text-ink sm:px-8 lg:border-b-0 lg:border-r lg:py-6",
                LINE,
              )}
            >
              Rows where {competitor.name} is included
            </p>
            <ul className="grid gap-x-8 gap-y-3 px-6 py-5 sm:px-8 md:grid-cols-2 lg:py-6">
              {ticks.map((r) => (
                <li key={r.label} className="flex gap-2.5">
                  <StateToken state={r.them.state} size="sm" className="mt-0.5" />
                  <span className="text-[0.85rem] leading-snug text-muted-foreground">
                    <span className="font-medium text-ink">{r.label}.</span> {r.them.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Band>
      )}
    </section>
  );
}

/* ---------- Where Rankbox goes further ---------- */

const PICTURE_BOX =
  "flex h-40 items-center justify-center overflow-hidden rounded-lg border border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_70%,white)] p-4";

/* A plan of questions: rows with a demand signal, no numbers. */
function QuestionsPicture() {
  const rows = [
    { w: "78%", bars: [5, 8, 11] },
    { w: "62%", bars: [5, 9, 7] },
    { w: "70%", bars: [4, 6, 10] },
  ];
  return (
    <div className="w-full max-w-[15rem] space-y-2">
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-md border border-ink/[0.07] bg-white px-2.5 py-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
        >
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-[0.6rem] font-bold text-cta">
            ?
          </span>
          <span className="h-1.5 rounded-full bg-ink/15" style={{ width: r.w }} />
          <span className="ml-auto flex h-3 items-end gap-0.5">
            {r.bars.map((h, j) => (
              <span key={j} className="w-1 rounded-sm bg-cta/70" style={{ height: `${h}px` }} />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

/* An article with numbered citations and a references list. */
function CitedPicture() {
  const Sup = ({ n }: { n: number }) => (
    <span className="inline-flex h-3 w-3 -translate-y-1 items-center justify-center rounded-[3px] bg-cta-soft text-[0.5rem] font-bold text-cta">
      {n}
    </span>
  );
  return (
    <div className="w-full max-w-[15rem] rounded-md border border-ink/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <span className="block h-2 w-2/3 rounded-full bg-ink/70" />
      <span className="mt-2.5 flex items-center gap-1">
        <span className="h-1.5 flex-1 rounded-full bg-ink/10" />
        <Sup n={1} />
      </span>
      <span className="mt-1.5 flex items-center gap-1">
        <span className="h-1.5 w-4/5 rounded-full bg-ink/10" />
      </span>
      <span className="mt-1.5 flex items-center gap-1">
        <span className="h-1.5 w-3/5 rounded-full bg-ink/10" />
        <Sup n={2} />
      </span>
      <span className="mt-3 block border-t border-dashed border-ink/15 pt-2">
        {[1, 2].map((n) => (
          <span key={n} className="mt-1 flex items-center gap-1.5">
            <span className="text-[0.5rem] font-bold text-cta">{n}</span>
            <span className="h-1 w-1/2 rounded-full bg-cta/25" />
          </span>
        ))}
      </span>
    </div>
  );
}

/* Links pointing in at the site from relevant pages. */
function LinksPicture() {
  const nodes = [
    { x: 34, y: 26 },
    { x: 34, y: 94 },
    { x: 206, y: 26 },
    { x: 206, y: 94 },
  ];
  return (
    <svg viewBox="0 0 240 120" className="h-full w-full max-w-[15rem]">
      {nodes.map((n, i) => (
        <g key={i}>
          <line
            x1={n.x + (n.x < 120 ? 14 : -14)}
            y1={n.y}
            x2={n.x < 120 ? 82 : 158}
            y2={60}
            stroke="var(--cta)"
            strokeOpacity={0.45}
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          <rect
            x={n.x - 14}
            y={n.y - 10}
            width={28}
            height={20}
            rx={4}
            fill="white"
            stroke="rgba(16,24,40,0.12)"
          />
          <rect x={n.x - 8} y={n.y - 2} width={16} height={4} rx={2} fill="rgba(16,24,40,0.14)" />
        </g>
      ))}
      <rect x={82} y={44} width={76} height={32} rx={6} fill="var(--cta)" />
      <text
        x={120}
        y={64}
        textAnchor="middle"
        fontSize={10}
        fontWeight={600}
        fill="white"
        fontFamily="inherit"
      >
        yoursite.com
      </text>
    </svg>
  );
}

const PICTURES: Record<string, ComponentType> = {
  "answer-space-research": QuestionsPicture,
  "citation-ready-writer": CitedPicture,
  "authority-backlinks": LinksPicture,
};

function BattleCell({ b, i }: { b: Battleground; i: number }) {
  const feature = getFeature(b.featureSlug);
  const Picture = PICTURES[b.featureSlug];
  const Icon = b.icon;
  return (
    <li className={CELL}>
      <Reveal delay={i * 0.06} className="flex h-full flex-col px-6 py-8 sm:px-8 sm:py-10">
        <div aria-hidden className={PICTURE_BOX}>
          {Picture ? (
            <Picture />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cta-soft text-cta">
              <Icon className="h-6 w-6" />
            </span>
          )}
        </div>
        <div className="mt-7 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cta text-white">
            <Icon aria-hidden className="h-3.5 w-3.5" />
          </span>
          <span className="text-[0.75rem] font-semibold tabular-nums text-cta">
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="mt-4 text-[1.1rem] font-semibold leading-snug tracking-tight text-ink">
          {b.title}
        </h3>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{b.body}</p>
        <ul className="mt-5 space-y-2.5">
          {b.points.map((pt) => (
            <li key={pt} className="flex gap-2.5 text-[0.86rem] leading-snug text-ink">
              <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-cta" strokeWidth={2.6} />
              {pt}
            </li>
          ))}
        </ul>
        {feature && (
          <div className="mt-auto pt-7">
            <Link
              to="/features/$slug"
              params={{ slug: feature.slug }}
              className={cn(GHOST_BUTTON, "group")}
            >
              How {feature.name} works
              <ArrowRight
                aria-hidden
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        )}
      </Reveal>
    </li>
  );
}

export function RankboxGoesFurther({ competitor }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="further-title">
      <Spacer />
      <SectionHead
        icon={Swords}
        eyebrow="Where it's decided"
        title={
          <span id="further-title">
            {competitor.battlegroundsTitle ?? (
              <>
                Three things Rankbox does that {competitor.name}{" "}
                <Accent>doesn&rsquo;t set out to</Accent>
              </>
            )}
          </span>
        }
        subtitle={
          competitor.battlegroundsIntro ??
          "Not a longer list of features — the three that change what actually happens on your site."
        }
      />
      <Band>
        <CellGrid className="lg:grid-cols-3">
          {competitor.battlegrounds.map((b, i) => (
            <BattleCell key={b.title} b={b} i={i} />
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}
