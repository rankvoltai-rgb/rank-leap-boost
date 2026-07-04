import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { generatePersonalAiPlan, type PersonalAiPlan } from "@/lib/tools.functions";
import { captureToolLead } from "@/lib/leads.functions";
import { Field, TextInput, TextArea, RunButton, ErrorNote, readAiError } from "./shared";

const TOOL_SLUG = "get-recommended-by-chatgpt";

function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
      }
      className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:bg-secondary"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

export function PersonalAiVisibility() {
  const run = useServerFn(generatePersonalAiPlan);
  const saveLead = useServerFn(captureToolLead);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [current, setCurrent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<PersonalAiPlan | null>(null);

  // email gate
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [emailError, setEmailError] = useState("");

  // checklist progress
  const [done, setDone] = useState<Record<string, boolean>>({});

  const totalItems = useMemo(
    () => (plan ? plan.checklist.reduce((n, s) => n + s.items.length, 0) : 0),
    [plan],
  );
  const doneCount = Object.values(done).filter(Boolean).length;
  const pct = totalItems ? Math.round((doneCount / totalItems) * 100) : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || role.trim().length < 2 || loading) return;
    setLoading(true);
    setError("");
    setPlan(null);
    setUnlocked(false);
    setDone({});
    try {
      const result = await run({
        data: {
          name: name.trim(),
          role: role.trim(),
          current: current.trim() || undefined,
        },
      });
      setPlan(result);
    } catch (err) {
      setError(readAiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email.");
      return;
    }
    setSaving(true);
    setEmailError("");
    try {
      await saveLead({
        data: {
          email: email.trim(),
          name: name.trim() || undefined,
          role: role.trim() || undefined,
          tool: TOOL_SLUG,
        },
      });
      setUnlocked(true);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* Form */}
      <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-border bg-card p-6 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name">
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Rivera"
            />
          </Field>
          <Field label="What you do" hint="role, niche, or offer">
            <TextInput
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="fractional CMO for B2B SaaS startups"
            />
          </Field>
        </div>
        <Field label="Current LinkedIn headline or profile URL" hint="optional">
          <TextArea
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Marketing leader | ex-Acme | I help startups grow"
            className="min-h-20"
          />
        </Field>
        <div>
          <RunButton type="submit" loading={loading}>
            Show me how to get found
          </RunButton>
        </div>
      </form>

      <ErrorNote message={error} />

      {plan && (
        <div className="space-y-8">
          {/* Headlines — always visible as the teaser */}
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                Your new headlines
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Keyword-rich, human, and easy for AI to understand. Pick your favorite.
              </p>
            </div>
            <div className="space-y-3">
              {plan.headlines.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <p className="text-sm leading-relaxed text-ink">{h}</p>
                  <CopyButton value={h} />
                </div>
              ))}
            </div>
          </section>

          {!unlocked ? (
            /* Email gate */
            <section className="relative overflow-hidden rounded-2xl border border-volt/30 bg-volt/[0.04] p-6 sm:p-8">
              <div className="mx-auto max-w-md text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-volt/30 bg-background px-3 py-1 text-xs font-semibold text-volt">
                  Unlock your full plan
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
                  Your personalized checklist is ready
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Enter your email to unlock your step-by-step visibility checklist and a ready-to-paste
                  About-Me draft written just for you.
                </p>
                <form onSubmit={unlock} className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <TextInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@work.com"
                    className="flex-1"
                  />
                  <RunButton type="submit" loading={saving} className="sm:mb-0.5">
                    Unlock my plan
                  </RunButton>
                </form>
                {emailError && <p className="mt-3 text-sm text-destructive">{emailError}</p>}
                <p className="mt-3 text-xs text-muted-foreground">
                  Free. No spam — just your results and occasional tips.
                </p>
              </div>
            </section>
          ) : (
            <>
              {/* About Me */}
              <section className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                      Your About-Me draft
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Paste this into your LinkedIn About section or personal site.
                    </p>
                  </div>
                  <CopyButton value={plan.aboutMe} label="Copy text" />
                </div>
                <p className="whitespace-pre-line rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-ink">
                  {plan.aboutMe}
                </p>
              </section>

              {/* Checklist */}
              <section className="space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                      Your visibility checklist
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Check items off as you go. Small steps, real signal.
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-ink">
                    {doneCount}/{totalItems} done
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-volt transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="space-y-6">
                  {plan.checklist.map((sec, si) => (
                    <div key={si} className="rounded-2xl border border-border bg-card p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        {sec.section}
                      </h3>
                      <ul className="mt-3 space-y-2.5">
                        {sec.items.map((item, ii) => {
                          const key = `${si}-${ii}`;
                          const checked = !!done[key];
                          return (
                            <li key={key}>
                              <button
                                type="button"
                                onClick={() => setDone((d) => ({ ...d, [key]: !d[key] }))}
                                className="flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-secondary/50"
                              >
                                <span
                                  className={
                                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors " +
                                    (checked
                                      ? "border-volt bg-volt text-background"
                                      : "border-border bg-background text-transparent")
                                  }
                                >
                                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 10l4 4 8-8" />
                                  </svg>
                                </span>
                                <span className="min-w-0">
                                  <span
                                    className={
                                      "block text-sm font-medium " +
                                      (checked ? "text-muted-foreground line-through" : "text-ink")
                                    }
                                  >
                                    {item.task}
                                  </span>
                                  {item.why && (
                                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                                      {item.why}
                                    </span>
                                  )}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Engagement */}
              <section className="rounded-2xl border border-border bg-ink px-6 py-8 text-center sm:px-8">
                <h2 className="font-display text-balance text-2xl font-semibold tracking-tight text-background">
                  Don't want to do this by hand?
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-balance text-sm leading-relaxed text-background/70">
                  Rankvolt researches your buyers' questions and publishes citation-ready content daily —
                  so AI engines find, understand, and recommend you on autopilot.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/"
                    className="rounded-xl bg-background px-5 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
                  >
                    See how Rankvolt works
                  </Link>
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}
