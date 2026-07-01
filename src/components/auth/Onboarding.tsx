import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  Gauge,
  Loader2,
  Lock,
  Plus,
  RotateCcw,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Logo, Avatar, Stars } from "@/components/landing/shared";
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

type Stage = "form" | "scanning" | "review" | "forecast" | "checkout";

type StepDef = { n: number; title: string; desc: string; stages: Stage[] };

const STEPS: StepDef[] = [
  { n: 1, title: "Your website", desc: "Where should we look?", stages: ["form"] },
  { n: 2, title: "Review analysis", desc: "Confirm what our AI found", stages: ["scanning", "review"] },
  { n: 3, title: "Traffic forecast", desc: "See your growth potential", stages: ["forecast"] },
  { n: 4, title: "Start free trial", desc: "Activate your engine", stages: ["checkout"] },
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

const PLAN_FEATURES = [
  "Answer-space research plan",
  "30 GEO/SEO articles (1 daily)",
  "2,500+ word, source-backed articles",
  "Auto-publish to your website",
  "30 authority backlink credits monthly",
  "Auto images, links & promotion",
  "Unlimited rewrites & team members",
];

const PROOF_FACES = ["Owen Carter", "Priya Raman", "Hannah Whitfield", "Marco Silva", "Daniel Okafor"];

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
            className={cn("absolute h-1.5 w-1.5 rounded-full", tones[i % tones.length])}
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
  required,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-volt focus:ring-2 focus:ring-volt/15"
      />
    </label>
  );
}

function Textarea({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full resize-none rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-volt focus:ring-2 focus:ring-volt/15"
      />
    </label>
  );
}

