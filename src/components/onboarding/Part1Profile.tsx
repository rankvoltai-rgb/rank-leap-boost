/**
 * Step 1 — Your brand.
 *
 * Scanned from the website as soon as one is entered — the URL carried from the
 * landing page, or one typed here: the site is scraped and its brand name, what
 * it does and its logo are filled in. Everything stays editable, and anything
 * the scan missed is blank rather than guessed.
 *
 * Laid out as the brand itself — logo, name, one-line pitch — on a single card,
 * so confirming it reads as a glance, not a form to fill.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Globe, ImagePlus, Loader2, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { fetchSiteMeta, type SiteMeta } from "@/lib/data";
import { ActionBar, PRIMARY_BUTTON } from "./shell";

const LOGO_SOURCE_LABEL: Record<string, string> = {
  "og:image": "Logo from your og:image",
  "apple-touch-icon": "Logo from your apple-touch-icon",
  favicon: "Logo from your favicon",
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

function Skeleton({ className }: { className?: string }) {
  return <span className={cn("block rounded-md bg-shimmer", className)} />;
}

/** The logo as a clickable tile: click to add or replace, × to remove. */
function LogoTile({
  logoUrl,
  brandName,
  busy,
  onUpload,
  onClear,
}: {
  logoUrl: string | null;
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
    <div className="relative shrink-0">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label={logoUrl ? "Replace logo" : "Add logo"}
        className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-2 focus-visible:ring-2 focus-visible:ring-volt/30 focus-visible:outline-none"
      >
        {busy ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : logoUrl ? (
          <img
            src={logoUrl}
            alt={`${brandName || "Brand"} logo`}
            className="h-full w-full object-contain p-1.5"
          />
        ) : (
          <ImagePlus className="h-5 w-5 text-muted-foreground" />
        )}
        {!busy && logoUrl && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-[0.65rem] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
            Change
          </span>
        )}
      </button>
      {!busy && logoUrl && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Remove logo"
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-1 transition-colors hover:text-destructive"
        >
          <X className="h-3 w-3" />
        </button>
      )}
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
  const waitingForName = fetching && !value.brandName;
  const waitingForPitch = fetching && !value.description;
  const logoNote = fetching
    ? "Reading your site…"
    : value.logoUrl
      ? (value.logoSource && LOGO_SOURCE_LABEL[value.logoSource]) || "Logo from your site"
      : "No logo found. Click the square to add one.";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Step 2 is briefed from these fields, so wait for the scan to land.
        if (fetching) return;
        if (!canContinue) {
          toast.error("Add your website and brand name to continue.");
          return;
        }
        onNext();
      }}
    >
      <label htmlFor="onboarding-url" className="mb-2 block text-sm font-medium text-ink">
        Website
      </label>
      <div className="flex h-12 items-center gap-2.5 rounded-xl border border-border bg-card pl-3.5 pr-1.5 shadow-1 transition-[border-color,box-shadow] focus-within:border-volt focus-within:ring-2 focus-within:ring-volt/15">
        <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          id="onboarding-url"
          value={value.url}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="yoursite.com"
          inputMode="url"
          autoComplete="url"
          required
          className="h-full min-w-0 flex-1 bg-transparent text-[0.95rem] text-ink outline-none placeholder:text-muted-foreground"
        />
        {fetching ? (
          <span className="flex shrink-0 items-center gap-1.5 px-2.5 text-xs font-medium text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Reading
          </span>
        ) : (
          value.url.trim() && (
            <button
              type="button"
              onClick={() => void scan(value.url)}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Re-scan
            </button>
          )
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card shadow-1">
        <div className="flex items-center gap-4 p-5">
          <LogoTile
            logoUrl={value.logoUrl}
            brandName={value.brandName}
            busy={fetching && !value.logoUrl}
            onUpload={(dataUrl) => onChange({ logoUrl: dataUrl, logoSource: null })}
            onClear={() => onChange({ logoUrl: null, logoSource: null })}
          />
          <div className="min-w-0 flex-1">
            <label htmlFor="onboarding-brand" className="text-xs font-medium text-muted-foreground">
              Brand name
            </label>
            {waitingForName ? (
              <Skeleton className="mt-1.5 h-7 w-40" />
            ) : (
              <input
                id="onboarding-brand"
                value={value.brandName}
                onChange={(e) => onChange({ brandName: e.target.value })}
                placeholder="Your brand"
                required
                className="-mx-1.5 mt-0.5 block w-[calc(100%+0.75rem)] rounded-lg bg-transparent px-1.5 py-0.5 text-xl font-semibold tracking-tight text-ink outline-none transition-colors placeholder:text-muted-foreground/50 hover:bg-secondary/60 focus:bg-secondary/80"
              />
            )}
            <p className="mt-1 truncate text-xs text-muted-foreground">{logoNote}</p>
          </div>
        </div>

        <div className="border-t border-border px-5 pb-4 pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="onboarding-pitch" className="text-xs font-medium text-muted-foreground">
              What you do
            </label>
            <span className="text-xs text-muted-foreground">Briefs every article</span>
          </div>
          {waitingForPitch ? (
            <div className="mt-3 space-y-2 pb-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
          ) : (
            <textarea
              id="onboarding-pitch"
              value={value.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="One or two sentences a stranger would understand."
              rows={3}
              className="-mx-1.5 mt-1 block min-h-[4.75rem] w-[calc(100%+0.75rem)] resize-none rounded-lg bg-transparent px-1.5 py-1 text-[0.95rem] leading-relaxed text-ink outline-none transition-colors [field-sizing:content] placeholder:text-muted-foreground/60 hover:bg-secondary/60 focus:bg-secondary/80"
            />
          )}
        </div>
      </div>

      <ActionBar note="Next, we analyze your site. It takes about 20 seconds.">
        <button type="submit" disabled={!canContinue || fetching} className={PRIMARY_BUTTON}>
          {fetching ? "Reading your site…" : "Find my keywords"}
          {!fetching && <ArrowRight className="h-4 w-4" />}
        </button>
      </ActionBar>
    </form>
  );
}
