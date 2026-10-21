/**
 * The focal scene of /use-cases/local-businesses: a working day at your
 * bakery, hour by hour, and the blog post that goes out at nine while you're
 * serving. Rebuilt from DayScene in ../hero-scenes.tsx (hourAt, rowAt, clock)
 * in the landing's style: a white card with hairlines on a soft panel, soft
 * blue for the one row that's Rankbox's, calm motion.
 *
 * The day runs 6 AM to 3 PM. A customer's question arrives at the counter
 * after the doors open, the post that answers it publishes at nine, and the
 * day closes. Then the next day starts with the next question off the sample
 * topic map, so the loop says "every day" without a number.
 *
 * It plays only while about half of it is on screen, and starts the day over
 * once it leaves. The first frame is fixed (7:45 AM, Tuesday), so the server
 * and client agree. With reduced motion it holds mid-morning, the post live.
 * Nothing here is an outcome: no visits, rankings, or citations.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react";
import {
  CalendarDays,
  Check,
  Clock3,
  Coffee,
  DoorOpen,
  Flame,
  Globe,
  Lock,
  Sandwich,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { GoogleMark } from "@/components/landing/ai-logos";

interface DayEvent {
  hour: number;
  label: string;
  sub: string;
  /** "post" is the one row that's Rankbox's. */
  icon: LucideIcon | "post";
}

const OPEN = 6;
const CLOSE = 15;
const POST_HOUR = 9;
/* The question is asked at the counter half an hour after the doors open. */
const ASK_HOUR = 7.5;

const YOUR_DAY: DayEvent[] = [
  { hour: 6, label: "Ovens on", sub: "Sourdough, rye, croissants", icon: Flame },
  { hour: 7, label: "Doors open", sub: "The regulars, then everyone", icon: DoorOpen },
  { hour: 8, label: "Morning rush", sub: "Coffee and a queue to the door", icon: Coffee },
  { hour: POST_HOUR, label: "Post published", sub: "", icon: "post" },
  { hour: 12, label: "Lunch orders", sub: "Sandwiches and a catering drop", icon: Sandwich },
  { hour: CLOSE, label: "Close up", sub: "Tomorrow's dough goes in", icon: Lock },
];

const DAYS = ["Tuesday", "Wednesday", "Thursday", "Friday"];

/* One day, 6 AM to 3 PM, then a beat on the closed shop before the next. */
const RUN_MS = 11000;
const HOLD_MS = 2400;
const FADE_MS = 500;

const hourOf = (t: number) => OPEN + t * (CLOSE - OPEN);
const tOf = (hour: number) => (hour - OPEN) / (CLOSE - OPEN);
/* First frame: the doors are open and the question's been asked. */
const START_T = tOf(7.75);
/* Reduced motion: mid-morning, with the post already out. */
const REST_T = tOf(10.33);

/** Rows are evenly spaced, hours aren't: find the row an hour falls in. */
function rowAt(hour: number) {
  for (let i = 0; i < YOUR_DAY.length - 1; i++) {
    const a = YOUR_DAY[i].hour;
    const b = YOUR_DAY[i + 1].hour;
    if (hour <= b) return i + (hour - a) / (b - a);
  }
  return YOUR_DAY.length - 1;
}

/** 9.5 → "9:30 AM", rounded down to five minutes. */
function clock(hour: number) {
  const whole = Math.floor(hour);
  const mins = Math.floor(((hour - whole) * 60) / 5) * 5;
  const h12 = ((whole + 11) % 12) + 1;
  return `${h12}:${String(mins).padStart(2, "0")} ${whole < 12 ? "AM" : "PM"}`;
}

const passedAt = (t: number) => YOUR_DAY.filter((e) => hourOf(t) >= e.hour).length;

/* The timeline's top padding, which the now line has to clear too. */
const PAD = "0.5rem";

