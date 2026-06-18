import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  Gauge,
  Loader2,
  Lock,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Logo } from "@/components/landing/shared";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/count-up";
import { analyzeWebsite, generateBlogStrategy } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import {
  persistOnboarding,
  activateTrial,
  addOpportunityToQueue,
  type WebsiteAnalysis,
  type Blog,
} from "@/lib/api";

type Stage = "form" | "scanning" | "results" | "checkout";

const STEPS: { id: Stage; label: string }[] = [
  { id: "form", label: "Details" },
  { id: "scanning", label: "Analysis" },
  { id: "results", label: "Growth plan" },
  { id: "checkout", label: "Activate" },
];

const SCAN_STEPS = [
  "Analyzing website structure…",
  "Extracting SEO keywords…",
  "Detecting ranking opportunities…",
  "Identifying competitor gaps…",
  "Building content strategy…",
  "Predicting traffic potential…",
  "Generating article opportunities…",
];

function reducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** A short celebratory particle burst anchored to its parent. */
function Burst() {
  if (reducedMotion()) return null;
  const particles = Array.from({ length: 10 });
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const dist = 22 + (i % 3) * 8;
        const tones = ["bg-success", "bg-info", "bg-ink"];
        return (
          <motion.span
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: 0.4,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className={cn(
              "absolute h-1.5 w-1.5 rounded-full",
              tones[i % tones.length],
            )}
          />
        );
      })}
    </span>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ink focus:ring-2 focus:ring-ink/10"
      />
    </label>
  );
}

