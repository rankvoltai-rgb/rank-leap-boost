import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getProfile } from "@/lib/api";
import { Logo, Reveal, Stars, Avatar } from "@/components/landing/shared";
import { SocialButtons } from "./SocialButtons";
import { AuthVisual } from "./AuthVisual";

import avatar1 from "@/assets/avatar-1.jpg.asset.json";
import avatar2 from "@/assets/avatar-2.jpg.asset.json";
import avatar3 from "@/assets/avatar-3.jpg.asset.json";
import avatar4 from "@/assets/avatar-4.jpg.asset.json";
import avatar5 from "@/assets/avatar-5.jpg.asset.json";

const FACES = [
  { name: "Owen Carter", src: avatar1.url },
  { name: "Priya Raman", src: avatar2.url },
  { name: "Hannah Whitfield", src: avatar3.url },
  { name: "Marco Silva", src: avatar4.url },
  { name: "Elise Tanaka", src: avatar5.url },
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
              <h1 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl">
                Start getting Google &amp; ChatGPT traffic{" "}
                <span className="rounded-lg bg-info/15 px-1.5 decoration-clone box-decoration-clone">
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
      <div
        className="relative hidden flex-col justify-between overflow-hidden px-14 py-12 text-background lg:flex"
        style={{
          background:
            "linear-gradient(160deg, color-mix(in oklab, var(--volt) 92%, white 8%) 0%, var(--volt) 42%, color-mix(in oklab, var(--volt) 68%, var(--ink) 32%) 100%)",
        }}
      >
        {/* ambient light + texture */}
        <div className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-background/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-ink/20 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative flex flex-1 items-center justify-center py-6">
          <AuthVisual />
        </div>

        <div className="relative mt-10 flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {FACES.map((f) => (
              <Avatar
                key={f.name}
                name={f.name}
                src={f.src}
                className="h-9 w-9 ring-2 ring-background/70"
              />
            ))}
          </div>
          <div className="flex flex-col gap-0.5">
            <Stars />
            <p className="text-sm text-background/80">
              <span className="font-semibold text-background">400+</span> founders growing with Rankvolt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}