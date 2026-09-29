/* Scenes about measuring AI visibility: dashboards, a leaderboard, a traffic
   chart and a mentions feed. Charts carry no numbers, so a cover never reads
   as a claim about real data. */
import { AI_MARKS } from "@/components/landing/ai-logos";
import { EngineBadge } from "./glyphs";
import {
  H,
  PAPER,
  W,
  jitter,
  pick,
  random,
  shuffle,
  toneFor,
  type Engine,
  type SceneProps,
} from "./kit";

/* The named engine first, then others, as many as asked for. */
function engineLineup(
  engine: Engine | null,
  rand: () => number,
  count: number,
  pool: readonly Engine[] = AI_MARKS,
) {
  const rest = shuffle(
    rand,
    pool.filter((m) => m.name !== engine?.name),
  );
  return (engine ? [engine, ...rest] : rest).slice(0, count);
}

/* ---------- panels ---------- */

const PANEL_TONES = {
  blue: {
    field: "fill-brand-blue",
    band: "fill-white",
    sheen: 0.22,
    panel: "fill-white/12 stroke-white/35",
    label: "fill-white/55",
    bar: "fill-white/55",
    barHi: "fill-white",
    line: "stroke-white",
    dot: "fill-white",
    halo: "fill-white/25",
    grid: "stroke-white/15",
    track: "stroke-white/20",
    arc: "stroke-white",
    core: "fill-brand-blue-deep",
  },
  deep: {
    field: "fill-brand-blue-deep",
    band: "fill-white",
    sheen: 0.16,
    panel: "fill-white/10 stroke-white/30",
    label: "fill-white/50",
    bar: "fill-white/45",
    barHi: "fill-white",
    line: "stroke-white",
    dot: "fill-white",
    halo: "fill-white/25",
    grid: "stroke-white/12",
    track: "stroke-white/15",
    arc: "stroke-white",
    core: "fill-brand-blue",
  },
  black: {
    field: "fill-hero-black",
    band: "fill-brand-blue",
    sheen: 0.06,
    panel: "fill-white/5 stroke-white/15",
    label: "fill-white/25",
    bar: "fill-brand-blue/45",
    barHi: "fill-brand-blue",
    line: "stroke-brand-blue",
    dot: "fill-brand-blue",
    halo: "fill-brand-blue/30",
    grid: "stroke-white/8",
    track: "stroke-white/10",
    arc: "stroke-brand-blue",
    core: "fill-hero-black-elev",
  },
} as const;

/* Three frosted panels (share of answers, trend, citation rate) over a
   striped field. After Webflow's data-insights covers. */
