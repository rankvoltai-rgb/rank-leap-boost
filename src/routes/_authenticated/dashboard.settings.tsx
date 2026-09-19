import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  getCurrentUser,
  getProfile,
  getSettings,
  getSubscription,
  updateAutopilot,
  updateBlog,
  updateProfile,
  updateSettings,
  type Blog,
} from "@/lib/data";
import { composeStyleBrief, STYLE_DEFAULTS } from "@/lib/style-brief";
import { Button, PageHeader, Panel } from "@/components/dashboard/primitives";
import { CheckIcon } from "@/components/dashboard/icons";
import { Switch } from "@/components/ui/switch";
import {
  applyPatches,
  inversePatches,
  paceLabel,
  planFromTomorrow,
  type QueuePatch,
} from "@/components/dashboard/queue-plan";
import { useAllArticles, useArticleActions } from "@/components/dashboard/useArticleActions";
import { useSignOut } from "@/components/dashboard/use-sign-out";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: SettingsPage,
});

const TONES = [
  "Professional",
  "Friendly",
  "Confident",
  "Conversational",
  "Authoritative",
  "Playful",
];
const STYLES = [
  "Balanced",
  "Concise and actionable",
  "In-depth and data-driven",
  "Story-led",
  "Step-by-step",
];
const AUDIENCES = [
  "Founders / Entrepreneurs",
  "Marketers",
  "Small business owners",
  "Developers",
  "Agencies",
];
const PACES = [7, 5, 3, 2, 1];

type SaveState = "idle" | "saving" | "saved" | "error";

/* ── Autosave ───────────────────────────────────────────────────── */

/**
 * A section of fields that saves itself a beat after typing stops, flushes on
 * the way out, and reports what it's doing. Nothing to forget to press.
 */
function useAutosaved<T extends Record<string, string>>(
  loaded: T | null,
  save: (values: T) => Promise<void>,
) {
  const [values, setValues] = useState<T | null>(null);
  const [state, setState] = useState<SaveState>("idle");
  const dirty = useRef(false);
  const latest = useRef<T | null>(null);
  latest.current = values;

  // Take the server's values once; after that the form is the source of truth.
  useEffect(() => {
    if (loaded && !values) setValues(loaded);
  }, [loaded, values]);

  const flush = useCallback(async () => {
    if (!dirty.current || !latest.current) return;
    dirty.current = false;
    setState("saving");
    try {
      await save(latest.current);
      setState(dirty.current ? "saving" : "saved");
    } catch (err) {
      dirty.current = true;
      setState("error");
      toast.error(err instanceof Error ? err.message : "Couldn't save your changes.");
    }
  }, [save]);

  useEffect(() => {
    if (!values || !dirty.current) return;
    const t = setTimeout(() => void flush(), 700);
    return () => clearTimeout(t);
  }, [values, flush]);

  // Leaving mid-debounce still saves.
  const flushRef = useRef(flush);
  flushRef.current = flush;
  useEffect(() => () => void flushRef.current(), []);

  function set<K extends keyof T>(key: K, value: T[K]) {
    dirty.current = true;
    setState("saving");
    setValues((v) => (v ? { ...v, [key]: value } : v));
  }

  return { values, set, state, retry: flush };
}

/* ── Page ───────────────────────────────────────────────────────── */

function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: getSettings });

  const brand = useAutosaved(
    profile !== undefined
      ? {
          brand_name: profile?.brand_name ?? "",
          website_url: profile?.website_url ?? "",
          product_description: profile?.product_description ?? "",
        }
      : null,
    useCallback(
      async (v) => {
        await updateProfile({
          brand_name: v.brand_name.trim(),
          website_url: v.website_url.trim(),
          product_description: v.product_description.trim(),
        });
        void queryClient.invalidateQueries({ queryKey: ["profile"] });
      },
      [queryClient],
    ),
  );

  const writing = useAutosaved(
    settings !== undefined
      ? {
          audience: settings?.audience ?? "",
          tone: settings?.tone ?? "",
          writing_style: settings?.writing_style ?? "",
          brand_voice: settings?.brand_voice ?? "",
        }
      : null,
    useCallback(
      async (v) => {
        await updateSettings({
          audience: v.audience.trim(),
          tone: v.tone.trim(),
          writing_style: v.writing_style.trim(),
          brand_voice: v.brand_voice.trim(),
        });
        void queryClient.invalidateQueries({ queryKey: ["settings"] });
      },
      [queryClient],
    ),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Teach autopilot your brand, decide how often it writes, and manage your account. Changes save as you go."
      />
      <BrandSection form={brand} />
      <WritingSection form={writing} brand={brand.values} />
      <AutopilotSection />
      <AccountSection />
    </div>
  );
}

/* ── Layout pieces ──────────────────────────────────────────────── */

