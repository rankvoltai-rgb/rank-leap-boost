/**
 * The page's focal visual: one question asked of Meta AI in four of the
 * places it lives — a WhatsApp chat, the Meta AI app, Facebook's AI Mode and
 * a pair of glasses — with a marker on the spot where a source would show.
 *
 * That's Meta AI's distinctive problem in one picture: the same answer, four
 * very different citation surfaces, and Meta documents the layout for only
 * one of them. Each frame says which.
 *
 * Motion: the surfaces advance on their own only while the stage is at least
 * half on screen, and start over from WhatsApp when it leaves. Before it has
 * been seen (and so in the server HTML) and under reduced motion, every
 * frame renders complete and still; the tabs always work.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Glasses,
  History,
  Menu,
  MessageCircle,
  Mic,
  Play,
  Search,
  Smartphone,
  Volume2,
} from "lucide-react";
import { MetaAIMark } from "@/components/landing/ai-logos";
import type { AnswerPreview } from "@/data/ai-seo/types";
import { parseInline, plainText } from "@/lib/inline-md";
import { cn } from "@/lib/utils";
import { LABELS, SURFACES, type SurfaceId } from "./copy";

const DWELL = 5600;
const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const TAB_ICON: Record<SurfaceId, typeof MessageCircle> = {
  whatsapp: MessageCircle,
  app: Smartphone,
  facebook: Search,
  glasses: Glasses,
};

/* ---------- small parts ---------- */

/** Entrance for one element in a frame; inert when the frame should be still. */
function Step({
  play,
  delay,
  children,
  className,
  y = 8,
}: {
  play: boolean;
  delay: number;
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={play ? { opacity: 0, y } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** The answer, with the cited brand picked out. */
function AnswerText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((s, i) =>
        s.bold ? (
          <span
            key={i}
            className="font-semibold text-ink underline decoration-cta/60 decoration-2 underline-offset-2"
          >
            {s.text}
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}

function Favicon({ domain, className }: { domain: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-white text-[0.5rem] font-bold uppercase text-ink/60 ring-1 ring-ink/[0.12]",
        className,
      )}
    >
      {domain.charAt(0)}
    </span>
  );
}

/** The callout pinned to where a source shows — or would. */
function Marker({
  text,
  play,
  delay,
  side = "right",
}: {
  text: string;
  play: boolean;
  delay: number;
  /** Which edge of the target it hangs from; "left" grows rightward. */
  side?: "left" | "right";
}) {
  return (
    <motion.span
      initial={play ? { opacity: 0, scale: 0.85 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: EASE }}
      className={cn(
        "pointer-events-none absolute -top-3 z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-cta py-1 pl-1.5 pr-2.5 text-[0.62rem] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(22,111,229,0.7)]",
        side === "right" ? "right-2 origin-bottom-right" : "left-[70%] origin-bottom-left",
      )}
    >
      <span className="relative flex h-2 w-2">
        {play && <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />}
        <span className="relative h-2 w-2 rounded-full bg-white" />
      </span>
      {text}
    </motion.span>
  );
}

function MetaAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-ink/[0.08]",
        className,
      )}
    >
      <MetaAIMark className="h-[62%] w-[62%]" />
    </span>
  );
}

/* ---------- the four frames ---------- */

type FrameProps = { p: AnswerPreview; play: boolean; marker: string };

/* WhatsApp: the answer is a message in a thread. Meta documents no source
   layout here, so none is drawn — the marker sits on the name instead. */
