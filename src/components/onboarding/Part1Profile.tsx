/**
 * Part 1 — Your brand.
 *
 * Scanned from the website as soon as one is entered — the URL carried from the
 * landing page, or one typed here: the site is scraped and its brand name, what
 * it does and its logo are filled in. Everything stays editable, and anything
 * the scan missed is blank rather than guessed.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ImagePlus, Loader2, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Field, TextareaField } from "@/components/ui/field";
import { fetchSiteMeta, type SiteMeta } from "@/lib/data";

const LOGO_SOURCE_LABEL: Record<string, string> = {
  "og:image": "Found in your page's og:image",
  "apple-touch-icon": "Found in your apple-touch-icon",
  favicon: "Found in your favicon",
};

/** Enough of a domain to be worth a scrape: a dot and a 2+ letter TLD. */
const LOOKS_LIKE_SITE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

/** Pause after typing before scanning, so a half-typed domain isn't scraped. */
const TYPING_PAUSE_MS = 900;

type ScannedField = "brandName" | "description" | "logoUrl";

export interface Part1Value {
  url: string;
  brandName: string;
  description: string;
  logoUrl: string | null;
  logoSource: string | null;
}

function LogoWell({
  logoUrl,
  logoSource,
  brandName,
  busy,
  onUpload,
  onClear,
}: {
  logoUrl: string | null;
  logoSource: string | null;
  brandName: string;
  busy: boolean;
  onUpload: (dataUrl: string) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("That file isn't an image.");
      return;
    }
    if (file.size > 1_000_000) {
      toast.error("Logo must be under 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onUpload(String(reader.result));
    reader.onerror = () => toast.error("Couldn't read that file.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-1">
      <div
        className={cn(
          "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary",
          busy && "animate-pulse",
        )}
      >
        {busy ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : logoUrl ? (
          <img
            src={logoUrl}
            alt={`${brandName || "Brand"} logo`}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="font-display text-xl font-semibold text-muted-foreground">
            {(brandName.trim()[0] || "?").toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-[9rem] flex-1">
        <p className="text-sm font-semibold text-ink">Brand logo</p>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
          {busy
            ? "Reading your site…"
            : logoUrl
              ? (logoSource && LOGO_SOURCE_LABEL[logoSource]) || "Pulled from your site"
              : "We couldn't find one — upload it and it'll appear on every article."}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-ink transition-colors hover:bg-secondary"
        >
          {logoUrl ? <RefreshCw className="h-3.5 w-3.5" /> : <ImagePlus className="h-3.5 w-3.5" />}
          {logoUrl ? "Replace" : "Upload"}
        </button>
        {logoUrl && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Remove logo"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function Part1Profile({
  value,
  onChange,
  onNext,
}: {
  value: Part1Value;
  onChange: (patch: Partial<Part1Value>) => void;
  onNext: () => void;
}) {
  const [fetching, setFetching] = useState(false);
  // Bumped per scan: only the newest may write to the form or clear the
  // spinner, so a slow scan of an earlier URL can't overwrite a newer one.
  const scanId = useRef(0);
  // The URL last scanned, so the effect below doesn't scan it again.
  const scanFor = useRef<string | null>(null);
  // What the last scan filled in. A field still holding that value was never
  // edited, so scanning a different site may replace it; anything the user
  // typed is kept.
  const scanned = useRef<Pick<Part1Value, ScannedField>>({
    brandName: "",
    description: "",
    logoUrl: null,
  });
  // Scans resolve seconds later; compare against the form as it is then.
  const latest = useRef(value);
  latest.current = value;

  async function scan(url: string, { silent = false } = {}) {
    const trimmed = url.trim();
    if (!trimmed) return;
    const id = ++scanId.current;
    scanFor.current = trimmed;
    setFetching(true);
    try {
      const meta: SiteMeta = await fetchSiteMeta(trimmed);
      if (id !== scanId.current) return;

      const current = latest.current;
      const untouched = (field: ScannedField) =>
        !current[field] || current[field] === scanned.current[field];
      // An uploaded logo (always a data: URL) is the user's choice; a scraped
      // one is replaced when the site is read again.
      const takeLogo = untouched("logoUrl") || !current.logoUrl?.startsWith("data:");

      // The canonical URL replaces what was typed; don't rescan it.
      scanFor.current = meta.url;
      scanned.current = {
        brandName: meta.brandName,
        description: meta.description,
        logoUrl: meta.logoUrl,
      };
      onChange({
        url: meta.url,
        brandName: untouched("brandName") ? meta.brandName : current.brandName,
        description: untouched("description") ? meta.description : current.description,
        logoUrl: takeLogo ? meta.logoUrl : current.logoUrl,
        logoSource: takeLogo ? meta.logoSource : current.logoSource,
      });
      if (!silent) toast.success(`Read ${meta.domain}`);
    } catch {
      if (!silent && id === scanId.current) {
        toast.error("Couldn't read that site. Fill it in and continue.");
      }
    } finally {
      if (id === scanId.current) setFetching(false);
    }
  }

  // Scan whenever a website is entered: straight away for the URL carried from
  // the landing page, and once the user pauses while typing a new one.
  useEffect(() => {
    const url = value.url.trim();
    if (!url || url === scanFor.current || !LOOKS_LIKE_SITE.test(url)) return;
    const firstRun = scanFor.current === null;
    // A restored draft was scanned before the refresh; don't re-read it.
    if (firstRun && value.brandName) {
      scanFor.current = url;
      return;
    }
    const timer = window.setTimeout(
      () => void scan(url, { silent: true }),
      firstRun ? 0 : TYPING_PAUSE_MS,
    );
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.url]);

  const canContinue = value.url.trim().length > 0 && value.brandName.trim().length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canContinue) {
          toast.error("Add your website and brand name to continue.");
          return;
        }
        onNext();
      }}
    >
      <div className="space-y-5">
        <div className="flex items-end gap-2">
          <Field
            className="flex-1"
            label="Website"
            placeholder="yoursite.com"
            value={value.url}
            onChange={(v) => onChange({ url: v })}
            required
            hint={fetching ? "Reading…" : undefined}
          />
          <button
            type="button"
            disabled={fetching || !value.url.trim()}
            onClick={() => void scan(value.url)}
            className="mb-0 inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 text-sm font-semibold text-ink transition-colors hover:bg-secondary disabled:opacity-50"
          >
            {fetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Re-read
          </button>
        </div>

        <LogoWell
          logoUrl={value.logoUrl}
          logoSource={value.logoSource}
          brandName={value.brandName}
          busy={fetching}
          onUpload={(dataUrl) => onChange({ logoUrl: dataUrl, logoSource: null })}
          onClear={() => onChange({ logoUrl: null, logoSource: null })}
        />

        <Field
          label="Brand name"
          placeholder="Plannora"
          value={value.brandName}
          onChange={(v) => onChange({ brandName: v })}
          required
        />

        <TextareaField
          label="What you do"
          placeholder="One or two sentences a stranger would understand."
          value={value.description}
          onChange={(v) => onChange({ description: v })}
          rows={4}
          hint={fetching ? "Reading your site…" : "Used to brief every article"}
        />
      </div>

      <div className="mt-8 flex items-center justify-end gap-4">
        <p className="hidden text-xs text-muted-foreground sm:block">Takes about 20 seconds</p>
        <button
          type="submit"
          disabled={!canContinue}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-white shadow-2 transition-all hover:-translate-y-0.5 hover:bg-brand-blue/90 disabled:translate-y-0 disabled:opacity-50"
        >
          Analyze my site
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