export function AnalyticsScene({ seed, engine, uid, onBlue }: SceneProps) {
  const rand = random(seed);
  // Every tone but black is a blue field, so on the blue header it is black.
  const drawn = pick(rand, ["blue", "blue", "deep", "black"] as const);
  const t = PANEL_TONES[onBlue ? "black" : drawn];
  const bands = Array.from({ length: 8 }, () => 0.02 + rand() * 0.08);
  const bars = Array.from({ length: 5 }, (_, i) => 130 + i * 55 + rand() * 90);
  const trend = Array.from({ length: 6 }, (_, i) => ({
    x: 40 + i * 68,
    y: 470 - i * 52 + jitter(rand, 45),
  }));
  const end = trend[trend.length - 1];
  const share = 0.55 + rand() * 0.3;
  const C = 2 * Math.PI * 128;
  const order = shuffle(rand, [0, 1, 2]);

  const label = (x: number, w: number) => (
    <rect x={x} y={63} width={w} height={22} rx={11} className={t.label} />
  );
  const panels = [
    <>
      {engine ? (
        <>
          <EngineBadge engine={engine} cx={74} cy={74} r={36} ring="" />
          {label(126, 170)}
        </>
      ) : (
        label(40, 240)
      )}
      {bars.map((h, j) => (
        <rect
          key={j}
          x={47 + j * 70}
          y={580 - h}
          width={46}
          height={h}
          rx={8}
          className={j === bars.length - 1 ? t.barHi : t.bar}
        />
      ))}
    </>,
    <>
      {label(40, 200)}
      {[260, 380, 500].map((y) => (
        <line key={y} x1={40} x2={380} y1={y} y2={y} className={t.grid} strokeWidth={2} />
      ))}
      <polyline
        points={trend.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        className={t.line}
        strokeWidth={9}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={end.x} cy={end.y} r={30} className={t.halo} />
      <circle cx={end.x} cy={end.y} r={15} className={t.dot} />
    </>,
    <>
      {label(40, 220)}
      <circle cx={210} cy={360} r={128} fill="none" className={t.track} strokeWidth={56} />
      <circle
        cx={210}
        cy={360}
        r={128}
        fill="none"
        className={t.arc}
        strokeWidth={56}
        strokeDasharray={`${C * share} ${C}`}
        transform="rotate(-90 210 360)"
      />
      <circle cx={210} cy={360} r={72} className={t.core} />
    </>,
  ];

  return (
    <>
      <defs>
        <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity={t.sheen} />
          <stop offset="1" stopColor="white" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} className={t.field} />
      {bands.map((o, i) => (
        <rect key={i} x={i * 200} width={200} height={H} className={t.band} opacity={o} />
      ))}
      <rect width={W} height={H} fill={`url(#${uid}-sheen)`} />
      {[120, 590, 1060].map((x, i) => (
        <g key={i} transform={`translate(${x} 180)`}>
          <rect width={420} height={640} rx={36} className={t.panel} strokeWidth={3} />
          {/* The dial and trend swap places between covers; the engine's
              panel stays first so its badge sits top-left. */}
          {panels[i === 0 ? 0 : order.filter((o) => o !== 0)[i - 1]]}
        </g>
      ))}
    </>
  );
}

/* ---------- leaderboard ---------- */

const BOARD_TONES = {
  blue: {
    field: "fill-brand-blue",
    grid: "stroke-white/15",
    bar: "fill-hero-black",
    rank: "fill-white/55",
    label: "fill-white/25",
    hi: "fill-white",
    hiRank: "fill-brand-blue",
    hiText: "fill-ink",
    ring: "stroke-white",
    dot: "fill-white",
  },
  black: {
    field: "fill-hero-black",
    grid: "stroke-white/10",
    bar: "fill-white/10",
    rank: "fill-white/45",
    label: "fill-white/20",
    hi: "fill-brand-blue",
    hiRank: "fill-white",
    hiText: "fill-white",
    ring: "stroke-brand-blue",
    dot: "fill-brand-blue",
  },
  paper: {
    field: PAPER,
    grid: "stroke-ink/10",
    bar: "fill-hero-black",
    rank: "fill-white/55",
    label: "fill-white/25",
    hi: "fill-brand-blue",
    hiRank: "fill-white",
    hiText: "fill-white",
    ring: "stroke-brand-blue",
    dot: "fill-brand-blue",
  },
} as const;

/* Share of AI answers as a ranked bar chart, the site on top. For
   benchmarking, competitor and rank-tracking posts. */
export function LeaderboardScene({ seed, engine, onBlue }: SceneProps) {
  const rand = random(seed);
  const t = BOARD_TONES[toneFor(rand, ["blue", "black", "paper"] as const, onBlue, "black")];
  const lengths = [1380, 1160, 960, 780, 600].map((l) => l + jitter(rand, 40));
  const hi = pick(rand, [0, 0, 1]);
  const labels = lengths.map(() => 180 + rand() * 140);
  const rowY = (i: number) => 140 + i * 152;
  return (
    <>
      <rect width={W} height={H} className={t.field} />
      {[400, 700, 1000, 1300].map((x) => (
        <line key={x} x1={x} x2={x} y1={90} y2={910} className={t.grid} strokeWidth={3} />
      ))}
      <circle cx={1370} cy={900} r={200} fill="none" className={t.ring} strokeWidth={6} />
      <circle cx={1370} cy={900} r={26} className={t.dot} />
      {lengths.map((len, i) => {
        const y = rowY(i);
        const on = i === hi;
        return (
          <g key={i}>
            <rect x={-60} y={y} width={len} height={112} rx={56} className={on ? t.hi : t.bar} />
            <text
              x={150}
              y={y + 58}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={52}
              fontWeight={700}
              className={`font-display ${on ? t.hiRank : t.rank}`}
            >
              {i + 1}
            </text>
            {on ? (
              <>
                <text
                  x={220}
                  y={y + 58}
                  dominantBaseline="central"
                  fontSize={50}
                  fontWeight={700}
                  letterSpacing={-1}
                  className={`font-display ${t.hiText}`}
                >
                  yoursite.com
                </text>
                {engine && <EngineBadge engine={engine} cx={len - 124} cy={y + 56} r={38} />}
              </>
            ) : (
              <rect x={220} y={y + 44} width={labels[i]} height={26} rx={13} className={t.label} />
            )}
          </g>
        );
      })}
    </>
  );
}

