/* Scenes about how AI reaches a site: crawlers, their user agents, and the
   files (llms.txt, schema) written for them. */
import { BotFace, Check } from "./glyphs";
import { H, PAPER, W, jitter, pick, random, toneFor, type SceneProps } from "./kit";

const BOTS = ["GPTBot", "ClaudeBot", "PerplexityBot", "OAI-SearchBot"];

/* The user agent the post is about, else the robots.txt wildcard. */
function botFor(title: string): string {
  const named = BOTS.find((b) => title.toLowerCase().includes(b.toLowerCase()));
  if (named) return named;
  if (/\bbing\b/i.test(title)) return "Bingbot";
  if (/chatgpt/i.test(title)) return "ChatGPT-User";
  return "User-agent: *";
}

const CRAWL_TONES = {
  blue: {
    field: "fill-brand-blue",
    trace: "stroke-white",
    ring: "fill-brand-blue stroke-white",
    tip: "fill-white",
    page: "fill-hero-black",
    pill: "fill-white",
  },
  black: {
    field: "fill-hero-black",
    trace: "stroke-white/70",
    ring: "fill-hero-black stroke-white",
    tip: "fill-white",
    page: "fill-brand-blue",
    pill: "fill-white",
  },
  paper: {
    field: PAPER,
    trace: "stroke-ink/55",
    ring: `${PAPER} stroke-ink`,
    tip: "fill-ink",
    page: "fill-hero-black",
    pill: "fill-white stroke-ink/15",
  },
} as const;

/* A bot's user agent wired into a page that a scan line is reading. After
   Webflow's circuit covers (black blocks, hairline traces, node rings). */