function WhatsAppFrame({ p, play, marker }: FrameProps) {
  return (
    <div className="flex h-full flex-col bg-[#efeae2]">
      <div className="flex items-center gap-2.5 border-b border-ink/[0.06] bg-white px-3 py-2.5">
        <ArrowLeft aria-hidden className="h-4 w-4 text-ink/60" />
        <MetaAvatar className="h-8 w-8" />
        <div className="min-w-0 leading-tight">
          <p className="text-[0.8rem] font-semibold text-ink">Meta AI</p>
          <p className="text-[0.62rem] text-ink/50">Meta AI chat</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-hidden px-3 py-3">
        <span className="mx-auto rounded-md bg-white/80 px-2 py-0.5 text-[0.58rem] font-medium uppercase tracking-wide text-ink/50">
          Today
        </span>
        <Step play={play} delay={0.1} className="flex justify-end">
          <p className="max-w-[82%] rounded-lg rounded-tr-none bg-[#d9fdd3] px-2.5 py-1.5 text-[0.78rem] leading-snug text-ink shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
            {p.prompt}
            <span className="ml-2 align-bottom text-[0.55rem] text-ink/45">9:41</span>
          </p>
        </Step>
        <Step play={play} delay={0.75} className="relative mt-3 flex">
          <p className="max-w-[90%] rounded-lg rounded-tl-none bg-white px-2.5 py-2 text-[0.78rem] leading-relaxed text-ink/85 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
            <AnswerText text={p.answer} />
            <span className="ml-2 align-bottom text-[0.55rem] text-ink/45">9:41</span>
          </p>
          <Marker text={marker} play={play} delay={1.5} />
        </Step>
      </div>
      <div className="flex items-center gap-2 px-2.5 pb-2.5">
        <span className="flex h-8 flex-1 items-center rounded-full bg-white px-3 text-[0.7rem] text-ink/40">
          Ask Meta AI
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1daa61] text-white">
          <Mic aria-hidden className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

/* The Meta AI app: the one documented pattern — Sources, under the response. */
function AppFrame({ p, play, marker }: FrameProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between px-3 py-2.5">
        <Menu aria-hidden className="h-4 w-4 text-ink/60" />
        <span className="flex items-center gap-1.5 text-[0.8rem] font-semibold text-ink">
          <MetaAIMark className="h-4 w-4" />
          Meta AI
        </span>
        <span className="rounded-full border border-ink/[0.1] px-2 py-0.5 text-[0.6rem] font-medium text-ink/60">
          Instant
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-3.5 pb-3 pt-1">
        <Step play={play} delay={0.1} className="flex justify-end">
          <p className="max-w-[82%] rounded-[1.1rem] rounded-br-md bg-[#0668e1] px-3 py-2 text-[0.78rem] leading-snug text-white">
            {p.prompt}
          </p>
        </Step>
        <Step play={play} delay={0.7}>
          <p className="text-[0.78rem] leading-relaxed text-ink/85">
            <AnswerText text={p.answer} />
          </p>
        </Step>
        <Step play={play} delay={1.3} className="relative mt-1 w-fit">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/[0.1] bg-white py-1 pl-1 pr-2.5 text-[0.68rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
            <span className="flex -space-x-1">
              {p.sources.map((s) => (
                <Favicon key={s.domain} domain={s.domain} className="h-4 w-4" />
              ))}
            </span>
            {p.status}
            <ChevronDown aria-hidden className="h-3 w-3 text-ink/50" />
          </span>
          <Marker text={marker} play={play} delay={1.7} side="left" />
        </Step>
        <Step play={play} delay={1.9}>
          <ul className="divide-y divide-ink/[0.06] overflow-hidden rounded-xl border border-ink/[0.08]">
            {p.sources.map((s, i) => (
              <li
                key={s.domain}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1.5 text-[0.64rem]",
                  i === 0 && "bg-cta-soft",
                )}
              >
                <Favicon domain={s.domain} className="h-3.5 w-3.5" />
                <span className="min-w-0 flex-1 truncate font-medium text-ink">{s.title}</span>
                <span className="shrink-0 text-ink/45">{s.domain}</span>
              </li>
            ))}
          </ul>
        </Step>
      </div>
    </div>
  );
}

