/* Scenes about a single AI engine: the engine citing the site, and the
   answer it gives when a buyer asks about the brand. */
import { AI_MARKS } from "@/components/landing/ai-logos";
import { EngineBadge, EngineGlyph, Wire } from "./glyphs";
import { H, PAPER, W, jitter, pick, random, type SceneProps } from "./kit";

/* A named engine in a ringed circle, wired to the site it cites. After
   Webflow's partner covers (logo circle, dashed lines, outlined pill). */
export function LockupScene({ seed, engine, onBlue }: SceneProps) {
  const rand = random(seed);
  const e = engine ?? pick(rand, AI_MARKS);
  const dark = rand() < 0.35 || !!onBlue;
  const hub = { x: 470, y: 500, r: 0 };
  const a = { x: 1340 + jitter(rand, 50), y: 70 + jitter(rand, 30), r: 112 };
  const b = { x: 130 + jitter(rand, 30), y: 910 + jitter(rand, 30), r: 96 };
  const c = { x: 1250 + jitter(rand, 70), y: 1010, r: 74 };
  const wire = dark ? "stroke-white/60" : "stroke-white/85";
  const dash = "14 16";
  return (
    <>
      <rect width={W} height={H} className={dark ? "fill-hero-black" : "fill-brand-blue"} />
      <Wire a={hub} b={{ x: 880, y: 500, r: 0 }} className={wire} width={5} dash={dash} />
      <Wire a={hub} b={a} className={wire} width={5} dash={dash} />
      <Wire a={hub} b={b} className={wire} width={5} dash={dash} />
      <Wire a={{ x: 1200, y: 500, r: 0 }} b={c} className={wire} width={5} dash={dash} />
      <Wire a={a} b={{ x: W + 20, y: a.y + 220, r: 0 }} className={wire} width={5} dash={dash} />
      {[a, b, c].map((n, i) => (
        <g key={i}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            className={dark ? "fill-brand-blue stroke-white" : "fill-hero-black stroke-white"}
            strokeWidth={7}
          />
          <circle cx={n.x} cy={n.y} r={n.r * 0.26} className="fill-white" />
        </g>
      ))}
      <circle cx={hub.x} cy={hub.y} r={288} fill="none" className="stroke-white" strokeWidth={8} />
      <circle cx={hub.x} cy={hub.y} r={240} className="fill-white" />
      <EngineGlyph engine={e} cx={hub.x} cy={hub.y} size={230} />
      <rect
        x={840}
        y={355}
        width={980}
        height={290}
        rx={145}
        fill="none"
        className="stroke-white"
        strokeWidth={8}
      />
      <rect x={880} y={395} width={900} height={210} rx={105} className="fill-white" />
      <circle cx={975} cy={500} r={20} className="fill-brand-blue" />
      <text
        x={1015}
        y={500}
        dominantBaseline="central"
        fontSize={70}
        fontWeight={700}
        letterSpacing={-1.5}
        className="fill-ink font-display"
      >
        yoursite.com
      </text>
    </>
  );
}

/* The buyer's question, split around the brand so it can be highlighted. */
function promptFor(title: string): [string, string] {
  if (/pric|cost|omission|hallucinat/i.test(title)) return ["What does ", " cost?"];
  if (/shouldn|defensive|negative/i.test(title)) return ["Why shouldn't I buy ", "?"];
  if (/fact|incorrect|drift|pivot|memory/i.test(title)) return ["What does ", " do?"];
  if (/presence|mentions? your/i.test(title)) return ["Have you heard of ", "?"];
  return ["Is ", " worth it?"];
}

/* An AI answer that names and cites the site, over an app frame. After
   Webflow's product-UI covers with a prompt card on top. */
