import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getProfile } from "@/lib/api";
import { Logo, Reveal, Stars, Avatar } from "@/components/landing/shared";
import { SocialButtons } from "./SocialButtons";

const FACES = ["Owen Carter", "Priya Raman", "Hannah Whitfield", "Marco Silva", "Elise Tanaka"];

const STEPS = [
  { title: "Sign in", desc: "Create your account in seconds." },
  { title: "Connect your site", desc: "Point us at your domain and CMS." },
  { title: "Done", desc: "Daily SEO articles publish on autopilot." },
];

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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        navigate({ to: "/onboarding" });
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const profile = await getProfile();
      navigate({ to: profile ? "/dashboard" : "/onboarding" });
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
              <h1 className="text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-4xl">
                Start getting Google &amp; ChatGPT traffic{" "}
                <span className="rounded-lg bg-warning/25 px-1.5 decoration-clone box-decoration-clone">
                  in the next 7 days
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Automatically research, write, and publish SEO-optimized articles
                that rank on Google and get cited by AI so you grow traffic
                without lifting a finger.
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70"
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

            <Reveal delay={0.24}>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signup" ? "Already have an account? " : "New to Rankvolt? "}
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

      {/* Brand / visual panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink px-14 py-12 text-background lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative">
          <span className="inline-flex items-center rounded-full border border-background/20 bg-background/10 px-3 py-1 text-xs font-medium text-background/80">
            Sign in → connect site → done
          </span>
          <h2 className="mt-6 max-w-sm text-2xl font-bold leading-tight">
            Your personal SEO agent, working while you sleep.
          </h2>

          <ol className="mt-10 space-y-6">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background/10 text-sm font-semibold ring-1 ring-background/20">
                  {i === STEPS.length - 1 ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-background/70">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex -space-x-2">
            {FACES.map((f) => (
              <Avatar key={f} name={f} className="h-9 w-9" />
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
  );
}