export function CrawlScene({ seed, title, uid, onBlue }: SceneProps) {
  const rand = random(seed);
  const t =
    CRAWL_TONES[toneFor(rand, ["blue", "blue", "black", "paper"] as const, onBlue, "black")];
  const article = rand() < 0.5;
  const scanY = 430 + rand() * 200;
  const shield = /cloudflare|block|firewall|challenge/i.test(title);
  const traces = [
    "M0 240 H330 V430",
    "M0 820 H250 V570",
    "M700 470 H790 V300 H860",
    "M700 530 H790 V720 H860",
    `M${500 + jitter(rand, 60)} 0 V110 H690`,
    `M${560 + jitter(rand, 60)} 1000 V880 H720`,
  ];
  const rings = [
    { x: 330, y: 240 },
    { x: 250, y: 820 },
    { x: 690, y: 110 },
    { x: 720, y: 880 },
  ];
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity={0} />
          <stop offset="1" stopColor="white" stopOpacity={0.28} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} className={t.field} />
      <g fill="none" className={t.trace} strokeWidth={5}>
        {traces.map((d) => (
          <path key={d} d={d} strokeLinejoin="round" />
        ))}
      </g>

      {/* The page being read: a landing page or an article with a rail. */}
      <rect x={860} y={150} width={880} height={950} rx={44} className={t.page} />
      <g transform="translate(860 150)">
        {[50, 82, 114].map((cx) => (
          <circle key={cx} cx={cx} cy={52} r={9} className="fill-white/35" />
        ))}
        <rect x={150} y={38} width={440} height={28} rx={14} className="fill-white/12" />
        <rect x={60} y={128} width={470} height={42} rx={10} className="fill-white" />
        <rect x={60} y={186} width={330} height={42} rx={10} className="fill-white" />
        {article ? (
          <>
            {[520, 480, 540, 500, 360, 520, 470, 540, 300].map((w, i) => (
              <rect
                key={i}
                x={60}
                y={276 + i * 40}
                width={w}
                height={14}
                rx={7}
                className={i === 4 ? "fill-white/0" : "fill-white/35"}
              />
            ))}
            {[128, 290, 452].map((y) => (
              <rect
                key={y}
                x={640}
                y={y}
                width={200}
                height={130}
                rx={18}
                className="fill-white/10"
              />
            ))}
          </>
        ) : (
          <>
            {[560, 520, 400].map((w, i) => (
              <rect
                key={i}
                x={60}
                y={262 + i * 34}
                width={w}
                height={14}
                rx={7}
                className="fill-white/35"
              />
            ))}
            <rect
              x={60}
              y={390}
              width={300}
              height={230}
              rx={22}
              fill="none"
              className="stroke-white/45"
              strokeWidth={3}
            />
            <circle cx={128} cy={458} r={24} className="fill-white/40" />
            <path d="M84 596 L190 486 L262 562 L296 530 L336 596 Z" className="fill-white/25" />
            <rect x={390} y={390} width={300} height={230} rx={22} className="fill-white/10" />
            {[600, 540, 580].map((w, i) => (
              <rect
                key={i}
                x={60}
                y={664 + i * 34}
                width={w}
                height={14}
                rx={7}
                className="fill-white/25"
              />
            ))}
          </>
        )}
      </g>
      <rect x={860} y={scanY - 170} width={880} height={170} fill={`url(#${uid}-beam)`} />
      <rect x={860} y={scanY - 3} width={880} height={6} className="fill-white" />

      {rings.map(({ x, y }) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={13} className={t.ring} strokeWidth={5} />
      ))}
      {[300, 720].map((y) => (
        <circle key={y} cx={860} cy={y} r={11} className={t.tip} />
      ))}

      {/* Where Cloudflare's challenge sits: the gate the bot has to pass. */}
      {shield && (
        <g transform="translate(790 500)">
          <path
            d="M0 -62 L52 -42 V4 C52 40 28 60 0 72 C-28 60 -52 40 -52 4 V-42 Z"
            className="fill-white stroke-hero-black/10"
            strokeWidth={3}
          />
          <Check cx={0} cy={2} className="stroke-brand-blue" />
        </g>
      )}

      {/* The crawler. */}
      <rect x={150} y={430} width={550} height={140} rx={70} className={t.pill} strokeWidth={3} />
      <BotFace cx={224} cy={500} r={36} />
      <text
        x={282}
        y={502}
        dominantBaseline="central"
        fontSize={48}
        fontWeight={600}
        className="fill-ink font-mono"
      >
        {botFor(title)}
      </text>
    </>
  );
}

/* ---------- user-agent directory ---------- */

const AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Bingbot",
];

/* The AI crawlers as a robots.txt allow-list, the one the post is about
   highlighted. For crawler directories, censuses and user-agent docs. */
