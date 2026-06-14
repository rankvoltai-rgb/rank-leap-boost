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
import {
  persistOnboarding,
  activateTrial,
  addOpportunityToQueue,
  type WebsiteAnalysis,
  type Blog,
} from "@/lib/api";

type Stage = "form" | "scanning" | "results";

const SCAN_STEPS = [
  "Analyzing website structure…",
  "Extracting SEO keywords…",
  "Detecting ranking opportunities…",
  "Identifying competitor gaps…",
  "Building content strategy…",
  "Predicting traffic potential…",
  "Generating article opportunities…",
];

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
  const scanDone = useRef(false);

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
      toast.success("Trial activated — your content engine is live.");
      navigate({ to: "/dashboard" });
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
              className="w-full max-w-2xl"
            >
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                <Check className="h-3.5 w-3.5" /> Analysis complete
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-ink">
                Here's your growth opportunity
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We detected <span className="font-semibold text-ink">{analysis.niche}</span> targeting{" "}
                <span className="font-semibold text-ink">{analysis.audience}</span> in {analysis.geo}. Add the
                articles you want — we'll prioritize them first.
              </p>

              <div className="mt-6 grid gap-3">
                {blogs.map((b) => {
                  const isAdded = added.has(b.id);
                  return (
                    <div
                      key={b.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{b.title}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 font-medium text-success">
                            <TrendingUp className="h-3 w-3" />
                            {b.traffic_estimate.toLocaleString()}/mo
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-info/20 bg-info/10 px-2 py-0.5 font-medium text-info">
                            {b.ai_signal} AI signal
                          </span>
                          <span className="text-muted-foreground">{b.competition} competition</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToQueue(b)}
                        disabled={isAdded}
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                          isAdded
                            ? "border border-success/30 bg-success/10 text-success"
                            : "bg-ink text-background hover:bg-ink/90",
                        )}
                      >
                        {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {isAdded ? "Added" : "Add to Queue"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <p className="text-sm font-semibold text-ink">
                  {added.size > 0
                    ? `${added.size} article${added.size > 1 ? "s" : ""} queued`
                    : "Ready when you are"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start your free trial and we'll generate 30 strategic blog opportunities — your selected
                  articles get prioritized first.
                </p>
                <button
                  type="button"
                  onClick={startTrial}
                  disabled={activating}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70"
                >
                  {activating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Building your content engine…
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" /> Start 2-Day Free Trial
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}