/* ---------- traffic ---------- */

const TRAFFIC_TONES = {
  blue: {
    field: "fill-brand-blue",
    color: "white",
    grid: "stroke-white/15",
    line: "stroke-white",
    faint: "stroke-white/45",
    halo: "fill-white/25",
    dot: "fill-white",
    card: "fill-white",
    cardText: "fill-ink/15",
    solid: "fill-hero-black",
  },
  black: {
    field: "fill-hero-black",
    color: "var(--brand-blue)",
    grid: "stroke-white/8",
    line: "stroke-brand-blue",
    faint: "stroke-white/30",
    halo: "fill-brand-blue/30",
    dot: "fill-brand-blue",
    card: "fill-white",
    cardText: "fill-ink/15",
    solid: "fill-brand-blue",
  },
  paper: {
    field: PAPER,
    color: "var(--brand-blue)",
    grid: "stroke-ink/10",
    line: "stroke-brand-blue",
    faint: "stroke-ink/30",
    halo: "fill-brand-blue/25",
    dot: "fill-brand-blue",
    card: "fill-hero-black",
    cardText: "fill-white/20",
    solid: "fill-hero-black",
  },
} as const;

/* AI referral traffic climbing past the rest, with the engines it comes
   from as a legend. For GA4 and referral-traffic posts. */
export function TrafficScene({ seed, engine, uid, onBlue }: SceneProps) {
  const rand = random(seed);
  const t = TRAFFIC_TONES[toneFor(rand, ["blue", "black", "paper"] as const, onBlue, "black")];
  const xs = [-40, 170, 380, 590, 800, 1010, 1220, 1430, 1640];
  const ai = xs.map((x, i) => ({ x, y: 820 - i * 72 + jitter(rand, 40) }));
  const rest = xs.map((x, i) => ({ x, y: 700 - i * 14 + jitter(rand, 50) }));
  const tip = ai[7];
  const path = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");
  const legend = engineLineup(
    engine,
    rand,
    3,
    AI_MARKS.filter((m) => m.name !== "Google" || engine?.name === "Google"),
  );
  const shares = [250, 170 + rand() * 30, 100 + rand() * 30];
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: t.color }} stopOpacity={0.35} />
          <stop offset="1" style={{ stopColor: t.color }} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} className={t.field} />
      <circle cx={1500} cy={1040} r={260} className={t.solid} />
      {[250, 450, 650, 850].map((y) => (
        <line key={y} x1={0} x2={W} y1={y} y2={y} className={t.grid} strokeWidth={3} />
      ))}
      <polygon points={`-40,1000 ${path(ai)} 1640,1000`} fill={`url(#${uid}-area)`} />
      <polyline
        points={path(rest)}
        fill="none"
        className={t.faint}
        strokeWidth={6}
        strokeDasharray="2 18"
        strokeLinecap="round"
      />
      <polyline
        points={path(ai)}
        fill="none"
        className={t.line}
        strokeWidth={10}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={tip.x} cy={tip.y} r={38} className={t.halo} />
      <circle cx={tip.x} cy={tip.y} r={18} className={t.dot} />

      {/* Where the visits came from. */}
      <g transform="translate(150 110)">
        <rect width={460} height={300} rx={32} className={t.card} />
        {legend.map((e, i) => (
          <g key={e.name}>
            <EngineBadge engine={e} cx={70} cy={70 + i * 80} r={28} />
            <rect
              x={124}
              y={61 + i * 80}
              width={shares[i]}
              height={18}
              rx={9}
              className={i === 0 ? "fill-brand-blue" : "fill-brand-blue/40"}
            />
            <rect
              x={124 + shares[i] + 16}
              y={61 + i * 80}
              width={40}
              height={18}
              rx={9}
              className={t.cardText}
            />
          </g>
        ))}
      </g>
    </>
  );
}

