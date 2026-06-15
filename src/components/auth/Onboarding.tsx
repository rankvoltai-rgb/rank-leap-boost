import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Loader2,
  Plus,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
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

export function Onboarding() {
  const navigate = useNavigate();
  const runAnalyze = useServerFn(analyzeWebsite);
  const runStrategy = useServerFn(generateBlogStrategy);

  const [stage, setStage] = useState<Stage>("form");
  const [fullName, setFullName] = useState("");
  const [business, setBusiness] = useState("");
  const [url, setUrl] = useState("");

  const [scanStep, setScanStep] = useState(0);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [activating, setActivating] = useState(false);
  const [checkout, setCheckout] = useState<{ email?: string; userId?: string } | null>(null);
  const scanDone = useRef(false);

  const totalTraffic = blogs.reduce((sum, b) => sum + (b.traffic_estimate ?? 0), 0);
  const queuedTraffic = blogs.reduce(
    (sum, b) => (added.has(b.id) ? sum + (b.traffic_estimate ?? 0) : sum),
    0,
  );

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

  async function addToQueue(blog: Blog) {
    if (added.has(blog.id)) return;
    setAdded((prev) => new Set(prev).add(blog.id));
    try {
      await addOpportunityToQueue(blog);
    } catch {
      setAdded((prev) => {
        const next = new Set(prev);
        next.delete(blog.id);
        return next;
      });
      toast.error("Couldn't add to queue.");
    }
  }

  async function startTrial() {
    setActivating(true);
    try {
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="px-5 py-6 sm:px-8">
        <a href="/">
          <Logo />
        </a>
      </header>

      <main className="flex flex-1 items-start justify-center px-5 pb-16 pt-4 sm:items-center">
        <AnimatePresence mode="wait">
          {stage === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md"
            >
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> Welcome to Rankvolt
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-ink">
                Let's analyze your website
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Drop in your details and our AI will instantly map your SEO opportunity — no manual setup.
              </p>
              <form onSubmit={analyze} className="mt-7 space-y-4">
                <Field label="Full Name" placeholder="Jane Doe" value={fullName} onChange={setFullName} />
                <Field label="Business Name" placeholder="Acme Roofing Co." value={business} onChange={setBusiness} />
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
                  Analyze My Website <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          )}

          {stage === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md"
            >
              <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink">
                    <Loader2 className="h-5 w-5 animate-spin text-background" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">Rankvolt AI is scanning {business || "your site"}</p>
                    <p className="text-xs text-muted-foreground">{url}</p>
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
              </div>
            </motion.div>
          )}

          {stage === "results" && analysis && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex max-h-[calc(100vh-7rem)] w-full max-w-2xl flex-col"
            >
              {/* Compact header — stays visible, no scroll needed to see the value */}
              <div className="shrink-0">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  <Check className="h-3.5 w-3.5" /> Analysis complete
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                  Here's your growth opportunity
                </h1>

                {/* Hero dopamine metric */}
                <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-gradient-surface p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Total opportunity
                      </p>
                      <CountUp
                        value={totalTraffic}
                        suffix="/mo"
                        className="mt-1 block text-3xl font-extrabold tracking-tight text-gradient-traffic tabular-nums sm:text-4xl"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Secured in queue
                      </p>
                      <CountUp
                        value={queuedTraffic}
                        suffix="/mo"
                        className="mt-1 block text-3xl font-extrabold tracking-tight text-ink tabular-nums sm:text-4xl"
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {analysis.niche} · {analysis.audience} · {analysis.geo} — add the articles you want, we'll
                    prioritize them first.
                  </p>
                </div>
              </div>

              {/* Scrollable card region */}
              <div className="-mr-2 mt-4 grid flex-1 gap-3 overflow-y-auto pr-2">
                {blogs.map((b, i) => {
                  const isAdded = added.has(b.id);
                  return (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
                      className={cn(
                        "flex items-center justify-between gap-4 rounded-xl border bg-card p-3.5 transition-colors",
                        isAdded ? "border-success/40 bg-success/5" : "border-border",
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{b.title}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 font-medium text-success">
                            <TrendingUp className="h-3 w-3" />
                            <CountUp value={b.traffic_estimate} suffix="/mo" className="tabular-nums" />
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-info/20 bg-info/10 px-2 py-0.5 font-medium text-info">
                            {b.ai_signal} AI signal
                          </span>
                          <span className="hidden text-muted-foreground sm:inline">
                            {b.competition} competition
                          </span>
                        </div>
                      </div>
                      <motion.button
                        type="button"
                        onClick={() => addToQueue(b)}
                        disabled={isAdded}
                        whileTap={isAdded ? undefined : { scale: 0.92 }}
                        animate={isAdded ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={cn(
                          "relative inline-flex shrink-0 items-center gap-1.5 overflow-visible rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                          isAdded
                            ? "border border-success/30 bg-success/10 text-success"
                            : "bg-gradient-accent text-background hover:opacity-90",
                        )}
                      >
                        {isAdded && <Burst />}
                        {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {isAdded ? "Added" : "Add to Queue"}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Sticky CTA footer */}
              <div className="mt-4 shrink-0 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <motion.p
                    key={added.size}
                    initial={{ scale: added.size > 0 ? 1.15 : 1 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="text-sm font-semibold text-ink"
                  >
                    {added.size > 0
                      ? `${added.size} article${added.size > 1 ? "s" : ""} queued`
                      : "Ready when you are"}
                  </motion.p>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    30 more generated on activation
                  </span>
                </div>
                <button
                  type="button"
                  onClick={startTrial}
                  disabled={activating}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-accent px-6 py-3.5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-70"
                >
                  {activating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Building your content engine…
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" /> Start 48-Hour Free Trial
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {stage === "checkout" && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-xl"
            >
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                <Check className="h-3.5 w-3.5" /> Queue secured
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Activate your 48-hour free trial
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                No charge for 48 hours. Add your card to unlock your dashboard —
                cancel anytime before the trial ends and you won't be billed.
              </p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card p-4">
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
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}