/* Scenes built from bold geometry: a wall of tools, an article among shape
   tiles, and an entity graph. */
import { BrandGlyph, Check, Wire, type Node } from "./glyphs";
import { H, PAPER, W, jitter, pick, random, shuffle, toneFor, type SceneProps } from "./kit";

/* ---------- compare ---------- */

type Glyph =
  | "dot"
  | "ring"
  | "square"
  | "tri"
  | "half"
  | "bars"
  | "diamond"
  | "plus"
  | "quarter"
  | "pair";

const GLYPHS: Glyph[] = [
  "dot",
  "ring",
  "square",
  "tri",
  "half",
  "bars",
  "diamond",
  "plus",
  "quarter",
  "pair",
];

/* A stand-in logo for a tool on the list: plain geometry, never a real
   company's mark. */
function ToolGlyph({
  kind,
  cx,
  cy,
  fill,
  stroke,
}: {
  kind: Glyph;
  cx: number;
  cy: number;
  fill: string;
  stroke: string;
}) {
  const s = 104;
  const h = s / 2;
  switch (kind) {
    case "dot":
      return <circle cx={cx} cy={cy} r={h} className={fill} />;
    case "ring":
      return <circle cx={cx} cy={cy} r={h - 9} fill="none" className={stroke} strokeWidth={18} />;
    case "square":
      return <rect x={cx - h} y={cy - h} width={s} height={s} rx={16} className={fill} />;
    case "tri":
      return (
        <path d={`M${cx} ${cy - h} L${cx + h} ${cy + h} L${cx - h} ${cy + h} Z`} className={fill} />
      );
    case "half":
      return (
        <path
          d={`M${cx - h} ${cy + h / 2} A${h} ${h} 0 0 1 ${cx + h} ${cy + h / 2} Z`}
          className={fill}
        />
      );
    case "bars":
      return (
        <g className={fill}>
          {[0.5, 0.78, 1].map((k, i) => (
            <rect key={i} x={cx - h + i * 38} y={cy + h - s * k} width={28} height={s * k} rx={6} />
          ))}
        </g>
      );
    case "diamond":
      return (
        <rect
          x={cx - 37}
          y={cy - 37}
          width={74}
          height={74}
          rx={10}
          className={fill}
          transform={`rotate(45 ${cx} ${cy})`}
        />
      );
    case "plus":
      return (
        <g className={fill}>
          <rect x={cx - h} y={cy - 17} width={s} height={34} rx={8} />
          <rect x={cx - 17} y={cy - h} width={34} height={s} rx={8} />
        </g>
      );
    case "quarter":
      return (
        <path
          d={`M${cx - h} ${cy + h} V${cy - h} A${s} ${s} 0 0 1 ${cx + h} ${cy + h} Z`}
          className={fill}
        />
      );
    case "pair":
      return (
        <g className={fill}>
          <circle cx={cx - 26} cy={cy} r={26} />
          <circle cx={cx + 26} cy={cy} r={26} />
        </g>
      );
  }
}

const COMPARE_TONES = {
  paper: {
    field: PAPER,
    solid: "fill-brand-blue",
    outline: "stroke-brand-blue/40",
    stripe: "stroke-white/40",
    tile: "fill-white stroke-ink",
    tileWidth: 5,
    glyph: { fill: "fill-ink", stroke: "stroke-ink" },
    us: "fill-brand-blue",
    usMark: "fill-white stroke-white",
    badge: "fill-hero-black",
    tick: "stroke-white",
  },
  blue: {
    field: "fill-brand-blue",
    solid: "fill-hero-black",
    outline: "stroke-white/40",
    stripe: "stroke-white/25",
    tile: "fill-white/10 stroke-white/60",
    tileWidth: 4,
    glyph: { fill: "fill-white", stroke: "stroke-white" },
    us: "fill-white",
    usMark: "fill-brand-blue stroke-brand-blue",
    badge: "fill-hero-black",
    tick: "stroke-white",
  },
  black: {
    field: "fill-hero-black",
    solid: "fill-brand-blue",
    outline: "stroke-brand-blue/50",
    stripe: "stroke-white/35",
    tile: "fill-white/5 stroke-white/30",
    tileWidth: 4,
    glyph: { fill: "fill-white", stroke: "stroke-white" },
    us: "fill-brand-blue",
    usMark: "fill-white stroke-white",
    badge: "fill-white",
    tick: "stroke-ink",
  },
} as const;

/* A wall of tools with Rankbox first, one tile per entry in the title's
   count. For alternatives lists and tool round-ups. */