/* ---------- mentions feed ---------- */

const STATUS = {
  Positive: { pill: "fill-success/15", text: "fill-success" },
  Neutral: { pill: "fill-ink/6", text: "fill-ink/55" },
  Negative: { pill: "fill-destructive/12", text: "fill-destructive" },
} as const;

const FEED_TONES = {
  blue: {
    field: "fill-brand-blue",
    solid: "fill-hero-black",
    rail: "stroke-white/40",
    node: "fill-white",
    row: "fill-white",
  },
  black: {
    field: "fill-hero-black",
    solid: "fill-brand-blue",
    rail: "stroke-white/25",
    node: "fill-brand-blue",
    row: "fill-white",
  },
  paper: {
    field: PAPER,
    solid: "fill-brand-blue",
    rail: "stroke-ink/20",
    node: "fill-brand-blue",
    row: "fill-white stroke-ink/10",
  },
} as const;

/* A monitoring feed: each engine's latest answer about the brand, with its
   sentiment. For brand-mention tracking posts. */
export function FeedScene({ seed, engine, onBlue }: SceneProps) {
  const rand = random(seed);
  const t = FEED_TONES[toneFor(rand, ["blue", "black", "paper"] as const, onBlue, "black")];
  const engines = engineLineup(engine, rand, 5);
  const statuses = shuffle(rand, [
    "Positive",
    "Positive",
    "Neutral",
    "Negative",
    "Positive",
  ] as const);
  const rows = engines.map((e, i) => ({
    e,
    status: statuses[i],
    x: 240 + (i % 2) * 60,
    y: 110 + i * 168,
    title: 220 + rand() * 160,
    a: 120 + rand() * 140,
    b: 100 + rand() * 120,
  }));
  return (
    <>
      <rect width={W} height={H} className={t.field} />
      <circle cx={1470} cy={130} r={300} className={t.solid} />
      <circle cx={1470} cy={130} r={360} fill="none" className={t.rail} strokeWidth={4} />
      <line x1={170} x2={170} y1={0} y2={H} className={t.rail} strokeWidth={4} />
      {rows.map((r) => {
        const s = STATUS[r.status];
        const chip = 140 + r.a + 12;
        return (
          <g key={r.e.name}>
            <circle cx={170} cy={r.y + 66} r={12} className={t.node} />
            <g transform={`translate(${r.x} ${r.y})`}>
              <rect width={1120} height={132} rx={30} className={t.row} strokeWidth={2} />
              <EngineBadge engine={r.e} cx={76} cy={66} r={40} />
              <rect x={140} y={34} width={r.title} height={20} rx={10} className="fill-ink/70" />
              <rect x={140} y={80} width={r.a} height={16} rx={8} className="fill-ink/15" />
              <rect
                x={chip}
                y={70}
                width={190}
                height={36}
                rx={10}
                className="fill-brand-blue/10 stroke-brand-blue/40"
                strokeWidth={2}
              />
              <text
                x={chip + 95}
                y={89}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={22}
                fontWeight={600}
                className="fill-brand-blue font-display"
              >
                yoursite.com
              </text>
              <rect x={chip + 202} y={80} width={r.b} height={16} rx={8} className="fill-ink/15" />
              <rect x={930} y={42} width={150} height={48} rx={24} className={s.pill} />
              <text
                x={1005}
                y={67}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={22}
                fontWeight={700}
                className={`font-display ${s.text}`}
              >
                {r.status}
              </text>
            </g>
          </g>
        );
      })}
    </>
  );
}
