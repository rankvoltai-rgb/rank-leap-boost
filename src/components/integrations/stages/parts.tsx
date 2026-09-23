/**
 * What the hero scenes are made of: the tool's palette as CSS variables, the
 * window chrome, the Rankbox call as each tool shows it, the three kinds of
 * result, and the code change the coding agents make.
 *
 * Everything reads the scene's own variables (--st-*), never the site's
 * tokens, so a tool's screen looks like that tool in light and dark mode.
 */
import type { CSSProperties, ReactNode } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Connector } from "@/data/connectors";
import { TOOL_NAMES, type RankboxTool, type ToolSample } from "@/data/ai-integration-samples";
import type { HeroTheme, ToolHero } from "@/data/tool-heroes";
import { ConnectorLogo } from "@/components/dashboard/connector-logo";
import { RankboxTile } from "../visuals";
import { APPLY, type Phase } from "./story";

/* ---------- Palette ---------- */

type Rgb = [number, number, number];

const THEMES: Record<HeroTheme, { dark: boolean } & Record<string, string | boolean>> = {
  light: {
    dark: false,
    bg: "#FFFFFF",
    panel: "#F7F7F8",
    sunken: "#F0F0F2",
    border: "#E4E4E8",
    text: "#0B0B0F",
    muted: "#6B6B76",
    faint: "#A1A1AA",
  },
  warm: {
    dark: false,
    bg: "#FAF9F5",
    panel: "#F3F1EA",
    sunken: "#ECE9DF",
    border: "#E2DDD0",
    text: "#1F1E1B",
    muted: "#736F67",
    faint: "#A7A298",
  },
  dark: {
    dark: true,
    bg: "#121214",
    panel: "#19191C",
    sunken: "#0D0D0F",
    border: "#2A2A2F",
    text: "#EDEDF0",
    muted: "#8E8E99",
    faint: "#5C5C66",
  },
  navy: {
    dark: true,
    bg: "#0F1624",
    panel: "#141D2E",
    sunken: "#0B111C",
    border: "#243048",
    text: "#E4EBF5",
    muted: "#8B9AB2",
    faint: "#56647C",
  },
  ember: {
    dark: true,
    bg: "#1B1A17",
    panel: "#23221E",
    sunken: "#151411",
    border: "#36342D",
    text: "#EEEBE3",
    muted: "#9C978B",
    faint: "#625E55",
  },
};