export function BotsScene({ seed, title, onBlue }: SceneProps) {
  const rand = random(seed);
  const tone = toneFor(rand, ["blue", "black", "paper"] as const, onBlue, "black");
  // On the pale field the table goes dark, so it still stands off the page.
  const darkCard = tone === "paper";
  const field = { blue: "fill-brand-blue", black: "fill-hero-black", paper: PAPER }[tone];
  const solid = tone === "blue" ? "fill-hero-black" : "fill-brand-blue";
  const trace = { blue: "stroke-white", black: "stroke-white/60", paper: "stroke-ink/50" }[tone];
  const named = AGENTS.find((a) => title.toLowerCase().includes(a.toLowerCase()));
  const blocked = new Set([
    pick(rand, ["CCBot", "Google-Extended"]),
    ...(rand() < 0.5 ? ["Bingbot"] : []),
  ]);
  const text = darkCard ? "fill-white/85" : "fill-ink/80";
  return (
    <>
      <rect width={W} height={H} className={field} />
      <circle cx={80} cy={930} r={330} className={solid} />
      <g fill="none" className={trace} strokeWidth={5} strokeLinejoin="round">
        <path d="M0 200 H300 V330 H520" />
        <path d="M180 0 V120 H420" />
        <path d="M420 1000 V760 H520" />
      </g>
      {[
        { x: 300, y: 200 },
        { x: 420, y: 120 },
        { x: 420, y: 760 },
      ].map(({ x, y }) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={13}
          className={`${field} ${trace}`}
          strokeWidth={5}
        />
      ))}

      <g transform="translate(520 110)">
        <rect
          width={1200}
          height={1000}
          rx={44}
          className={darkCard ? "fill-hero-black" : "fill-white"}
        />
        <text
          x={70}
          y={80}
          dominantBaseline="central"
          fontSize={28}
          className={`font-mono ${darkCard ? "fill-white/40" : "fill-ink/40"}`}
        >
          User-agent
        </text>
        <text
          x={868}
          y={80}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={28}
          className={`font-mono ${darkCard ? "fill-white/40" : "fill-ink/40"}`}
        >
          Allow
        </text>
        {AGENTS.map((a, i) => {
          const y = 130 + i * 100;
          const on = !blocked.has(a);
          return (
            <g key={a}>
              {a === named && (
                <rect
                  x={24}
                  y={y + 8}
                  width={1152}
                  height={84}
                  rx={20}
                  className="fill-brand-blue/15"
                />
              )}
              <line
                x1={40}
                x2={1200}
                y1={y}
                y2={y}
                className={darkCard ? "stroke-white/10" : "stroke-ink/8"}
                strokeWidth={2}
              />
              <BotFace cx={100} cy={y + 50} r={26} />
              <text
                x={150}
                y={y + 52}
                dominantBaseline="central"
                fontSize={40}
                fontWeight={a === named ? 700 : 500}
                className={`font-mono ${text}`}
              >
                {a}
              </text>
              <rect
                x={820}
                y={y + 24}
                width={96}
                height={52}
                rx={26}
                className={on ? "fill-brand-blue" : darkCard ? "fill-white/15" : "fill-ink/15"}
              />
              <circle cx={on ? 890 : 846} cy={y + 50} r={20} className="fill-white" />
            </g>
          );
        })}
      </g>
    </>
  );
}

/* ---------- file ---------- */

type Tone = "strong" | "plain" | "dim" | "accent" | "key" | "str";
type CodeLine = { indent?: number; parts: [string, Tone][] };

const LLMS_TXT: CodeLine[] = [
  { parts: [["# Your Company", "strong"]] },
  { parts: [["> What you do, in one sentence.", "dim"]] },
  { parts: [] },
  { parts: [["## Docs", "accent"]] },
  {
    parts: [
      ["- [Pricing](", "plain"],
      ["/pricing", "str"],
      [")", "plain"],
    ],
  },
  {
    parts: [
      ["- [How it works](", "plain"],
      ["/how", "str"],
      [")", "plain"],
    ],
  },
  {
    parts: [
      ["- [FAQ](", "plain"],
      ["/faq", "str"],
      ["): the short answers", "dim"],
    ],
  },
  { parts: [] },
  { parts: [["## Optional", "accent"]] },
  {
    parts: [
      ["- [Blog](", "plain"],
      ["/blog", "str"],
      [")", "plain"],
    ],
  },
];

const JSON_LD: CodeLine[] = [
  { parts: [["{", "plain"]] },
  {
    indent: 1,
    parts: [
      ['"@type"', "key"],
      [": ", "plain"],
      ['"Organization"', "str"],
      [",", "plain"],
    ],
  },
  {
    indent: 1,
    parts: [
      ['"name"', "key"],
      [": ", "plain"],
      ['"Your Company"', "str"],
      [",", "plain"],
    ],
  },
  {
    indent: 1,
    parts: [
      ['"url"', "key"],
      [": ", "plain"],
      ['"https://yoursite.com"', "str"],
      [",", "plain"],
    ],
  },
  {
    indent: 1,
    parts: [
      ['"logo"', "key"],
      [": ", "plain"],
      ['"/logo.png"', "str"],
      [",", "plain"],
    ],
  },
  {
    indent: 1,
    parts: [
      ['"sameAs"', "key"],
      [": [", "plain"],
    ],
  },
  {
    indent: 2,
    parts: [
      ['"https://www.wikidata.org/…"', "str"],
      [",", "plain"],
    ],
  },
  { indent: 2, parts: [['"https://www.linkedin.com/…"', "str"]] },
  { indent: 1, parts: [["]", "plain"]] },
  { parts: [["}", "plain"]] },
];

