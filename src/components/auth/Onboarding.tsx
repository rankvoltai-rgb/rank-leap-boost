import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Rocket } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo, Reveal } from "@/components/landing/shared";
import { KeywordEditor, SEED_KEYWORDS } from "./KeywordEditor";
import { HostingPicker } from "./HostingPicker";
import { seedAccount } from "@/lib/api";

function Field({
  label,
  type = "text",
  placeholder,
  optional,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink">
        {label}
        {optional && (
          <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        )}
      </span>
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
  const [step, setStep] = useState(1);
  const total = 2;
  const [brand, setBrand] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>(SEED_KEYWORDS);
  const [saving, setSaving] = useState(false);

  async function finish() {
    if (!brand.trim() || !url.trim()) {
      toast.error("Please add your brand name and website URL.");
      return;
    }
    setSaving(true);
    try {
      await seedAccount({
        brand_name: brand.trim(),
        website_url: url.trim(),
        product_description: description.trim(),
        keywords,
      });
      toast.success("Your traffic engine is ready.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
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
        <div className="w-full max-w-xl">
          {/* Progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-ink">
                Step {step} of {total}
              </span>
              <span className="text-muted-foreground">
                {step === 1 ? "About your brand" : "Keywords & hosting"}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-ink transition-all duration-500"
                style={{ width: `${(step / total) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            {step === 1 ? (
              <Reveal key="step1">
                <h1 className="text-2xl font-bold tracking-tight text-ink">
                  Tell us about your brand
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  We use this to research keywords and match your voice.
                </p>
                <div className="mt-6 space-y-4">
                  <Field
                    label="Brand Name"
                    placeholder="RankPill"
                    value={brand}
                    onChange={setBrand}
                  />
                  <Field
                    label="Website URL"
                    type="url"
                    placeholder="https://yoursite.com"
                    value={url}
                    onChange={setUrl}
                  />
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink">
                      Describe your product
                      <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                    </span>
                    <textarea
                      rows={3}
                      placeholder="What do you offer and who is it for?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full resize-none rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ink focus:ring-2 focus:ring-ink/10"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </Reveal>
            ) : (
              <Reveal key="step2">
                <h1 className="text-2xl font-bold tracking-tight text-ink">
                  Review your keywords
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  We found these for you — add or remove any before we start.
                </p>
                <div className="mt-6">
                  <KeywordEditor keywords={keywords} onChange={setKeywords} />
                </div>

                <div className="mt-8">
                  <h2 className="text-sm font-semibold text-ink">Select website hosting</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Where should we publish your articles?
                  </p>
                  <div className="mt-4">
                    <HostingPicker />
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-secondary"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={finish}
                    disabled={saving}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Rocket className="h-4 w-4" />
                    )}
                    Start my free trial
                  </button>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}