export function CompareScene({ seed, title, onBlue }: SceneProps) {
  const rand = random(seed);
  const t =
    COMPARE_TONES[toneFor(rand, ["paper", "paper", "blue", "black"] as const, onBlue, "paper")];
  const wide = Number(title.match(/\b(\d{1,2})\b/)?.[1]) === 10;
  const right = rand() < 0.5;
  const accent = pick(rand, ["circle", "quarter", "stripes"] as const);
  const size = wide ? 240 : 256;
  const gap = wide ? 30 : 34;
  const cols = wide ? 5 : 3;
  const count = wide ? 10 : 9;
  const span = cols * size + (cols - 1) * gap;
  const x0 = wide ? (W - span) / 2 : right ? 640 : W - 640 - span;
  const y0 = wide ? 245 : 82;
  // The free side of a 3×3 wall, where the accent shape goes.
  const sx = right ? 190 : W - 190;
  const glyphs = shuffle(rand, GLYPHS);
  return (
    <>
      <rect width={W} height={H} className={t.field} />
      {wide ? (
        <>
          <circle cx={right ? 60 : W - 60} cy={1070} r={270} className={t.solid} />
          <circle cx={right ? W : 0} cy={0} r={230} className={t.solid} />
        </>
      ) : accent === "circle" ? (
        <>
          <circle cx={sx} cy={520} r={400} fill="none" className={t.outline} strokeWidth={4} />
          <circle cx={sx} cy={520} r={330} className={t.solid} />
        </>
      ) : accent === "quarter" ? (
        <>
          <circle cx={right ? 0 : W} cy={H} r={560} className={t.solid} />
          <circle cx={sx} cy={170} r={86} fill="none" className={t.outline} strokeWidth={6} />
        </>
      ) : (
        <>
          <rect x={right ? 0 : W - 560} width={560} height={H} className={t.solid} />
          {Array.from({ length: 11 }, (_, i) => (
            <line
              key={i}
              x1={(right ? 40 : W - 520) + i * 48}
              x2={(right ? 40 : W - 520) + i * 48}
              y1={0}
              y2={H}
              className={t.stripe}
              strokeWidth={4}
            />
          ))}
        </>
      )}
      {Array.from({ length: count }, (_, i) => {
        const x = x0 + (i % cols) * (size + gap);
        const y = y0 + Math.floor(i / cols) * (size + gap);
        const cx = x + size / 2;
        const cy = y + size / 2;
        if (i === 0) {
          return (
            <g key={i}>
              <rect x={x} y={y} width={size} height={size} rx={40} className={t.us} />
              <BrandGlyph cx={cx} cy={cy} size={120} className={t.usMark} />
              <circle cx={x + size - 14} cy={y + 14} r={38} className={t.badge} />
              <Check cx={x + size - 14} cy={y + 14} className={t.tick} />
            </g>
          );
        }
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={size}
              height={size}
              rx={40}
              className={t.tile}
              strokeWidth={t.tileWidth}
            />
            <ToolGlyph kind={glyphs[i % glyphs.length]} cx={cx} cy={cy} {...t.glyph} />
          </g>
        );
      })}
    </>
  );
}

/* ---------- write ---------- */

type Deco = "stripes" | "ring" | "disc" | "half" | "dots";

/* An answer-first article among bold, cropped tiles, with the Rankbox mark as
   the AI spark. After Webflow's shape-grid covers. */
