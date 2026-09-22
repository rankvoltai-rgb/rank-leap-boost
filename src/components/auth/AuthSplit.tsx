import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { signInWithPassword, signUpWithPassword } from "@/lib/auth";
import { listSites } from "@/lib/data";
import { IS_MOCK } from "@/lib/mock/mode";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/mock/auth";
import { Logo, Reveal } from "@/components/landing/shared";
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
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ink focus:ring-2 focus:ring-ink/10"
      />
    </label>
  );
}

export function AuthSplit() {
  const navigate = useNavigate();
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
        await signUpWithPassword({ email, password, fullName: name });
        navigate({ to: "/onboarding" });
        return;
      }
      await signInWithPassword({ email, password });
      const sites = await listSites();
      navigate({ to: sites.length > 0 ? "/dashboard" : "/onboarding" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed.");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form panel */}
      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-14">
        <a href="/" className="shrink-0">
          <Logo />
        </a>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <Reveal>
              <h1 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl">
                Start getting Google &amp; ChatGPT traffic{" "}
                <span className="rounded-lg bg-brand-blue px-1.5 text-white decoration-clone box-decoration-clone">
                  in the next 7 days
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Automatically research, write, and publish SEO-optimized articles that rank on
                Google and get cited by AI so you grow traffic without lifting a finger.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-7">
                <SocialButtons />
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  or continue with email
                </span>
                <span className="h-px flex-1 bg-border" />
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "signup" ? "Start my traffic engine" : "Sign in"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </Reveal>

            {IS_MOCK && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-secondary/40 px-3.5 py-2.5 text-xs text-muted-foreground">
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
                  className="font-semibold text-ink hover:underline"
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
      <div className="relative hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:self-start">
        <AiSearchScene className="absolute inset-0" />
      </div>
    </div>
  );
}