const ON_BLACK: Record<Tone, string> = {
  strong: "fill-white",
  plain: "fill-white/75",
  dim: "fill-white/45",
  accent: "fill-[color-mix(in_oklab,var(--brand-blue)_70%,white)]",
  key: "fill-white",
  str: "fill-[color-mix(in_oklab,var(--brand-blue)_70%,white)]",
};

const ON_WHITE: Record<Tone, string> = {
  strong: "fill-ink",
  plain: "fill-ink/75",
  dim: "fill-ink/45",
  accent: "fill-brand-blue",
  key: "fill-ink",
  str: "fill-brand-blue",
};

/* The file the post is about, open in an editor. llms.txt posts show an
   llms.txt; schema posts show Organization JSON-LD. */
export function FileScene({ seed, title }: SceneProps) {
  const rand = random(seed);
  const dark = rand() < 0.4;
  const schema = /schema/i.test(title) && !/llms/i.test(title);
  const code = schema ? JSON_LD : LLMS_TXT;
  const tones = dark ? ON_WHITE : ON_BLACK;
  const filled = code.map((l, i) => (l.parts.length ? i : -1)).filter((i) => i >= 0);
  const focus = pick(rand, filled);
  const lineY = (i: number) => 330 + i * 64;
  return (
    <>
      <rect width={W} height={H} className={dark ? "fill-hero-black" : PAPER} />

      {/* Block, stripes and quarter disc: the flat geometry on the left. */}
      <rect
        width={500}
        height={400}
        className={dark ? "fill-brand-blue-deep" : "fill-brand-blue"}
      />
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={i}
          x1={60 + i * 48}
          x2={60 + i * 48}
          y1={0}
          y2={340}
          className="stroke-white/40"
          strokeWidth={4}
        />
      ))}
      <circle cx={0} cy={H} r={470} className={dark ? "fill-brand-blue" : "fill-hero-black"} />

      {/* The editor. */}
      <rect
        x={580}
        y={140}
        width={1080}
        height={960}
        rx={40}
        className={dark ? "fill-white" : "fill-hero-black"}
      />
      {[630, 662, 694].map((cx) => (
        <circle
          key={cx}
          cx={cx}
          cy={195}
          r={10}
          className={dark ? "fill-ink/15" : "fill-white/25"}
        />
      ))}
      <text
        x={1060}
        y={197}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={32}
        className={`font-mono ${dark ? "fill-ink/50" : "fill-white/55"}`}
      >
        {schema ? "schema.json" : "llms.txt"}
      </text>
      <line
        x1={580}
        x2={1660}
        y1={248}
        y2={248}
        className={dark ? "stroke-ink/10" : "stroke-white/10"}
        strokeWidth={2}
      />
      <rect
        x={600}
        y={lineY(focus) - 34}
        width={1060}
        height={58}
        className={dark ? "fill-brand-blue/12" : "fill-brand-blue/25"}
      />
      {code.map((line, i) => (
        <g key={i} className="font-mono">
          <text
            x={636}
            y={lineY(i)}
            textAnchor="end"
            fontSize={30}
            className={dark ? "fill-ink/25" : "fill-white/25"}
          >
            {i + 1}
          </text>
          <text x={668 + (line.indent ?? 0) * 48} y={lineY(i)} fontSize={40}>
            {line.parts.map(([text, tone], j) => (
              <tspan key={j} className={tones[tone]} fontWeight={tone === "strong" ? 700 : 400}>
                {text}
              </tspan>
            ))}
          </text>
        </g>
      ))}
    </>
  );
}