export function WriteScene({ seed, onBlue }: SceneProps) {
  const rand = random(seed);
  const dark = rand() < 0.35 || !!onBlue;
  const fills = dark
    ? ["fill-brand-blue", "fill-brand-blue-deep", "fill-white/12", "fill-white"]
    : ["fill-hero-black", "fill-brand-blue-deep", "fill-white/15", "fill-white"];
  const decos = shuffle(rand, [
    "stripes",
    "ring",
    "disc",
    "half",
    "dots",
    "stripes",
    "disc",
  ] as Deco[]);
  const tileFills = shuffle(rand, [...fills, ...fills]);
  // Tiles around the article; (vx, vy) is the middle of each one's visible part.
  const tiles = [
    { x: -140, y: -220, vx: 180, vy: 140 },
    { x: 400, y: -220, vx: 650, vy: 140 },
    { x: 940, y: -220, vx: 1190, vy: 140 },
    { x: 1480, y: -220, vx: 1540, vy: 140 },
    { x: 1480, y: 320, vx: 1540, vy: 570 },
    { x: -140, y: 860, vx: 180, vy: 930 },
    { x: 400, y: 860, vx: 650, vy: 930 },
    { x: 940, y: 860, vx: 1190, vy: 930 },
    { x: 1480, y: 860, vx: 1540, vy: 930 },
  ];
  return (
    <>
      <rect width={W} height={H} className={dark ? "fill-hero-black" : "fill-brand-blue"} />
      {tiles.map((t, i) => {
        const fill = tileFills[i % tileFills.length];
        const onWhite = fill === "fill-white";
        const deco = decos[i % decos.length];
        const edge = t.x >= 1480; // a sliver at the right edge: colour only
        const low = t.y === 860; // only a band shows at the bottom
        const ink = onWhite ? "fill-brand-blue" : "fill-white";
        const line = onWhite ? "stroke-brand-blue" : "stroke-white";
        return (
          <g key={i}>
            <rect x={t.x} y={t.y} width={500} height={500} rx={40} className={fill} />
            {!edge &&
              deco === "stripes" &&
              Array.from({ length: 10 }, (_, k) => (
                <line
                  key={k}
                  x1={t.x + 70 + k * 40}
                  x2={t.x + 70 + k * 40}
                  y1={Math.max(t.y + 40, 0)}
                  y2={Math.min(t.y + 460, H)}
                  className={onWhite ? "stroke-brand-blue/45" : "stroke-white/45"}
                  strokeWidth={4}
                />
              ))}
            {!edge && deco === "ring" && (
              <circle
                cx={t.vx}
                cy={low ? t.vy + 60 : t.vy}
                r={low ? 120 : 100}
                fill="none"
                className={line}
                strokeWidth={10}
              />
            )}
            {!edge && deco === "disc" && (
              <circle
                cx={t.vx}
                cy={low ? t.vy + 80 : t.vy + 20}
                r={low ? 130 : 110}
                className={ink}
              />
            )}
            {!edge && deco === "half" && (
              <path
                d={`M${t.vx - 130} ${t.y + 500} A130 130 0 0 1 ${t.vx + 130} ${t.y + 500} Z`}
                className={ink}
              />
            )}
            {!edge && deco === "dots" && (
              <g className={ink}>
                {[-1, 0, 1].flatMap((dx) =>
                  [-1, 1].map((dy) => (
                    <circle key={`${dx}${dy}`} cx={t.vx + dx * 70} cy={t.vy + dy * 38} r={22} />
                  )),
                )}
              </g>
            )}
          </g>
        );
      })}

      {/* The spark: the Rankbox mark on its own tile. */}
      <rect
        x={-140}
        y={320}
        width={500}
        height={500}
        rx={40}
        className={dark ? "fill-white" : "fill-hero-black"}
      />
      <BrandGlyph
        cx={200}
        cy={570}
        size={230}
        className={dark ? "fill-brand-blue stroke-brand-blue" : "fill-white stroke-white"}
      />

      {/* The article: headline, a highlighted answer-first block, body. */}
      <g transform="translate(400 320)">
        <rect width={1040} height={500} rx={40} className="fill-white" />
        <circle cx={78} cy={70} r={24} className="fill-brand-blue" />
        <BrandGlyph cx={78} cy={70} size={26} className="fill-white stroke-white" />
        <rect x={118} y={62} width={170} height={16} rx={8} className="fill-ink/15" />
        <rect x={860} y={52} width={120} height={36} rx={18} className="fill-brand-blue/12" />
        <circle cx={886} cy={70} r={7} className="fill-brand-blue" />
        <rect x={60} y={128} width={760} height={46} rx={12} className="fill-ink" />
        <rect x={60} y={188} width={520} height={46} rx={12} className="fill-ink" />
        <rect x={60} y={268} width={920} height={124} rx={16} className="fill-brand-blue/10" />
        <rect x={60} y={268} width={10} height={124} rx={5} className="fill-brand-blue" />
        {[820, 780, 520].map((w, i) => (
          <rect
            key={i}
            x={100}
            y={296 + i * 30}
            width={w}
            height={14}
            rx={7}
            className="fill-brand-blue/55"
          />
        ))}
        {[900, 700].map((w, i) => (
          <rect
            key={i}
            x={60}
            y={420 + i * 32}
            width={w}
            height={14}
            rx={7}
            className="fill-ink/15"
          />
        ))}
      </g>
    </>
  );
}

/* ---------- entity graph ---------- */

const GRAPH_TONES = {
  black: {
    field: "fill-hero-black",
    solid: "fill-brand-blue",
    ring: "stroke-brand-blue",
    wire: "stroke-brand-blue/70",
    dot: "fill-brand-blue",
    hub: "fill-white",
    mark: "fill-brand-blue stroke-brand-blue",
  },
  blue: {
    field: "fill-brand-blue",
    solid: "fill-hero-black",
    ring: "stroke-white",
    wire: "stroke-white/70",
    dot: "fill-white",
    hub: "fill-white",
    mark: "fill-brand-blue stroke-brand-blue",
  },
  paper: {
    field: PAPER,
    solid: "fill-brand-blue",
    ring: "stroke-ink",
    wire: "stroke-ink/40",
    dot: "fill-ink",
    hub: "fill-hero-black",
    mark: "fill-white stroke-white",
  },
} as const;