function Section({
  title,
  description,
  status,
  children,
}: {
  title: string;
  description: string;
  status?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        {status}
      </div>
      <Panel className="divide-y divide-border">{children}</Panel>
    </section>
  );
}

/** One setting: what it is and why it matters on the left, the control on the right. */
function Row({
  title,
  description,
  htmlFor,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-5 sm:px-6 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-10">
      <div>
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {title}
        </label>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function SaveStatus({ state, onRetry }: { state: SaveState; onRetry: () => void }) {
  if (state === "idle") return null;
  return (
    <span
      role="status"
      className={cn(
        "flex items-center gap-1.5 whitespace-nowrap text-xs",
        state === "error" ? "text-destructive" : "text-muted-foreground",
      )}
    >
      {state === "saving" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {state === "saved" && <CheckIcon className="h-3.5 w-3.5 text-success" />}
      {state === "saving" ? "Saving…" : state === "saved" ? "Saved" : "Couldn't save"}
      {state === "error" && (
        <button
          type="button"
          onClick={onRetry}
          className="font-medium underline underline-offset-2"
        >
          Retry
        </button>
      )}
    </span>
  );
}

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20";
const textareaClass =
  "w-full resize-y rounded-lg border border-border bg-card px-3 py-2.5 text-sm leading-relaxed text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20";

function FieldSkeleton({ tall }: { tall?: boolean }) {
  return <div className={cn("skeleton w-full", tall ? "h-24" : "h-10")} />;
}

/* ── Brand ──────────────────────────────────────────────────────── */

type BrandValues = { brand_name: string; website_url: string; product_description: string };

function BrandSection({ form }: { form: ReturnType<typeof useAutosaved<BrandValues>> }) {
  const v = form.values;
  return (
    <Section
      title="Your brand"
      description="Who autopilot writes for. Every article is built around this."
      status={<SaveStatus state={form.state} onRetry={() => void form.retry()} />}
    >
      <Row
        title="Brand name"
        htmlFor="brand-name"
        description="How articles refer to you when they mention what you offer."
      >
        {v ? (
          <input
            id="brand-name"
            value={v.brand_name}
            onChange={(e) => form.set("brand_name", e.target.value)}
            placeholder="e.g. Plannora"
            className={inputClass}
          />
        ) : (
          <FieldSkeleton />
        )}
      </Row>
      <Row title="Website" htmlFor="website" description="The site your articles are published to.">
        {v ? (
          <input
            id="website"
            value={v.website_url}
            onChange={(e) => form.set("website_url", e.target.value)}
            // Accept "example.com" as typed; store it as a proper URL.
            onBlur={(e) => {
              const url = e.target.value.trim();
              if (url && !/^https?:\/\//i.test(url)) form.set("website_url", `https://${url}`);
            }}
            placeholder="example.com"
            inputMode="url"
            className={inputClass}
          />
        ) : (
          <FieldSkeleton />
        )}
      </Row>
      <Row
        title="What you sell"
        htmlFor="product"
        description="Two or three sentences on what you offer and who it's for. The writer uses it to tie every article back to you."
      >
        {v ? (
          <textarea
            id="product"
            rows={4}
            value={v.product_description}
            onChange={(e) => form.set("product_description", e.target.value)}
            placeholder="e.g. Plannora is a project manager for teams of 2–20 who find Jira too heavy. It replaces standups with a daily digest."
            className={textareaClass}
          />
        ) : (
          <FieldSkeleton tall />
        )}
      </Row>
    </Section>
  );
}

/* ── Writing ────────────────────────────────────────────────────── */

type WritingValues = {
  audience: string;
  tone: string;
  writing_style: string;
  brand_voice: string;
};

function WritingSection({
  form,
  brand,
}: {
  form: ReturnType<typeof useAutosaved<WritingValues>>;
  brand: BrandValues | null;
}) {
  const v = form.values;
  const brief = composeStyleBrief({
    brand: brand?.brand_name,
    product: brand?.product_description,
    tone: v?.tone,
    style: v?.writing_style,
    audience: v?.audience,
    voice: v?.brand_voice,
  });

  return (
    <Section
      title="How autopilot writes"
      description="The voice every article is written in. Changes apply to the next article it writes."
      status={<SaveStatus state={form.state} onRetry={() => void form.retry()} />}
    >
      <Row
        title="Audience"
        htmlFor="audience"
        description="Who's reading. It sets what the writer explains and what it can assume."
      >
        {v ? (
          <div className="space-y-2.5">
            <input
              id="audience"
              value={v.audience}
              onChange={(e) => form.set("audience", e.target.value)}
              placeholder={STYLE_DEFAULTS.audience}
              className={inputClass}
            />
            <Suggestions
              options={AUDIENCES}
              value={v.audience}
              onPick={(a) => form.set("audience", a)}
            />
          </div>
        ) : (
          <FieldSkeleton />
        )}
      </Row>
      <Row title="Tone" description="How it feels to read.">
        {v ? (
          <Choice
            label="Tone"
            options={TONES}
            value={v.tone}
            fallback={STYLE_DEFAULTS.tone}
            onChange={(t) => form.set("tone", t)}
          />
        ) : (
          <FieldSkeleton />
        )}
      </Row>
      <Row title="Writing style" description="How ideas are laid out on the page.">
        {v ? (
          <Choice
            label="Writing style"
            options={STYLES}
            value={v.writing_style}
            fallback={STYLE_DEFAULTS.style}
            onChange={(s) => form.set("writing_style", s)}
          />
        ) : (
          <FieldSkeleton />
        )}
      </Row>
      <Row
        title="House rules"
        htmlFor="voice"
        description="Anything the writer must always or never do. One rule per line works best."
      >
        {v ? (
          <textarea
            id="voice"
            rows={4}
            value={v.brand_voice}
            onChange={(e) => form.set("brand_voice", e.target.value)}
            placeholder={"Say “teams”, not “users”.\nNever name competitors.\nUse US spelling."}
            className={textareaClass}
          />
        ) : (
          <FieldSkeleton tall />
        )}
      </Row>
      <Row
        title="What autopilot reads"
        description="The exact brief the writer gets before every article, built from the settings above."
      >
        <pre className="whitespace-pre-wrap break-words rounded-card bg-hero-black p-4 font-mono text-[12.5px] leading-relaxed text-white/85">
          {brief}
        </pre>
      </Row>
    </Section>
  );
}

/** Quick picks that fill a free-text field — faster than typing, never a cage. */
function Suggestions({
  options,
  value,
  onPick,
}: {
  options: string[];
  value: string;
  onPick: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onPick(o)}
          aria-pressed={value.trim() === o}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            value.trim() === o
              ? "border-ink bg-ink text-background"
              : "border-border bg-card text-muted-foreground hover:border-ink/20 hover:text-ink",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/**
 * One of a few good answers, or your own. Blank means the writer's default,
 * which is shown as the selected option so the user sees what's in effect.
 */
function Choice({
  label,
  options,
  value,
  fallback,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  fallback: string;
  onChange: (v: string) => void;
}) {
  const effective = value.trim() || fallback;
  const isPreset = options.includes(effective);
  const [custom, setCustom] = useState(!isPreset);
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const on = !custom && effective === o;
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => {
                setCustom(false);
                onChange(o);
              }}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                on
                  ? "border-ink bg-ink text-background"
                  : "border-border bg-card text-muted-foreground hover:border-ink/20 hover:text-ink",
              )}
            >
              {o}
            </button>
          );
        })}
        <button
          type="button"
          role="radio"
          aria-checked={custom}
          onClick={() => {
            setCustom(true);
            if (isPreset) onChange("");
          }}
          className={cn(
            "rounded-full border border-dashed px-3 py-1 text-xs font-medium transition-colors",
            custom
              ? "border-ink bg-ink text-background"
              : "border-border bg-card text-muted-foreground hover:text-ink",
          )}
        >
          Your own
        </button>
      </div>
      {custom && (
        <input
          autoFocus
          aria-label={`${label}, in your words`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Describe the ${label.toLowerCase()} in a few words`}
          className={inputClass}
        />
      )}
    </div>
  );
}

/* ── Autopilot ──────────────────────────────────────────────────── */

function AutopilotSection() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const { data: blogs = [] } = useAllArticles();
  const actions = useArticleActions({ openId: undefined, onOpen: () => undefined });
  const [busy, setBusy] = useState<"toggle" | "pace" | null>(null);

  const entitled =
    !!actions.subscription &&
    ["trialing", "active", "past_due"].includes(actions.subscription.status);
  const enabled = settings?.autopilot_enabled !== false;
  const pace = settings?.weekly_cadence ?? 7;
  const scheduled = blogs.filter((b) => b.status === "scheduled").length;
  const perMonth = Math.round((pace * 52) / 12);
  const planTotal = actions.credits?.credits_total ?? null;

  async function toggle(next: boolean) {
    setBusy("toggle");
    try {
      await updateAutopilot({ autopilot_enabled: next });
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success(next ? "Autopilot is on." : "Autopilot paused.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update autopilot.");
    } finally {
      setBusy(null);
    }
  }

  async function applyQueue(patches: QueuePatch[]) {
    const current = queryClient.getQueryData<Blog[]>(["blogs", "all"]) ?? blogs;
    queryClient.setQueryData<Blog[]>(["blogs", "all"], applyPatches(current, patches));
    await Promise.all(patches.map(({ id, ...patch }) => updateBlog(id, patch)));
  }

  /**
   * A new pace re-spaces the schedule to match — otherwise the calendar would
   * promise dates autopilot can't keep. Undo restores both.
   */
  async function changePace(next: number) {
    if (next === pace) return;
    setBusy("pace");
    const previous = pace;
    const current = queryClient.getQueryData<Blog[]>(["blogs", "all"]) ?? blogs;
    const patches = planFromTomorrow(current, next);
    const undo = inversePatches(current, patches);
    try {
      await updateAutopilot({ weekly_cadence: next });
      await applyQueue(patches);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["settings"] }),
        queryClient.invalidateQueries({ queryKey: ["blogs"] }),
      ]);
      toast.success(
        `Autopilot now writes ${paceLabel(next)}.${
          patches.length ? ` ${scheduled} scheduled articles re-spaced from tomorrow.` : ""
        }`,
        {
          action: {
            label: "Undo",
            onClick: async () => {
              await updateAutopilot({ weekly_cadence: previous });
              await applyQueue(undo);
              void queryClient.invalidateQueries({ queryKey: ["settings"] });
              void queryClient.invalidateQueries({ queryKey: ["blogs"] });
            },
          },
        },
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't change the pace.");
      void queryClient.invalidateQueries({ queryKey: ["blogs"] });
    } finally {
      setBusy(null);
    }
  }

  return (
    <Section title="Autopilot" description="Whether it writes, and how often.">
      {actions.dialogs}
      <Row
        title="Write automatically"
        htmlFor="autopilot"
        description={
          entitled
            ? "Pause any time — scheduled articles wait, nothing is lost."
            : "Autopilot starts writing when your free trial does."
        }
      >
        {settings === undefined ? (
          <FieldSkeleton />
        ) : entitled ? (
          <div className="flex items-center gap-3">
            <Switch
              id="autopilot"
              checked={enabled}
              disabled={busy === "toggle"}
              onCheckedChange={(v) => void toggle(v)}
            />
            <span className="text-sm text-ink">
              {enabled ? `On — writing ${paceLabel(pace)}` : "Paused"}
            </span>
          </div>
        ) : (
          <Button variant="brand" onClick={actions.openTrial}>
            Start free trial
          </Button>
        )}
      </Row>
      <Row
        title="Pace"
        description="How many articles a week. Consistency is what search engines reward — pick a pace you can keep."
      >
        {settings === undefined ? (
          <FieldSkeleton />
        ) : (
          <div className="space-y-3">
            <div
              className="flex flex-wrap gap-1.5"
              role="radiogroup"
              aria-label="Articles per week"
            >
              {(PACES.includes(pace) ? PACES : [...PACES, pace].sort((a, b) => b - a)).map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={pace === n}
                  disabled={busy === "pace"}
                  onClick={() => void changePace(n)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60",
                    pace === n
                      ? "border-ink bg-ink text-background"
                      : "border-border bg-card text-muted-foreground hover:border-ink/20 hover:text-ink",
                  )}
                >
                  {n === 7 ? "Every day" : `${n} a week`}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              About <span className="font-semibold text-ink">{perMonth} articles a month</span>
              {planTotal !== null && (
                <>
                  {" "}
                  · your plan covers {planTotal}
                  {perMonth > planTotal && (
                    <span className="font-medium text-destructive">
                      {" "}
                      — autopilot will run out before the month ends
                    </span>
                  )}
                </>
              )}
              .{scheduled > 0 && ` Changing it re-spaces your ${scheduled} scheduled articles.`}
            </p>
          </div>
        )}
      </Row>
    </Section>
  );
}

/* ── Account ────────────────────────────────────────────────────── */

function planLabel(status: string | undefined): string {
  if (status === "trialing") return "Pro · free trial";
  if (status === "active") return "Pro";
  if (status === "past_due") return "Pro · payment due";
  return "No plan yet";
}

function AccountSection() {
  const { data: user } = useQuery({ queryKey: ["auth", "user"], queryFn: getCurrentUser });
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });
  const signOut = useSignOut();
  return (
    <Section title="Account" description="Your login and plan.">
      <Row title="Email" description="Where receipts and account emails go.">
        <p className="flex h-10 items-center text-sm text-ink">{user?.email || "—"}</p>
      </Row>
      <Row title="Plan" description="Articles, trial and payment live in Plan & Billing.">
        <div className="flex h-10 items-center gap-3">
          <span className="text-sm text-ink">{planLabel(subscription?.status)}</span>
          <Link
            to="/dashboard/billing"
            className="text-sm font-medium text-volt underline-offset-2 hover:underline"
          >
            Manage in Plan & Billing →
          </Link>
        </div>
      </Row>
      <Row title="Sign out" description="Signs you out on this device.">
        <Button variant="ghost" onClick={() => void signOut()}>
          Sign out
        </Button>
      </Row>
    </Section>
  );
}