/** Stripe-style segmented progress header with momentum cues. */
function ProgressHeader({ activeIndex }: { activeIndex: number }) {
  const pct = Math.round(((activeIndex + 1) / STEPS.length) * 100);
  return (
    <div className="border-b border-border px-7 py-5 sm:px-9">
      <div className="flex items-center justify-between">
        <Logo />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-ink tabular-nums">
          {pct}% complete
        </span>
      </div>
      <div className="mt-4 flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary"
          >
            <motion.span
              className={cn(
                "block h-full rounded-full",
                i === activeIndex ? "bg-gradient-traffic" : "bg-ink",
              )}
              initial={false}
              animate={{ width: i <= activeIndex ? "100%" : "0%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-1.5">
        {STEPS.map((s, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <span
              key={s.id}
              className={cn(
                "flex flex-1 items-center gap-1 truncate text-[11px] font-medium",
                i <= activeIndex ? "text-ink" : "text-muted-foreground",
              )}
            >
              {done && <Check className="h-3 w-3 shrink-0 text-success" />}
              <span className={cn("truncate", active && "font-semibold")}>{s.label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function Onboarding() {
  const runAnalyze = useServerFn(analyzeWebsite);
  const runStrategy = useServerFn(generateBlogStrategy);

  const [stage, setStage] = useState<Stage>("form");
  const [fullName, setFullName] = useState("");
  const [business, setBusiness] = useState("");
  const [url, setUrl] = useState("");

  const [scanStep, setScanStep] = useState(0);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activating, setActivating] = useState(false);
  const [checkout, setCheckout] = useState<{ email?: string; userId?: string } | null>(null);
  const scanDone = useRef(false);

  const totalTraffic = blogs.reduce((sum, b) => sum + (b.traffic_estimate ?? 0), 0);
  const avgSignal = blogs.length
    ? Math.round(blogs.reduce((s, b) => s + (b.ai_signal ?? 0), 0) / blogs.length)
    : 0;
  const activeIndex = STEPS.findIndex((s) => s.id === stage);

  // Advance the live processing labels while the scan runs.
  useEffect(() => {
    if (stage !== "scanning") return;
    setScanStep(0);
    scanDone.current = false;
    const id = setInterval(() => {
      setScanStep((s) => {
        // hold on the last step until the scan completes
        if (s >= SCAN_STEPS.length - 1) return s;
        if (scanDone.current && s >= SCAN_STEPS.length - 2) return s;
        return s + 1;
      });
    }, 1100);
    return () => clearInterval(id);
  }, [stage]);

  async function analyze(e: React.FormEvent) {
    e.preventDefault();
    if (!business.trim() || !url.trim()) {
      toast.error("Add your business name and website URL.");
      return;
    }
    setStage("scanning");
    try {
      const result = (await runAnalyze({
        data: { business_name: business.trim(), website_url: url.trim(), full_name: fullName.trim() },
      })) as WebsiteAnalysis;
      const inserted = await persistOnboarding({
        full_name: fullName,
        business_name: business,
        website_url: url,
        analysis: result,
      });
      scanDone.current = true;
      setScanStep(SCAN_STEPS.length - 1);
      setAnalysis(result);
      setBlogs(inserted);
      // brief beat on the final step for polish
      setTimeout(() => setStage("results"), 700);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "We couldn't analyze that site. Try again.");
      setStage("form");
    }
  }

  async function startTrial() {
    setActivating(true);
    try {
      // Auto-queue every discovered opportunity — no manual selection needed.
      await Promise.all(blogs.map((b) => addOpportunityToQueue(b)));
      const strategy = await runStrategy({
        data: { existingTitles: blogs.map((b) => b.title) },
      });
      await activateTrial(strategy);
      const { data } = await supabase.auth.getUser();
      setCheckout({ email: data.user?.email, userId: data.user?.id });
      setStage("checkout");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't activate your trial.");
      setActivating(false);
    }
  }

  const wide = stage === "results";
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        layout
        className={cn(
          "w-full overflow-hidden rounded-[28px] border border-border bg-card shadow-elevation-lg transition-[max-width] duration-500",
          wide ? "max-w-3xl" : "max-w-xl",
        )}
      >
        <ProgressHeader activeIndex={activeIndex} />

        <div className="px-7 py-8 sm:px-9">
          <AnimatePresence mode="wait">
            {stage === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" /> 48-hour free trial
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-ink">
                  Let's analyze your website
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Add your details and our AI maps your entire SEO growth plan — fully automated, no manual setup.
                </p>
                <form onSubmit={analyze} className="mt-6 space-y-4">
                  <Field label="Full name" placeholder="Jane Doe" value={fullName} onChange={setFullName} />
                  <Field label="Business name" placeholder="Acme Roofing Co." value={business} onChange={setBusiness} />
                  <Field
                    label="Website URL"
                    type="url"
                    placeholder="https://yoursite.com"
                    value={url}
                    onChange={setUrl}
                  />
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Build my growth plan <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {stage === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink">
                    <Loader2 className="h-5 w-5 animate-spin text-background" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">
                      Analyzing {business || "your site"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{url}</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-3">
                  {SCAN_STEPS.map((label, i) => {
                    const state = i < scanStep ? "done" : i === scanStep ? "active" : "pending";
                    return (
                      <li key={label} className="flex items-center gap-3 text-sm">
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                            state === "done" && "border-transparent bg-ink text-background",
                            state === "active" && "border-ink text-ink",
                            state === "pending" && "border-border text-muted-foreground",
                          )}
                        >
                          {state === "done" ? (
                            <Check className="h-3 w-3" />
                          ) : state === "active" ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          )}
                        </span>
                        <span className={cn(state === "pending" ? "text-muted-foreground" : "text-ink")}>
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}

            {stage === "results" && analysis && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  <Check className="h-3.5 w-3.5" /> Plan ready
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-ink">
                  Your automated growth plan
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Rankvolt mapped {blogs.length} high-intent articles for {business || "your site"} and will write
                  &amp; publish them for you — completely hands-off.
                </p>

                {/* Hero metric */}
                <div className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-gradient-surface p-6 text-center">
                  {!reducedMotion() && <Burst />}
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Projected monthly traffic
                  </p>
                  <CountUp
                    value={totalTraffic}
                    suffix="/mo"
                    className="mt-1 block text-4xl font-extrabold tracking-tight text-gradient-traffic tabular-nums sm:text-5xl"
                  />
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      { icon: Bot, label: "Articles", value: `${blogs.length}` },
                      { icon: Gauge, label: "Avg AI signal", value: `${avgSignal}` },
                      { icon: Zap, label: "Setup", value: "Auto" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl border border-border bg-card/70 p-2.5"
                      >
                        <s.icon className="mx-auto h-4 w-4 text-ink" />
                        <p className="mt-1 text-base font-bold text-ink tabular-nums">{s.value}</p>
                        <p className="text-[11px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auto-included article plan */}
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Included in your plan
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
                      <Check className="h-3 w-3" /> Auto-queued
                    </span>
                  </div>
                  <div className="-mr-2 max-h-[34vh] space-y-2 overflow-y-auto pr-2">
                    {blogs.map((b, i) => (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">{b.title}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {b.keyword ?? b.competition} · {b.ai_signal} AI signal
                          </p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                          <TrendingUp className="h-3 w-3" />
                          <CountUp value={b.traffic_estimate} suffix="/mo" className="tabular-nums" />
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startTrial}
                  disabled={activating}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70"
                >
                  {activating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Building your content engine…
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" /> Start 48-hour free trial
                    </>
                  )}
                </button>
                <p className="mt-2.5 text-center text-xs text-muted-foreground">
                  30+ more articles auto-generated on activation. No charge for 48 hours.
                </p>
              </motion.div>
            )}

            {stage === "checkout" && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  <Check className="h-3.5 w-3.5" /> Plan secured
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-ink">
                  Activate your free trial
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  No charge for 48 hours. Add your card to unlock your dashboard — cancel anytime before the trial
                  ends and you won't be billed.
                </p>
                <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card p-4">
                  <StripeEmbeddedCheckout
                    priceId="business_monthly"
                    trialDays={2}
                    customerEmail={checkout?.email}
                    userId={checkout?.userId}
                    returnUrl={
                      typeof window !== "undefined"
                        ? `${window.location.origin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`
                        : undefined
                    }
                  />
                </div>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" /> Secured by Stripe · Cancel anytime
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}