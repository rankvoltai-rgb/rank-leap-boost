import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { signInWithPassword, signUpWithPassword } from "@/lib/auth";
import { listSites } from "@/lib/data";
import { IS_MOCK } from "@/lib/mock/mode";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/mock/auth";
import { Reveal } from "@/components/landing/shared";
import { Mark } from "@/components/brand/Mark";
import { SocialButtons } from "./SocialButtons";
import { AiSearchScene } from "./AiSearchScene";

function Field({
  label,
  type,
  placeholder,
  autoComplete,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.85rem] font-medium text-ink">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-ink/[0.1] bg-white px-3.5 text-[0.95rem] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground hover:border-ink/[0.16] focus:border-cta/50 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_12%,transparent)]"
      />
    </label>
  );
}

export function AuthSplit() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUpWithPassword({ email, password, fullName: name, returnPath: redirect });
        if (redirect) window.location.assign(redirect);
        else navigate({ to: "/onboarding" });
        return;
      }
      await signInWithPassword({ email, password });
      if (redirect) {
        window.location.assign(redirect);
        return;
      }
      const sites = await listSites();
      navigate({ to: sites.length > 0 ? "/dashboard" : "/onboarding" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed.");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Form panel */}
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-14">
        {/* The landing navbar's mark: bare, in brand blue. */}
        <a href="/" className="flex w-fit shrink-0 items-center gap-2.5">
          <Mark className="h-6 w-6 text-brand-blue" />
          <span className="text-[1.2rem] font-semibold tracking-tight text-ink">Rankbox</span>
        </a>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <Reveal>
              <h1 className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.035em] text-ink sm:text-[2.6rem]">
                Get Google &amp; ChatGPT traffic{" "}
                <span className="font-bold text-brand-blue">in 7 days</span>
              </h1>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-muted-foreground">
                Automatically research, write, and publish SEO-optimized articles that rank on
                Google and get cited by AI so you grow traffic without lifting a finger.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-7">
                <SocialButtons returnPath={redirect} />
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-ink/[0.08]" />
                <span className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/85">
                  or continue with email
                </span>
                <span className="h-px flex-1 bg-ink/[0.08]" />
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <Field
                    label="Full Name"
                    type="text"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    value={name}
                    onChange={setName}
                  />
                )}
                <Field
                  label="Business Email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  value={email}
                  onChange={setEmail}
                />
                <Field
                  label="Password"
                  type="password"
                  placeholder={mode === "signup" ? "Create a password" : "Your password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={setPassword}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cta px-6 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "signup" ? "Start my traffic engine" : "Sign in"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>
            </Reveal>

            {IS_MOCK && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-dashed border-ink/[0.14] bg-white px-3.5 py-2.5 text-xs text-muted-foreground">
                <span>
                  Mock mode · accounts stay in this browser. Demo:{" "}
                  <span className="font-medium text-ink">{DEMO_EMAIL}</span> / {DEMO_PASSWORD}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setEmail(DEMO_EMAIL);
                    setPassword(DEMO_PASSWORD);
                  }}
                  className="shrink-0 font-semibold text-ink hover:underline"
                >
                  Use demo
                </button>
              </div>
            )}

            {mode === "signup" && (
              <Reveal delay={0.22}>
                <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                  By creating an account you agree to our{" "}
                  <Link to="/legal/terms" className="font-medium text-ink hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/legal/privacy" className="font-medium text-ink hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </Reveal>
            )}

            <Reveal delay={0.24}>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signup" ? "Already have an account? " : "New to Rankbox? "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                  className="font-semibold text-cta underline-offset-2 hover:underline"
                >
                  {mode === "signup" ? "Sign in" : "Create one"}
                </button>
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* What Rankbox sees: an AI search for a recommendation, the AI Overview
          it returns, and where the brand lands in it. One screen tall and
          pinned, so the whole scene stays in view while the form scrolls. */}
      <div className="relative hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:self-start lg:p-3">
        {/* Inset from the window edge and rounded, like a framed picture. */}
        <AiSearchScene className="h-full w-full rounded-[20px] ring-1 ring-black/5" />
      </div>
    </div>
  );
}