/* Entities as circles joined by hairlines, with the brand at the hub: either
   a network or orbits around it. After Webflow's node-and-circle covers. */
export function GraphScene({ seed, onBlue }: SceneProps) {
  const rand = random(seed);
  const t = GRAPH_TONES[toneFor(rand, ["black", "blue", "paper"] as const, onBlue, "black")];
  const j = (n: number) => jitter(rand, n);
  const mirror = rand() < 0.5;
  const orbit = rand() < 0.45;

  const hubMark = (hub: Node) => (
    <>
      <circle cx={hub.x} cy={hub.y} r={hub.r + 34} fill="none" className={t.ring} strokeWidth={3} />
      <circle cx={hub.x} cy={hub.y} r={hub.r} className={t.hub} />
      <BrandGlyph cx={hub.x} cy={hub.y} size={hub.r * 1.04} className={t.mark} />
    </>
  );

  let body;
  if (orbit) {
    const hub = { x: 600 + j(60), y: 500 + j(40), r: 96 };
    const radii = [230, 370, 520];
    const at = (r: number, deg: number) => ({
      x: hub.x + r * Math.cos((deg * Math.PI) / 180),
      y: hub.y + r * Math.sin((deg * Math.PI) / 180),
    });
    const spin = j(40);
    const sats = [
      { ...at(radii[0], -40 + spin), r: 30, kind: "dot" },
      { ...at(radii[0], 150 + spin), r: 22, kind: "dot" },
      { ...at(radii[1], 20 + spin), r: 64, kind: "ring" },
      { ...at(radii[1], 215 + spin), r: 44, kind: "ring" },
      { ...at(radii[2], -70 + spin), r: 26, kind: "dot" },
      { ...at(radii[2], 95 + spin), r: 90, kind: "solid" },
    ];
    body = (
      <>
        <circle cx={1440 + j(40)} cy={170 + j(40)} r={290} className={t.solid} />
        {radii.map((r) => (
          <circle
            key={r}
            cx={hub.x}
            cy={hub.y}
            r={r}
            fill="none"
            className={t.wire}
            strokeWidth={3}
          />
        ))}
        <Wire a={hub} b={{ ...sats[2], r: 64 }} className={t.wire} />
        <Wire a={hub} b={{ ...sats[4], r: 26 }} className={t.wire} />
        {sats.map((s, i) =>
          s.kind === "ring" ? (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              className={`${t.field} ${t.ring}`}
              strokeWidth={6}
            />
          ) : (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              className={s.kind === "solid" ? t.solid : t.dot}
            />
          ),
        )}
        {hubMark(hub)}
      </>
    );
  } else {
    const A = { x: 120 + j(40), y: 40 + j(30), r: 0 };
    const B = { x: 1260 + j(60), y: 1190, r: 0 };
    const hub = { x: 820 + j(40), y: 440 + j(30), r: 100 };
    const o1 = { x: 1330 + j(40), y: 250 + j(40), r: 140 };
    const o2 = { x: 420 + j(40), y: 770 + j(30), r: 108 };
    const dots = [
      { x: 640 + j(30), y: 110 + j(20), r: 14 },
      { x: 1110 + j(30), y: 100 + j(20), r: 14 },
      { x: 250, y: 560 + j(30), r: 14 },
    ];
    const wires: [Node, Node][] = [
      [A, hub],
      [hub, o1],
      [hub, o2],
      [hub, B],
      [o1, { x: W + 40, y: 90, r: 0 }],
      [o2, B],
      [hub, dots[0]],
      [o1, dots[1]],
      [o2, dots[2]],
    ];
    body = (
      <>
        {wires.map(([a, b], i) => (
          <Wire key={i} a={a} b={b} className={t.wire} />
        ))}
        <circle cx={A.x} cy={A.y} r={380} className={t.solid} />
        <circle cx={B.x} cy={B.y} r={470} className={t.solid} />
        {[o1, o2].map((o, i) => (
          <circle
            key={i}
            cx={o.x}
            cy={o.y}
            r={o.r}
            fill="none"
            className={t.ring}
            strokeWidth={6}
          />
        ))}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} className={t.dot} />
        ))}
        {hubMark(hub)}
      </>
    );
  }

  return (
    <>
      <rect width={W} height={H} className={t.field} />
      <g transform={mirror ? `matrix(-1 0 0 1 ${W} 0)` : undefined}>{body}</g>
    </>
  );
}