/** Left vertical numbered step rail (Flux-style). */
function StepRail({ activeStep }: { activeStep: number }) {
  return (
    <ol className="space-y-1">
      {STEPS.map((s) => {
        const done = s.n < activeStep;
        const active = s.n === activeStep;
        return (
          <li key={s.n} className="flex gap-3 rounded-xl px-3 py-2.5">
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
                done && "bg-success/15 text-success",
                active && "bg-ink text-background",
                !done && !active && "border border-border text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : s.n}
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm font-semibold leading-tight",
                  active || done ? "text-ink" : "text-muted-foreground",
                )}
              >
                {s.title}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{s.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Slim mobile progress strip. */
function MobileProgress({ activeStep }: { activeStep: number }) {
  const current = STEPS.find((s) => s.n === activeStep);
  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-1.5">
        {STEPS.map((s) => (
          <span
            key={s.n}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              s.n <= activeStep ? "bg-ink" : "bg-secondary",
            )}
          />
        ))}
      </div>
      <p className="mt-2.5 text-sm font-semibold text-ink">
        <span className="text-muted-foreground">Step {activeStep} of {STEPS.length} · </span>
        {current?.title}
      </p>
    </div>
  );
}

export function Onboarding() {
  const runAnalyze = useServerFn(analyzeWebsite);
  const runStrategy = useServerFn(generateBlogStrategy);

  const [stage, setStage] = useState<Stage>("form");
  const [fullName, setFullName] = useState("");
  const [url, setUrl] = useState("");

  const [scanStep, setScanStep] = useState(0);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activating, setActivating] = useState(false);
  const [checkout, setCheckout] = useState<{ email?: string; userId?: string } | null>(null);
  const scanDone = useRef(false);

  // Editable profile + keyword state (Step 2)
  const [editBusiness, setEditBusiness] = useState("");
  const [editNiche, setEditNiche] = useState("");
  const [editAudience, setEditAudience] = useState("");
  const [editTone, setEditTone] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [saving, setSaving] = useState(false);

  const activeStep = STEPS.find((s) => s.stages.includes(stage))?.n ?? 1;

  const totalTraffic = blogs.reduce((sum, b) => sum + (b.traffic_estimate ?? 0), 0);
  const avgSignal = blogs.length
    ? Math.round(blogs.reduce((s, b) => s + (b.ai_signal ?? 0), 0) / blogs.length)
    : 0;

  // Advance the live processing labels while the scan runs.
  useEffect(() => {
    if (stage !== "scanning") return;
    setScanStep(0);
    scanDone.current = false;
    const id = setInterval(() => {
      setScanStep((s) => {
        if (s >= SCAN_STEPS.length - 1) return s;
        if (scanDone.current && s >= SCAN_STEPS.length - 2) return s;
        return s + 1;
      });
    }, 1100);
    return () => clearInterval(id);
  }, [stage]);

  function restart() {
    setStage("form");
    setUrl("");
    setAnalysis(null);
    setBlogs([]);
    setActivating(false);
  }

  async function analyze(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Add your website URL.");
      return;
    }
    setStage("scanning");
    try {
      const inferredName = url
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .split("/")[0]
        .split(".")[0];
      const result = (await runAnalyze({
        data: { business_name: inferredName, website_url: url.trim(), full_name: fullName.trim() },
      })) as WebsiteAnalysis;
      scanDone.current = true;
      setScanStep(SCAN_STEPS.length - 1);
      setAnalysis(result);
      // Prefill the editable review fields from the analysis.
      setEditBusiness(inferredName.charAt(0).toUpperCase() + inferredName.slice(1));
      setEditNiche(result.niche);
      setEditAudience(result.audience);
      setEditTone(result.brand_tone);
      setKeywords(result.keywords.map((k) => k.name).slice(0, 12));
      setTimeout(() => setStage("review"), 700);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "We couldn't analyze that site. Try again.");
      setStage("form");
    }
  }

  function addKeyword() {
    const k = newKeyword.trim();
    if (!k) return;
    if (keywords.some((x) => x.toLowerCase() === k.toLowerCase())) {
      setNewKeyword("");
      return;
    }
    setKeywords((prev) => [...prev, k]);
    setNewKeyword("");
  }

  async function confirmReview() {
    if (!analysis) return;
    if (!editBusiness.trim()) {
      toast.error("Add your business name.");
      return;
    }
    setSaving(true);
    try {
      // Merge user edits back into the analysis before persisting.
      const existingByName = new Map(analysis.keywords.map((k) => [k.name.toLowerCase(), k]));
      const mergedKeywords = keywords.map((name) => {
        const prev = existingByName.get(name.toLowerCase());
        return (
          prev ?? { name, search_volume: 800, intent: "Commercial", trend: "Medium" }
        );
      });
      const edited: WebsiteAnalysis = {
        ...analysis,
        niche: editNiche.trim() || analysis.niche,
        audience: editAudience.trim() || analysis.audience,
        brand_tone: editTone.trim() || analysis.brand_tone,
        keywords: mergedKeywords,
      };
      const inserted = await persistOnboarding({
        full_name: fullName,
        business_name: editBusiness.trim(),
        website_url: url,
        analysis: edited,
      });
      setAnalysis(edited);
      setBlogs(inserted);
      setStage("forecast");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save your analysis.");
    } finally {
      setSaving(false);
    }
  }

  async function startTrial() {
    setActivating(true);
    try {
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden h-5 w-px bg-border sm:block" />
          <span className="hidden text-sm font-medium text-muted-foreground sm:block">
            Set up your engine
          </span>
        </div>
        <div className="flex items-center gap-1">
          {stage !== "form" && stage !== "checkout" && (
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restart
            </button>
          )}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
          >
            <X className="h-3.5 w-3.5" /> Leave
          </Link>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[280px_1px_minmax(0,1fr)] lg:gap-12 lg:py-14">
        {/* Left rail (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <StepRail activeStep={activeStep} />
          </div>
        </aside>
        <div className="hidden bg-border lg:block" />

        {/* Right content */}
        <main className="min-w-0">
          <MobileProgress activeStep={activeStep} />
          <div className="mt-6 lg:mt-0">
            <AnimatePresence mode="wait">
              {/* STEP 1 — Website */}
              {stage === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-xl"
                >
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-volt" /> 48-hour free trial
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    Let's analyze your website
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    Drop in your site and our AI maps your entire SEO growth plan — fully automated, no
                    manual setup.
                  </p>
                  <form onSubmit={analyze} className="mt-7 space-y-4">
                    <Field label="Full name" placeholder="Jane Doe" value={fullName} onChange={setFullName} />
                    <Field
                      label="Website URL"
                      type="url"
                      placeholder="https://yoursite.com"
                      value={url}
                      onChange={setUrl}
                      required
                    />
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      Analyze my site <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2a — Scanning */}
              {stage === "scanning" && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-ink">
                      <Loader2 className="h-5 w-5 animate-spin text-background" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">Analyzing your site</p>
                      <p className="truncate text-xs text-muted-foreground">{url}</p>
                    </div>
                  </div>
                  <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.span
                      className="block h-full rounded-full bg-gradient-traffic"
                      initial={false}
                      animate={{ width: `${Math.round(((scanStep + 1) / SCAN_STEPS.length) * 100)}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
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

              {/* STEP 2b — Review/edit analysis */}
              {stage === "review" && analysis && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-2xl"
                >
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                    <Check className="h-3.5 w-3.5" /> Analysis complete
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    Confirm what we found
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    Tweak anything that's off — this shapes the content our engine writes for you.
                  </p>

                  <div className="mt-7 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Business name" placeholder="Acme Co." value={editBusiness} onChange={setEditBusiness} required />
                      <Field label="Niche" placeholder="Local home services" value={editNiche} onChange={setEditNiche} />
                    </div>
                    <Textarea label="Audience" placeholder="Who you're trying to reach" value={editAudience} onChange={setEditAudience} />
                    <Textarea label="Brand tone" placeholder="Professional, helpful, authoritative" value={editTone} onChange={setEditTone} />

                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-ink">Target keywords</span>
                      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-3">
                        {keywords.length === 0 && (
                          <span className="text-sm text-muted-foreground">No keywords yet — add a few below.</span>
                        )}
                        {keywords.map((k) => (
                          <span
                            key={k}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm text-ink"
                          >
                            {k}
                            <button
                              type="button"
                              onClick={() => setKeywords((prev) => prev.filter((x) => x !== k))}
                              className="text-muted-foreground transition-colors hover:text-destructive"
                              aria-label={`Remove ${k}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addKeyword();
                            }
                          }}
                          placeholder="Add a keyword…"
                          className="h-10 flex-1 rounded-xl border border-border bg-card px-3.5 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-volt focus:ring-2 focus:ring-volt/15"
                        />
                        <button
                          type="button"
                          onClick={addKeyword}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-4 text-sm font-medium text-ink transition-colors hover:bg-secondary/70"
                        >
                          <Plus className="h-4 w-4" /> Add
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={confirmReview}
                      disabled={saving}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70 sm:w-auto"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                        </>
                      ) : (
                        <>
                          Looks good — see my forecast <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — Traffic forecast */}
              {stage === "forecast" && analysis && (
                <motion.div
                  key="forecast"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl"
                >
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                    <TrendingUp className="h-3.5 w-3.5" /> Forecast ready
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    Your projected growth
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    We found {blogs.length} content gaps AI isn't answering yet for {editBusiness}. Autopilot
                    writes &amp; publishes them — completely hands-off.
                  </p>

                  <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
                    <div className="md:sticky md:top-2 md:self-start">
                      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-surface p-6 text-center">
                        {!reducedMotion() && <Burst />}
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Projected monthly traffic
                        </p>
                        <motion.div
                          initial={reducedMotion() ? false : { scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                        >
                          <CountUp
                            value={totalTraffic}
                            suffix="/mo"
                            className="mt-1 block text-4xl font-semibold tracking-tight text-gradient-traffic tabular-nums sm:text-5xl"
                          />
                        </motion.div>
                        <div className="mt-5 grid grid-cols-3 gap-3">
                          {[
                            { icon: Bot, label: "Articles", value: `${blogs.length}` },
                            { icon: Gauge, label: "Avg AI signal", value: `${avgSignal}` },
                            { icon: Zap, label: "Setup", value: "Auto" },
                          ].map((s, i) => (
                            <motion.div
                              key={s.label}
                              initial={reducedMotion() ? false : { opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
                              className="rounded-xl border border-border bg-card/70 p-2.5"
                            >
                              <s.icon className="mx-auto h-4 w-4 text-ink" />
                              <p className="mt-1 text-base font-semibold text-ink tabular-nums">{s.value}</p>
                              <p className="text-[11px] text-muted-foreground">{s.label}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={startTrial}
                        disabled={activating}
                        className="group mt-5 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-70"
                      >
                        {activating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Building your content engine…
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 transition-transform group-hover:scale-110" /> Start free trial
                          </>
                        )}
                      </button>
                      <p className="mt-2.5 text-center text-xs text-muted-foreground">
                        30+ more articles auto-generated on activation. No charge for 48 hours.
                      </p>
                    </div>

                    <div className="flex min-h-0 flex-col">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Included in your plan
                        </p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
                          <Check className="h-3 w-3" /> Auto-queued
                        </span>
                      </div>
                      <div className="onboarding-fade-mask -mr-2 max-h-[42vh] space-y-2 overflow-y-auto pr-2 md:max-h-[52vh]">
                        {blogs.map((b, i) => (
                          <motion.div
                            key={b.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
                            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-ink/20"
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
                  </div>
                </motion.div>
              )}

              {/* STEP 4 — Checkout */}
              {stage === "checkout" && (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-8 lg:grid-cols-2 lg:gap-10"
                >
                  {/* Plan value */}
                  <div className="relative overflow-hidden rounded-2xl bg-ink px-7 py-8 text-background">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.07]"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                        backgroundSize: "22px 22px",
                      }}
                    />
                    <div className="relative">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-background/20 bg-background/10 px-3 py-1 text-xs font-medium text-background/80">
                        <Sparkles className="h-3.5 w-3.5" /> $1 card check · refunded instantly
                      </span>
                      <h2 className="mt-5 text-3xl font-semibold tracking-tight">Business</h2>
                      <p className="mt-1 text-sm text-background/70">All-in-one growth package</p>
                      <div className="mt-5 flex items-end gap-2.5">
                        <span className="text-xl text-background/50 line-through">$99</span>
                        <span className="text-5xl font-semibold tracking-tight">$49.5</span>
                        <span className="mb-1.5 text-sm text-background/70">/month</span>
                      </div>
                      <p className="mt-1 text-xs text-background/60">
                        $1 to verify your card (refunded), free for 48 hours, then 50% off your first month.
                      </p>
                      <ul className="mt-7 space-y-2.5">
                        {PLAN_FEATURES.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-background/90">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-background/15 text-background">
                              <Check className="h-3 w-3" />
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {PROOF_FACES.map((f) => (
                            <Avatar key={f} name={f} className="h-9 w-9 ring-2 ring-ink" />
                          ))}
                        </div>
                        <div className="flex flex-col">
                          <Stars />
                          <p className="text-sm text-background/70">
                            <span className="font-semibold text-background">400+</span> founders growing with Rankvolt
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stripe checkout */}
                  <div>
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                      <Check className="h-3.5 w-3.5" /> Plan secured
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-ink">
                      Verify your card to start
                    </h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      We charge <span className="font-medium text-ink">$1 to confirm your card</span> and
                      refund it right away. Free for 48 hours, then $49.50/month — cancel anytime before
                      the trial ends and you won't be billed.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {[
                        { icon: Lock, label: "Secured by Stripe" },
                        { icon: Check, label: "Cancel anytime" },
                        { icon: Sparkles, label: "$1 refundable check" },
                      ].map((t) => (
                        <span
                          key={t.label}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-[11px] font-medium text-ink"
                        >
                          <t.icon className="h-3 w-3 text-success" /> {t.label}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card p-4">
                      <StripeEmbeddedCheckout
                        priceId="card_validation_fee"
                        validatePlanPriceId="business_monthly"
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <Link to="/" className="transition-colors hover:text-ink">Help Center</Link>
            <Link to="/" className="transition-colors hover:text-ink">Status</Link>
            <Link to="/" className="transition-colors hover:text-ink">Contact</Link>
          </div>
          <span>© Rankvolt 2026</span>
        </div>
      </footer>
    </div>
  );
}