export function AnswerScene({ seed, engine, title, uid }: SceneProps) {
  const rand = random(seed);
  const e = engine ?? pick(rand, AI_MARKS);
  const light = rand() < 0.4;
  const blobX = rand() < 0.5 ? 1480 + jitter(rand, 50) : 180 + jitter(rand, 50);
  const [before, after] = promptFor(title);
  const brand = "yoursite.com";
  const promptW = (before.length + brand.length + after.length) * 17.6 + 64;
  const chrome = light ? "fill-white" : "fill-hero-black-elev";
  const faint = light ? "fill-ink/8" : "fill-white/10";
  return (
    <>
      <defs>
        <filter id={`${uid}-lift`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow
            dx="0"
            dy="30"
            stdDeviation="40"
            floodColor="black"
            floodOpacity={light ? 0.16 : 0.45}
          />
        </filter>
      </defs>

      {/* The app around the answer. */}
      <rect width={W} height={H} className={light ? PAPER : "fill-hero-black"} />
      <rect width={240} height={H} className={chrome} />
      {[120, 150, 110, 140, 96, 130, 118].map((w, i) => (
        <rect key={i} x={48} y={150 + i * 58} width={w} height={14} rx={7} className={faint} />
      ))}
      <rect x={240} width={W - 240} height={86} className={chrome} />
      <rect x={290} y={36} width={160} height={14} rx={7} className={faint} />
      <rect x={1330} y={28} width={130} height={30} rx={15} className="fill-brand-blue" />
      <rect x={320} y={140} width={560} height={40} rx={10} className={faint} />

      <circle cx={blobX} cy={940} r={430} className="fill-brand-blue" />
      <circle
        cx={blobX}
        cy={940}
        r={500}
        fill="none"
        className="stroke-brand-blue/50"
        strokeWidth={4}
      />

      <g transform="translate(212 170) scale(1.2)" filter={`url(#${uid}-lift)`}>
        <rect
          width={980}
          height={560}
          rx={36}
          className={light ? "fill-white stroke-ink/10" : "fill-white"}
          strokeWidth={2}
        />
        <EngineBadge engine={e} cx={72} cy={72} r={34} />
        <text
          x={124}
          y={74}
          dominantBaseline="central"
          fontSize={34}
          fontWeight={700}
          className="fill-ink font-display"
        >
          {e.name}
        </text>
        <circle cx={908} cy={72} r={10} className="fill-brand-blue" />

        <rect
          x={920 - promptW}
          y={132}
          width={promptW}
          height={72}
          rx={36}
          className="fill-ink/5"
        />
        <text
          x={952 - promptW}
          y={168}
          dominantBaseline="central"
          fontSize={34}
          fontWeight={500}
          className="fill-ink font-display"
        >
          {before}
          <tspan className="fill-brand-blue" textDecoration="underline">
            {brand}
          </tspan>
          {after}
        </text>

        <rect x={60} y={252} width={820} height={16} rx={8} className="fill-ink/10" />
        <rect x={60} y={298} width={240} height={16} rx={8} className="fill-ink/10" />
        <rect
          x={314}
          y={287}
          width={206}
          height={38}
          rx={10}
          className="fill-brand-blue/10 stroke-brand-blue/40"
          strokeWidth={2}
        />
        <text
          x={417}
          y={307}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={24}
          fontWeight={600}
          className="fill-brand-blue font-display"
        >
          {brand}
        </text>
        <rect x={534} y={298} width={300} height={16} rx={8} className="fill-ink/10" />
        <rect x={60} y={344} width={640} height={16} rx={8} className="fill-ink/10" />

        <rect
          x={60}
          y={420}
          width={236}
          height={56}
          rx={14}
          className="fill-brand-blue/8 stroke-brand-blue/45"
          strokeWidth={2}
        />
        <circle cx={90} cy={448} r={8} className="fill-brand-blue" />
        <text
          x={108}
          y={449}
          dominantBaseline="central"
          fontSize={26}
          fontWeight={600}
          className="fill-ink font-display"
        >
          {brand}
        </text>
        <rect x={312} y={420} width={124} height={56} rx={28} className="fill-success/15" />
        <text
          x={374}
          y={449}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={26}
          fontWeight={700}
          className="fill-success font-display"
        >
          Cited
        </text>
        <rect x={452} y={420} width={150} height={56} rx={14} className="fill-ink/5" />
        <rect x={618} y={420} width={120} height={56} rx={14} className="fill-ink/5" />
      </g>
    </>
  );
}
