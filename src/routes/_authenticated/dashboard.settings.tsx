import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save, Coins, Check } from "lucide-react";
import {
  getProfile,
  getSettings,
  getCredits,
  updateProfile,
  updateSettings,
  purchaseCredits,
} from "@/lib/api";
import { Panel, Button, PageHeader, StatCard } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: SettingsPage,
});

const CREDIT_PACKAGES = [
  { id: "starter", label: "Starter", credits: 500, amountCents: 1900 },
  { id: "growth", label: "Growth", credits: 1500, amountCents: 4900 },
  { id: "scale", label: "Scale", credits: 5000, amountCents: 14900 },
];

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-ink outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-ink outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      )}
    </label>
  );
}

function SettingsPage() {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const { data: credits } = useQuery({ queryKey: ["credits"], queryFn: getCredits });

  const [brandName, setBrandName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [tone, setTone] = useState("");
  const [writingStyle, setWritingStyle] = useState("");
  const [audience, setAudience] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [savingPrefs, setSavingPrefs] = useState(false);

  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setBrandName(profile.brand_name ?? "");
      setWebsiteUrl(profile.website_url ?? "");
      setProductDescription(profile.product_description ?? "");
    }
  }, [profile]);

  useEffect(() => {
    if (settings) {
      setTone(settings.tone ?? "");
      setWritingStyle(settings.writing_style ?? "");
      setAudience(settings.audience ?? "");
      setBrandVoice(settings.brand_voice ?? "");
    }
  }, [settings]);

  const remaining = credits ? credits.credits_total - credits.credits_used : null;

  async function saveProfile() {
    setSavingProfile(true);
    try {
      await updateProfile({
        brand_name: brandName.trim(),
        website_url: websiteUrl.trim(),
        product_description: productDescription.trim(),
      });
      toast.success("Brand profile saved.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePrefs() {
    setSavingPrefs(true);
    try {
      await updateSettings({
        tone: tone.trim(),
        writing_style: writingStyle.trim(),
        audience: audience.trim(),
        brand_voice: brandVoice.trim(),
      });
      toast.success("Content preferences saved.");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save preferences.");
    } finally {
      setSavingPrefs(false);
    }
  }

  async function buy(pkg: (typeof CREDIT_PACKAGES)[number]) {
    setBuyingId(pkg.id);
    try {
      await purchaseCredits(pkg.id, pkg.credits, pkg.amountCents);
      toast.success(`Added ${pkg.credits.toLocaleString()} credits.`);
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not purchase credits.");
    } finally {
      setBuyingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your brand profile, content preferences, and credits."
      />

      <Panel className="space-y-4 p-6">
        <div>
          <h2 className="text-sm font-semibold text-ink">Brand profile</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Used to tailor every article our engine writes for you.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Brand name" value={brandName} onChange={setBrandName} placeholder="Rankvolt" />
          <Field
            label="Website URL"
            value={websiteUrl}
            onChange={setWebsiteUrl}
            placeholder="https://example.com"
          />
        </div>
        <Field
          label="Product description"
          value={productDescription}
          onChange={setProductDescription}
          placeholder="What you offer and to whom…"
          textarea
        />
        <div className="flex justify-end">
          <Button onClick={saveProfile} disabled={savingProfile}>
            {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save profile
          </Button>
        </div>
      </Panel>

      <Panel className="space-y-4 p-6">
        <div>
          <h2 className="text-sm font-semibold text-ink">Content preferences</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Shape the voice and style of your generated content.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tone" value={tone} onChange={setTone} placeholder="Confident, friendly" />
          <Field
            label="Writing style"
            value={writingStyle}
            onChange={setWritingStyle}
            placeholder="Concise, actionable"
          />
          <Field label="Audience" value={audience} onChange={setAudience} placeholder="Founders, marketers" />
          <Field
            label="Brand voice"
            value={brandVoice}
            onChange={setBrandVoice}
            placeholder="How your brand sounds"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={savePrefs} disabled={savingPrefs}>
            {savingPrefs ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save preferences
          </Button>
        </div>
      </Panel>

      <Panel className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-ink">Credits</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Credits are spent generating and publishing articles.
            </p>
          </div>
          <StatCard
            label="Remaining"
            value={remaining === null ? "—" : remaining.toLocaleString()}
            hint={credits ? `${credits.credits_used.toLocaleString()} used` : undefined}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5"
            >
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-warning" />
                <span className="text-sm font-semibold text-ink">{pkg.label}</span>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-ink tabular-nums">
                {pkg.credits.toLocaleString()}
                <span className="ml-1 text-xs font-medium text-muted-foreground">credits</span>
              </p>
              <p className="text-sm text-muted-foreground">
                ${(pkg.amountCents / 100).toFixed(2)}
              </p>
              <Button
                className="mt-auto w-full"
                onClick={() => buy(pkg)}
                disabled={buyingId !== null}
              >
                {buyingId === pkg.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Buy
              </Button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}