const rgb = (hex: string): Rgb => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (c: Rgb) =>
  `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
function luminance(c: Rgb) {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
}
function contrast(a: Rgb, b: Rgb) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
function saturation(c: Rgb) {
  const max = Math.max(...c) / 255;
  const min = Math.min(...c) / 255;
  if (max === min) return 0;
  const l = (max + min) / 2;
  return (max - min) / (l > 0.5 ? 2 - max - min : max + min);
}

/** A color is "brand-colored" when it has hue to it, not a black or a white. */
function colorful(c: Rgb) {
  const l = luminance(c);
  return saturation(c) > 0.35 && l > 0.02 && l < 0.85;
}

/** The accent, nudged toward black or white until it reads as text on `bg`. */
function readable(accent: Rgb, bg: Rgb, dark: boolean) {
  const toward: Rgb = dark ? [255, 255, 255] : [0, 0, 0];
  for (let t = 0; t <= 1; t += 0.08) {
    const c = mix(accent, toward, t);
    if (contrast(c, bg) >= 4.5) return c;
  }
  return toward;
}

/** The scene's variables: the theme's surfaces, and the accent made safe to use on them. */
export function stageStyle(hero: ToolHero): CSSProperties & { glow: string } {
  const t = THEMES[hero.theme];
  const bg = rgb(t.bg as string);
  const accent = rgb(hero.accent);
  const vivid = colorful(accent);
  // White on a brand color, as the brands themselves do; dark only on the
  // pale accents (mint, lilac, near-white) where white would vanish.
  const onAccent = contrast([255, 255, 255], accent) >= 2.7 ? "#FFFFFF" : "#0B0B0F";
  const code = t.dark
    ? { kw: "#C4A1FF", str: "#F2C27F", tag: "#7CC4FF", add: "#3FB950", del: "#F85149" }
    : { kw: "#7C3AED", str: "#B45309", tag: "#0369A1", add: "#1A7F37", del: "#CF222E" };
  const vars: Record<string, string> = {
    "--st-bg": t.bg as string,
    "--st-panel": t.panel as string,
    "--st-sunken": t.sunken as string,
    "--st-border": t.border as string,
    "--st-text": t.text as string,
    "--st-muted": t.muted as string,
    "--st-faint": t.faint as string,
    "--st-accent": hero.accent,
    "--st-on-accent": onAccent,
    "--st-accent-ink": toHex(readable(accent, bg, t.dark)),
    // A tinted bubble for brand colors; a plain one for black or white accents.
    "--st-bubble": vivid ? toHex(mix(accent, bg, t.dark ? 0.8 : 0.88)) : (t.sunken as string),
    "--st-ring": t.dark ? "rgba(255,255,255,0.09)" : "rgba(8,20,48,0.08)",
    "--st-kw": code.kw,
    "--st-str": code.str,
    "--st-tag": code.tag,
    "--st-add": code.add,
    "--st-del": code.del,
  };
  return { ...(vars as CSSProperties), glow: vivid ? hero.accent : "#FFFFFF" };
}

/* ---------- Motion ---------- */

/** Rises and fades in on mount. Stagger with `wait(i)`. */
export const ENTER =
  "animate-in fade-in slide-in-from-bottom-1.5 fill-mode-both duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none";

/** A loading bar on a white sample site, whatever the site's theme. */
export const SITE_SHIMMER =
  "animate-[shimmer-slide_1.6s_ease-in-out_infinite] bg-[linear-gradient(90deg,rgb(21_32_26/0.07),rgb(21_32_26/0.16),rgb(21_32_26/0.07))] bg-[length:200%_100%] motion-reduce:animate-none";

export const wait = (i: number, step = 90, base = 0): CSSProperties => ({
  animationDelay: `${base + i * step}ms`,
});

export function Caret({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[0.18em] animate-caret-blink bg-(--st-accent-ink) motion-reduce:animate-none",
        className,
      )}
    />
  );
}

/* ---------- Chrome ---------- */

export function Lights({ className }: { className?: string }) {
  return (
    <span className={cn("flex shrink-0 gap-1.5", className)} aria-hidden>
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2.5 w-2.5 rounded-full bg-(--st-text)/12" />
      ))}
    </span>
  );
}

/** The title bar: traffic lights, then the tool's own header. */
export function Chrome({
  children,
  center,
  right,
  className,
}: {
  children?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-10 shrink-0 items-center gap-2.5 border-b border-(--st-border) px-3.5",
        className,
      )}
    >
      <Lights />
      {children}
      {center && (
        <span className="absolute left-1/2 max-w-[60%] -translate-x-1/2 truncate text-[11px] font-medium text-(--st-muted)">
          {center}
        </span>
      )}
      {right && <span className="ml-auto flex shrink-0 items-center gap-2">{right}</span>}
    </div>
  );
}

/** The tool's app icon. Decorative: the scene's label names it. */
export function ToolMark({ tool, className }: { tool: Connector; className?: string }) {
  return (
    <span aria-hidden className="contents">
      <ConnectorLogo connector={tool} className={cn("h-5 w-5 rounded-[28%]", className)} />
    </span>
  );
}

/** Rankbox being called, the way a tool lists a tool call. */
export function CallPill({
  task,
  done,
  className,
  short = false,
}: {
  task: RankboxTool;
  done: boolean;
  className?: string;
  /** Leave out the function name, for narrow columns. */
  short?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border border-(--st-border) bg-(--st-panel) py-[3px] pl-[3px] pr-2.5 text-[11px] leading-none",
        className,
      )}
    >
      <RankboxTile tone="brand" className="h-[18px] w-[18px]" />
      <span className="font-semibold">Rankbox</span>
      {!short && (
        <span className="min-w-0 truncate font-mono text-[10px] text-(--st-muted)">
          {TOOL_NAMES[task].mcp}
        </span>
      )}
      {done ? (
        <Check className="h-3 w-3 shrink-0 text-(--st-add)" strokeWidth={3} />
      ) : (
        <Loader2 className="h-3 w-3 shrink-0 animate-spin text-(--st-muted) motion-reduce:animate-none" />
      )}
    </span>
  );
}

/** "12 questions in 4 groups": what came back, in a few words. */
export function taskSummary(task: RankboxTool, s: ToolSample): string {
  if (task === "questions") {
    const n = s.questions.reduce((sum, g) => sum + g.questions.length, 0);
    return `${n} questions in ${s.questions.length} groups`;
  }
  if (task === "brief") return `a ${s.brief.outline.length}-section brief`;
  const lengths = s.meta.map((m) => m.length);
  return `3 options, ${Math.min(...lengths)}–${Math.max(...lengths)} characters`;
}

/* ---------- Results ---------- */

const INTENT_COLOR: Record<string, string> = {
  Informational: "#3B82F6",
  Commercial: "#8B5CF6",
  Comparison: "#F59E0B",
  Transactional: "#10B981",
};

export function IntentDot({ intent }: { intent: string }) {
  return (
    <span
      className="h-1.5 w-1.5 shrink-0 rounded-full"
      style={{ background: INTENT_COLOR[intent] ?? "currentColor" }}
    />
  );
}

/** The question groups: intent, its top question, and how many there are. */
export function QuestionsResult({
  sample,
  labels = true,
  base = 0,
}: {
  sample: ToolSample;
  labels?: boolean;
  base?: number;
}) {
  return (
    <ul className="divide-y divide-(--st-border)">
      {sample.questions.map((g, i) => (
        <li
          key={g.intent}
          style={wait(i, 110, base)}
          className={cn(ENTER, "flex items-center gap-2 py-[7px] first:pt-0 last:pb-0")}
        >
          {labels ? (
            <span className="flex w-[6.5rem] shrink-0 items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.07em] text-(--st-muted)">
              <IntentDot intent={g.intent} />
              {g.intent}
            </span>
          ) : (
            <IntentDot intent={g.intent} />
          )}
          <span className="min-w-0 flex-1 truncate text-[11.5px]">{g.questions[0]}</span>
          <span className="shrink-0 rounded-md bg-(--st-sunken) px-1.5 py-px text-[10px] tabular-nums text-(--st-muted)">
            {g.questions.length}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** The brief: working title, the outline, and (room permitting) its entities. */
export function BriefResult({
  sample,
  max = 4,
  entities = true,
  base = 0,
}: {
  sample: ToolSample;
  max?: number;
  entities?: boolean;
  base?: number;
}) {
  const { brief } = sample;
  return (
    <div>
      <p style={wait(0, 0, base)} className={cn(ENTER, "text-[12.5px] font-semibold leading-snug")}>
        {brief.title}
      </p>
      <ol className="mt-2 space-y-[5px]">
        {brief.outline.slice(0, max).map((o, i) => (
          <li
            key={o.heading}
            style={wait(i + 1, 90, base)}
            className={cn(ENTER, "flex items-baseline gap-2 text-[11.5px]")}
          >
            <span className="font-mono text-[9px] font-semibold text-(--st-accent-ink)">H2</span>
            <span className="min-w-0 truncate">{o.heading}</span>
          </li>
        ))}
      </ol>
      {entities && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {brief.entities.slice(0, 4).map((e, i) => (
            <span
              key={e}
              style={wait(max + 1 + i, 60, base)}
              className={cn(
                ENTER,
                "rounded-md border border-(--st-border) px-1.5 py-0.5 text-[10px] text-(--st-muted)",
              )}
            >
              {e}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Three meta descriptions with their real lengths; `pick` marks the one used. */
export function MetaResult({
  sample,
  pick,
  max = 3,
  base = 0,
}: {
  sample: ToolSample;
  pick?: number;
  max?: number;
  base?: number;
}) {
  return (
    <ol className="space-y-1">
      {sample.meta.slice(0, max).map((m, i) => (
        <li
          key={m}
          style={wait(i, 120, base)}
          className={cn(
            ENTER,
            "flex items-start gap-2 rounded-lg px-2 py-1.5 ring-1 transition-colors duration-500",
            pick === i ? "bg-(--st-accent)/10 ring-(--st-accent)/45" : "ring-transparent",
          )}
        >
          <span className="mt-px font-mono text-[10px] text-(--st-muted)">{i + 1}</span>
          <p className="line-clamp-2 min-w-0 flex-1 text-[11px] leading-snug">{m}</p>
          <span className="mt-px shrink-0 font-mono text-[9.5px] tabular-nums text-(--st-add)">
            {m.length}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ---------- The coding agents' change ---------- */

export interface CodeLine {
  kind: "ctx" | "add" | "del";
  text: string;
  /** Wraps instead of running off the edge: a long string worth reading. */
  wrap?: boolean;
}

export interface CodeChange {
  path: string;
  file: string;
  isNew: boolean;
  lines: CodeLine[];
}

const ctx = (text: string): CodeLine => ({ kind: "ctx", text });
const add = (text: string, wrap = false): CodeLine => ({ kind: "add", text, wrap });
const del = (text: string): CodeLine => ({ kind: "del", text });

/** The edit each task ends in, on the coding sample (Plannora, a project tool). */
export function codeChange(task: RankboxTool, s: ToolSample): CodeChange {
  if (task === "meta") {
    return {
      path: "app/pricing/page.tsx",
      file: "page.tsx",
      isNew: false,
      lines: [
        ctx('import type { Metadata } from "next";'),
        ctx(""),
        ctx("export const metadata: Metadata = {"),
        ctx('  title: "Pricing · Plannora",'),
        del('  description: "Plannora pricing",'),
        add("  description:"),
        add(`    "${s.meta[0]}",`, true),
        ctx("};"),
        ctx(""),
        ctx("export default function Pricing() {"),
        ctx("  return <PricingTable />;"),
        ctx("}"),
      ],
    };
  }
  if (task === "brief") {
    const slug = s.input.brief.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return {
      path: `app/blog/${slug}/page.tsx`,
      file: "page.tsx",
      isNew: true,
      lines: [
        add("export const metadata = {"),
        add(`  title: "${s.brief.title}",`),
        add("};"),
        add(""),
        add("export default function Post() {"),
        add("  return ("),
        add("    <Article>"),
        ...s.brief.outline.slice(0, 4).map((o) => add(`      <Section title="${o.heading}" />`)),
        add("    </Article>"),
        add("  );"),
        add("}"),
      ],
    };
  }
  const top = [
    ...s.questions[1].questions.slice(0, 2),
    ...s.questions[3].questions.slice(0, 2),
    s.questions[2].questions[0],
  ];
  return {
    path: "components/pricing-faq.tsx",
    file: "pricing-faq.tsx",
    isNew: true,
    lines: [
      add(`// What people ask AI about ${s.input.questions}`),
      add("export const faq = ["),
      ...top.map((q) => add(`  { q: "${q}" },`)),
      add("];"),
    ],
  };
}