/* Facebook's AI Mode: answers grounded in public Groups and Reels. */
function FacebookFrame({ p, play, marker }: FrameProps) {
  const [, reel, group] = p.sources;
  return (
    <div className="flex h-full flex-col bg-[#f0f2f5]">
      <div className="bg-white px-3 pt-2.5">
        <div className="flex items-center gap-2">
          <ArrowLeft aria-hidden className="h-4 w-4 shrink-0 text-ink/60" />
          <span className="flex h-8 min-w-0 flex-1 items-center gap-1.5 rounded-full bg-[#f0f2f5] px-3 text-[0.7rem] text-ink/75">
            <Search aria-hidden className="h-3 w-3 shrink-0 text-ink/45" />
            <span className="truncate">{p.prompt}</span>
          </span>
        </div>
        <div className="mt-2 flex gap-3.5 text-[0.66rem] font-semibold text-ink/50">
          <span className="border-b-2 border-brand-blue pb-1.5 text-brand-blue">AI Mode</span>
          <span className="pb-1.5">All</span>
          <span className="pb-1.5">Posts</span>
          <span className="pb-1.5">Groups</span>
          <span className="pb-1.5">Reels</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-hidden p-2.5">
        <Step play={play} delay={0.25} className="rounded-xl bg-white p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-[0.62rem] font-semibold text-ink/60">
            <MetaAIMark className="h-3.5 w-3.5" />
            Meta AI
          </p>
          <p className="line-clamp-5 text-[0.76rem] leading-relaxed text-ink/85">
            <AnswerText text={p.answer} />
          </p>
        </Step>
        <Step play={play} delay={1.0} className="relative">
          <div className="grid grid-cols-[0.8fr_1.2fr] gap-2">
            {reel && (
              <div className="relative flex h-[5.6rem] flex-col justify-end overflow-hidden rounded-lg bg-[linear-gradient(160deg,#8fb7f5,#1877f2_60%,#0c4ea8)] p-2">
                <Play
                  aria-hidden
                  className="absolute left-2 top-2 h-3.5 w-3.5 fill-white text-white"
                />
                <p className="line-clamp-2 text-[0.58rem] font-semibold leading-tight text-white">
                  {reel.title}
                </p>
              </div>
            )}
            {group && (
              <div className="flex h-[5.6rem] flex-col rounded-lg bg-white p-2">
                <span className="flex -space-x-1">
                  {["#c7d7f5", "#f5d0c7", "#d3eccf"].map((c) => (
                    <span
                      key={c}
                      className="h-4 w-4 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </span>
                <p className="mt-1.5 line-clamp-3 text-[0.6rem] font-medium leading-snug text-ink/80">
                  {group.title}
                </p>
              </div>
            )}
          </div>
          <Marker text={marker} play={play} delay={1.6} />
        </Step>
      </div>
    </div>
  );
}

/* Glasses: the answer is heard, not read. */
function GlassesFrame({ p, play, marker }: FrameProps) {
  const spoken = plainText(p.answer);
  return (
    <div className="flex h-full flex-col justify-between bg-[linear-gradient(180deg,#f4f7fc,#e9f0fb)] p-3.5">
      <Step play={play} delay={0.1}>
        <p className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink/45">
          <Mic aria-hidden className="h-3 w-3" />
          &ldquo;Hey Meta&rdquo;
        </p>
        <p className="mt-1.5 text-[0.8rem] leading-snug text-ink/80">{p.prompt}</p>
      </Step>
      <Step
        play={play}
        delay={0.6}
        className="relative rounded-[1.6rem] border border-ink/[0.12] bg-white/70 px-4 py-4 backdrop-blur"
      >
        <div aria-hidden className="flex h-7 items-center justify-center gap-[3px]">
          {Array.from({ length: 22 }, (_, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-cta/70"
              style={{ height: `${30 + ((i * 37) % 70)}%` }}
              animate={play ? { scaleY: [0.35, 1, 0.5, 0.9, 0.35] } : undefined}
              transition={
                play ? { duration: 1.6, delay: i * 0.05, repeat: 2, ease: "easeInOut" } : undefined
              }
            />
          ))}
        </div>
        <p className="mt-3 flex gap-1.5 text-[0.76rem] leading-relaxed text-ink/80">
          <Volume2 aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cta" />
          <span className="line-clamp-5">{spoken}</span>
        </p>
        <Marker text={marker} play={play} delay={1.4} />
      </Step>
      <Step
        play={play}
        delay={1.8}
        className="flex items-center gap-2.5 rounded-xl border border-ink/[0.08] bg-white px-3 py-2.5"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cta-soft text-cta">
          <History aria-hidden className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[0.7rem] font-semibold text-ink">Meta AI app · History</span>
          <span className="block truncate text-[0.62rem] text-ink/50">{p.prompt}</span>
        </span>
        <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/40" />
      </Step>
    </div>
  );
}

const FRAMES: Record<SurfaceId, (props: FrameProps) => ReactNode> = {
  whatsapp: WhatsAppFrame,
  app: AppFrame,
  facebook: FacebookFrame,
  glasses: GlassesFrame,
};

/* ---------- the stage ---------- */

export function SurfaceStage({
  preview,
  className,
}: {
  preview: AnswerPreview;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  /* Entrances only after the stage has been seen, so the server HTML (and the
     first paint) is the finished still frame, never a half-built one. */
  const [armed, setArmed] = useState(false);
  const [held, setHeld] = useState(false);
  const [round, setRound] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.intersectionRatio >= 0.5;
        setInView(visible);
        if (visible) {
          setArmed(true);
        } else {
          // Start over from the first surface next time it comes into view.
          setActive(0);
          setHeld(false);
          setRound((r) => r + 1);
        }
      },
      { threshold: [0, 0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const auto = inView && !reduce && !held;
  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % SURFACES.length), DWELL);
    return () => window.clearTimeout(t);
  }, [auto, active]);

  const play = armed && inView && !reduce;
  const surface = SURFACES[active];
  const Frame = FRAMES[surface.id];

  return (
    <figure ref={ref} className={cn("flex flex-col", className)} aria-label={LABELS.stage}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {LABELS.stage}
        </p>
      </div>

      <div
        role="tablist"
        aria-label={LABELS.stage}
        className="mt-3 grid grid-cols-4 gap-1 rounded-xl border border-ink/[0.08] bg-white p-1"
      >
        {SURFACES.map((s, i) => {
          const Icon = TAB_ICON[s.id];
          const on = i === active;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`meta-surface-tab-${s.id}`}
              aria-selected={on}
              aria-controls="meta-surface-panel"
              onClick={() => {
                setActive(i);
                setHeld(true);
              }}
              className={cn(
                "relative flex h-9 items-center justify-center gap-1.5 overflow-hidden rounded-lg px-1 text-[0.72rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 sm:text-[0.78rem]",
                on ? "bg-cta-soft text-cta" : "text-ink/60 hover:bg-ink/[0.03] hover:text-ink",
              )}
            >
              <Icon aria-hidden className="hidden h-3.5 w-3.5 shrink-0 min-[420px]:block" />
              <span className="truncate">{s.label}</span>
              {on && auto && (
                <motion.span
                  key={`${active}-${round}`}
                  aria-hidden
                  className="absolute inset-x-2 bottom-0.5 h-[2px] origin-left rounded-full bg-cta/50"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: DWELL / 1000, ease: "linear" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* The device. Fixed height, so switching surfaces never moves the page. */}
      <div
        id="meta-surface-panel"
        role="tabpanel"
        aria-labelledby={`meta-surface-tab-${surface.id}`}
        className="relative mx-auto mt-4 w-full max-w-[22rem]"
      >
        <div className="overflow-hidden rounded-[1.75rem] border border-ink/[0.1] bg-white p-1.5 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_24px_48px_-24px_rgba(16,24,40,0.28)]">
          <div className="relative h-[24.5rem] overflow-hidden rounded-[1.35rem] border border-ink/[0.06]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${surface.id}-${round}`}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <Frame p={preview} play={play} marker={surface.marker} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <figcaption className="mt-4 rounded-xl border border-ink/[0.08] bg-white px-4 py-3">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={cn(
              "inline-flex h-5 items-center rounded-full px-2 text-[0.6rem] font-semibold uppercase tracking-[0.1em]",
              surface.documented ? "bg-cta-soft text-cta" : "bg-ink/[0.05] text-ink/55",
            )}
          >
            {surface.documented ? LABELS.documented : LABELS.undocumented}
          </span>
          <span className="text-[0.72rem] font-medium text-ink/50">{surface.where}</span>
        </p>
        <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink/75">
          {surface.note}{" "}
          <a
            href={surface.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-medium text-cta hover:text-cta-hover"
          >
            Meta&rsquo;s page
            <ArrowUpRight aria-hidden className="h-3 w-3" />
          </a>
        </p>
        <p className="mt-2 text-[0.66rem] text-muted-foreground">{LABELS.stageCaption}</p>
      </figcaption>
    </figure>
  );
}