export function DayScene({ questions }: { questions: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();

  const t = useMotionValue(START_T);
  const [passed, setPassed] = useState(() => passedAt(START_T));
  const [asked, setAsked] = useState(() => hourOf(START_T) >= ASK_HOUR);
  const [fading, setFading] = useState(false);
  const [day, setDay] = useState(0);

  /* Rows and cards follow the clock in React state, but only when an hour
     is crossed, never on every frame. Subscribed after mount, and called
     directly wherever the clock is set by hand. */
  const sync = useCallback((v: number) => {
    const n = passedAt(v);
    setPassed((p) => (p === n ? p : n));
    const a = hourOf(v) >= ASK_HOUR;
    setAsked((p) => (p === a ? p : a));
  }, []);
  useEffect(() => t.on("change", sync), [t, sync]);

  const clockText = useTransform(t, (v) => clock(hourOf(v)));
  const lineTop = useTransform(
    t,
    (v) => `calc(${PAD} + ${(rowAt(hourOf(v)) + 0.5).toFixed(3)} * var(--row))`,
  );
  /* Daylight blue, with a dawn glow (the landing's amber tint) that burns
     off by mid-morning. Layered rather than mixed, so it never passes grey. */
  const dawn = useTransform(t, [0, 0.45, 1], [1, 0.12, 0]);
  /* A soft sun crossing the panel on a low arc. */
  const sunX = useTransform(t, (v) => `${12 + v * 76}%`);
  const sunY = useTransform(t, (v) => `${78 - Math.sin(v * Math.PI) * 62}%`);

  useEffect(() => {
    if (reduce) {
      t.jump(REST_T);
      sync(REST_T);
      setDay(0);
      setFading(false);
      return;
    }
    if (!inView) {
      // Off screen: back to the first frame, so the next visit sees the day.
      t.jump(START_T);
      sync(START_T);
      setDay(0);
      setFading(false);
      return;
    }
    let controls: AnimationPlaybackControls | undefined;
    let timer = 0;
    const run = () => {
      controls = animate(t, 1, {
        duration: ((1 - t.get()) * RUN_MS) / 1000,
        ease: "linear",
        onComplete: () => {
          timer = window.setTimeout(() => {
            setFading(true);
            timer = window.setTimeout(() => {
              t.jump(0);
              sync(0);
              setDay((d) => (d + 1) % DAYS.length);
              setFading(false);
              run();
            }, FADE_MS);
          }, HOLD_MS);
        },
      });
    };
    run();
    return () => {
      controls?.stop();
      window.clearTimeout(timer);
    };
  }, [inView, reduce, t, sync]);

  const question = questions.length ? questions[day % questions.length] : "";
  const posted = passed >= YOUR_DAY.findIndex((e) => e.icon === "post") + 1;
  const showAsk = asked && !fading && question !== "";
  const showPost = posted && !fading && question !== "";
  const today = DAYS[day];

  const events = useMemo(
    () => YOUR_DAY.map((e) => (e.icon === "post" ? { ...e, sub: question } : e)),
    [question],
  );

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Sample: a working day at your bakery. You bake and serve from 6 AM; a customer asks a question at the counter, and at 9:00 Rankbox publishes a post answering it to your website's blog."
      className="relative h-[33.5rem] overflow-hidden sm:h-[33rem] lg:h-full lg:min-h-[34rem]"
    >
      <div className="absolute inset-0 bg-[#eef4fe]" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(120%_70%_at_30%_100%,#fdf0d8_0%,rgba(253,244,228,0.85)_45%,rgba(253,244,228,0)_80%)]"
        style={{ opacity: dawn }}
      />
      <motion.span
        className="pointer-events-none absolute h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(253,186,116,0.26),rgba(253,186,116,0)_66%)]"
        style={{ left: sunX, top: sunY }}
      />
      {/* The stage: a fixed box centred on the panel, so the three pieces
          keep their places however tall the hero runs. */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
        <div className="relative h-[32rem] w-full max-w-[34rem] sm:h-[30.5rem]">
          {/* ---------- The day ---------- */}
          <div className="absolute left-0 right-0 top-[6.25rem] rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_28px_56px_-28px_rgba(16,24,40,0.32)] sm:right-auto sm:top-[4.25rem] sm:w-[21.5rem] lg:w-[19.5rem] xl:w-[21.5rem]">
            <div className="flex h-11 items-center gap-2.5 border-b border-ink/[0.06] px-3.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink/70">
                <CalendarDays className="h-3.5 w-3.5" />
              </span>
              <span className="truncate text-[0.8rem] font-semibold text-ink">
                {today} at your bakery
              </span>
              <span className="ml-auto rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Sample
              </span>
            </div>

            <div className="flex items-end justify-between gap-3 border-b border-ink/[0.06] px-4 pb-3 pt-3.5">
              <p className="font-display text-[1.9rem] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums">
                <motion.span>{clockText}</motion.span>
              </p>
              <p className="flex items-center gap-3 pb-0.5 text-[0.66rem] font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink/35" /> You
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cta" /> Rankbox
                </span>
              </p>
            </div>

            {/* --row is one hour row: shorter on a phone, where the whole day has
            to fit above the post card. */}
            <div className="relative px-2.5 pb-2.5 pt-2 [--row:2.65rem] sm:[--row:2.95rem]">
              <motion.div
                className={cn(
                  "pointer-events-none absolute left-1 right-2 z-10 flex -translate-y-1/2 items-center transition-opacity duration-300",
                  fading && "opacity-0",
                )}
                style={{ top: lineTop }}
              >
                <span className="h-2 w-2 rounded-full bg-cta shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_18%,transparent)]" />
                <span className="h-px flex-1 bg-cta/50" />
              </motion.div>

              {events.map((e, i) => {
                const done = i < passed;
                const ours = e.icon === "post";
                const Icon = ours ? null : (e.icon as LucideIcon);
                return (
                  <div
                    key={e.hour}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2 transition-[background-color,box-shadow,opacity] duration-500",
                      ours &&
                        done &&
                        "bg-cta-soft shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--cta)_18%,transparent)]",
                      !ours && !done && "opacity-45",
                    )}
                    style={{ height: "var(--row)" }}
                  >
                    <span className="w-9 shrink-0 text-right text-[0.64rem] font-medium tabular-nums text-muted-foreground">
                      {clock(e.hour).replace(":00", "")}
                    </span>
                    <span
                      className={cn(
                        "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-500",
                        ours && done
                          ? "bg-cta text-white"
                          : "border border-ink/[0.08] bg-white text-ink/70",
                      )}
                    >
                      {Icon ? (
                        <Icon className="h-3.5 w-3.5" />
                      ) : done ? (
                        <Mark className="h-3.5 w-3.5" />
                      ) : (
                        <Clock3 className="h-3.5 w-3.5 text-cta" />
                      )}
                      {/* Done: a tick on the tile's corner, clear of the
                          post card that lands over the row ends. */}
                      {!ours && (
                        <span
                          className={cn(
                            "absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-success text-white ring-2 ring-white transition-[opacity,transform] duration-300",
                            done ? "scale-100 opacity-100" : "scale-50 opacity-0",
                          )}
                        >
                          <Check className="h-2 w-2" strokeWidth={4} />
                        </span>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "truncate text-[0.76rem] font-semibold",
                          ours ? "text-cta" : "text-ink",
                        )}
                      >
                        {ours && !done ? "Post goes out" : e.label}
                      </p>
                      <p className="truncate text-[0.66rem] text-muted-foreground">{e.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------- The question, asked at the counter ---------- */}
          <div
            className={cn(
              "absolute right-0 top-0 z-20 w-[13.25rem] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[14rem]",
              showAsk ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0",
            )}
          >
            <div className="rounded-2xl rounded-tr-md border border-ink/[0.07] bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_16px_32px_-18px_rgba(16,24,40,0.3)]">
              <p className="text-[0.76rem] font-medium leading-snug text-ink">
                &ldquo;{question}&rdquo;
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[0.64rem] text-muted-foreground">
                <GoogleMark className="h-3 w-3" />
                Asked at the counter, and on Google
              </p>
            </div>
          </div>

          {/* ---------- The post, the moment the line passes nine ---------- */}
          <div
            className={cn(
              "absolute bottom-0 right-0 z-20 w-[12rem] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:bottom-auto sm:top-[14.5rem] sm:w-[13.5rem] lg:w-[12.25rem] xl:w-[13.5rem]",
              showPost ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0",
            )}
          >
            <div className="overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-20px_rgba(16,24,40,0.35)]">
              <div className="relative hidden h-[4.5rem] items-center justify-center bg-[#fdf4e4] sm:flex">
                <Wheat className="h-7 w-7 text-[#d97706]/70" strokeWidth={1.5} />
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[0.6rem] font-semibold text-success shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Published
                </span>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3 w-3 shrink-0 text-muted-foreground" />
                  <span className="truncate text-[0.62rem] text-muted-foreground">
                    yoursite.com/blog
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[0.6rem] font-semibold text-success sm:hidden">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Published
                  </span>
                </div>
                <p className="mt-1.5 text-[0.8rem] font-semibold leading-snug text-ink">
                  {question}
                </p>
                <p className="mt-1 text-[0.64rem] text-muted-foreground">
                  9:00 AM · while you were serving
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