const TOKEN =
  /("(?:[^"\\]|\\.)*"|\/\/.*$|<\/?[A-Za-z][\w.]*|\/>|\b(?:export|const|default|function|return|import|type|from)\b)/;

/** Just enough highlighting to read as code: strings, keywords, tags, comments. */
function highlight(text: string): ReactNode[] {
  return text.split(new RegExp(TOKEN.source, "g")).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('"'))
      return (
        <span key={i} className="text-(--st-str)">
          {part}
        </span>
      );
    if (part.startsWith("//"))
      return (
        <span key={i} className="text-(--st-faint)">
          {part}
        </span>
      );
    if (part.startsWith("<") || part === "/>")
      return (
        <span key={i} className="text-(--st-tag)">
          {part}
        </span>
      );
    if (TOKEN.test(part))
      return (
        <span key={i} className="text-(--st-kw)">
          {part}
        </span>
      );
    return part;
  });
}

/**
 * The file before, during and after the edit: the original lines, then the
 * diff (removed in red, added in green, arriving line by line), then the new
 * file with a mark in the gutter where it changed.
 */
export function CodeView({
  change,
  phase,
  hunk = false,
  max,
  className,
}: {
  change: CodeChange;
  phase: Phase;
  /** Only the changed lines and one line either side, as a diff shows them. */
  hunk?: boolean;
  /** At most this many lines, then "… N more lines". */
  max?: number;
  className?: string;
}) {
  const view = phase < APPLY ? "before" : phase === APPLY ? "diff" : "after";
  // Number the lines as the file has them at this point: a removed line
  // keeps no number in the diff, since the new file doesn't have it.
  let n = 0;
  const numbered = change.lines
    .filter((l) =>
      view === "before" ? l.kind !== "add" : view === "after" ? l.kind !== "del" : true,
    )
    .map((l) => ({
      ...l,
      n: view === "diff" && l.kind === "del" ? null : ++n,
      // Before the edit there is no diff: every line is just a line.
      kind: view === "before" ? ("ctx" as const) : l.kind,
    }));
  const near = (i: number) =>
    [i - 1, i, i + 1].some((j) => numbered[j]?.kind !== "ctx" && !!numbered[j]);
  const shown = hunk && view !== "before" ? numbered.filter((_, i) => near(i)) : numbered;
  const visible = max ? shown.slice(0, max) : shown;
  const more = shown.length - visible.length;
  let added = 0;
  return (
    <div className={cn("font-mono text-[10.5px] leading-[18px]", className)}>
      {visible.length === 0 && (
        <div className="flex">
          <span className="w-7 shrink-0 pr-2.5 text-right text-(--st-faint)">1</span>
          <span className="w-3 shrink-0" />
          <Caret />
        </div>
      )}
      {visible.map((l, i) => {
        const diff = view === "diff" && l.kind !== "ctx";
        const fresh = view === "diff" && l.kind === "add";
        return (
          <div
            key={`${i}-${l.text}`}
            style={fresh ? wait(added++, 70) : undefined}
            className={cn(
              "flex",
              fresh && ENTER,
              diff && l.kind === "add" && "bg-(--st-add)/15",
              diff && l.kind === "del" && "bg-(--st-del)/15 text-(--st-text)/60 line-through",
            )}
          >
            <span className="w-7 shrink-0 select-none pr-2.5 text-right text-(--st-faint)">
              {l.n}
            </span>
            <span
              className={cn(
                "relative w-3 shrink-0 text-center",
                l.kind === "add" ? "text-(--st-add)" : "text-(--st-del)",
              )}
            >
              {diff ? (l.kind === "add" ? "+" : "−") : null}
              {view === "after" && l.kind === "add" && (
                <span className="absolute inset-y-0 left-0 w-[2px] bg-(--st-add)/70" />
              )}
            </span>
            <span
              className={cn(
                "min-w-0 flex-1 pr-3",
                l.wrap ? "whitespace-pre-wrap break-words" : "overflow-hidden whitespace-pre",
              )}
            >
              {highlight(l.text)}
            </span>
          </div>
        );
      })}
      {more > 0 && (
        <div className="flex text-(--st-faint)">
          <span className="w-7 shrink-0" />
          <span className="w-3 shrink-0" />
          <span>… {more} more lines</span>
        </div>
      )}
    </div>
  );
}
