import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Stars } from "./shared";
import { cn } from "@/lib/utils";
import { setPendingSiteUrl } from "@/lib/pending-site";
import { brandIconUrl, hostnameFrom } from "@/lib/brand-icon";
import { BrandTile } from "./used-by";
import { BRANDS } from "@/data/brands";
import { EngineTicker } from "./engine-ticker";
import { MarkDither } from "./hero-dither";
import { HeroProofBand } from "./hero-proof-band";

/* Scattered white squares drifting over the blue field. Coordinates are fixed
   (not random) so the server and client renders agree. */
export interface Pixel {
  top: string;
  left: string;
  size: number;
  opacity: number;
}

const PIXELS: Pixel[] = [
  // upper field — sparse
  { top: "3%", left: "31%", size: 14, opacity: 0.1 },
  { top: "7%", left: "66%", size: 20, opacity: 0.08 },
  { top: "11%", left: "9%", size: 22, opacity: 0.12 },
  { top: "5%", left: "88%", size: 16, opacity: 0.091 },
  { top: "16%", left: "48%", size: 12, opacity: 0.071 },
  { top: "14%", left: "79%", size: 24, opacity: 0.111 },
  { top: "9%", left: "20%", size: 10, opacity: 0.071 },
  // mid field — kept to the margins so it never fights the copy
  { top: "27%", left: "3%", size: 26, opacity: 0.131 },
  { top: "31%", left: "94%", size: 18, opacity: 0.1 },
  { top: "24%", left: "70%", size: 12, opacity: 0.071 },
  { top: "38%", left: "58%", size: 22, opacity: 0.091 },
  { top: "44%", left: "88%", size: 14, opacity: 0.08 },
  { top: "41%", left: "16%", size: 10, opacity: 0.06 },
  { top: "52%", left: "2%", size: 20, opacity: 0.111 },
  { top: "49%", left: "97%", size: 24, opacity: 0.12 },
  // lower field — densest, echoing the reference
  { top: "63%", left: "7%", size: 24, opacity: 0.14 },
  { top: "68%", left: "35%", size: 16, opacity: 0.1 },
  { top: "72%", left: "62%", size: 26, opacity: 0.12 },
  { top: "66%", left: "84%", size: 14, opacity: 0.091 },
  { top: "79%", left: "18%", size: 28, opacity: 0.151 },
  { top: "83%", left: "47%", size: 18, opacity: 0.111 },
  { top: "77%", left: "73%", size: 22, opacity: 0.131 },
  { top: "86%", left: "91%", size: 26, opacity: 0.14 },
  { top: "90%", left: "5%", size: 20, opacity: 0.12 },
  { top: "88%", left: "29%", size: 14, opacity: 0.091 },
  { top: "93%", left: "56%", size: 24, opacity: 0.131 },
  { top: "91%", left: "68%", size: 16, opacity: 0.1 },
  { top: "95%", left: "81%", size: 22, opacity: 0.12 },
  { top: "84%", left: "41%", size: 10, opacity: 0.08 },
  { top: "97%", left: "13%", size: 18, opacity: 0.111 },
];

/* Ringed around the chat card. The card itself is opaque, so these sit in the
   margin bands where they actually show rather than spread across the box. */
export const CARD_PIXELS: Pixel[] = [
  { top: "1%", left: "6%", size: 14, opacity: 0.14 },
  { top: "3%", left: "28%", size: 10, opacity: 0.1 },
  { top: "0.5%", left: "52%", size: 18, opacity: 0.16 },
  { top: "2.5%", left: "78%", size: 12, opacity: 0.12 },
  { top: "4%", left: "95%", size: 16, opacity: 0.15 },
  { top: "14%", left: "1%", size: 16, opacity: 0.15 },
  { top: "27%", left: "4%", size: 10, opacity: 0.1 },
  { top: "41%", left: "0.5%", size: 20, opacity: 0.18 },
  { top: "56%", left: "3%", size: 12, opacity: 0.11 },
  { top: "71%", left: "1%", size: 16, opacity: 0.14 },
  { top: "85%", left: "4.5%", size: 10, opacity: 0.1 },
  { top: "12%", left: "96%", size: 12, opacity: 0.12 },
  { top: "25%", left: "93%", size: 18, opacity: 0.16 },
  { top: "39%", left: "97%", size: 10, opacity: 0.1 },
  { top: "53%", left: "94%", size: 16, opacity: 0.15 },
  { top: "68%", left: "96.5%", size: 12, opacity: 0.12 },
  { top: "82%", left: "93.5%", size: 20, opacity: 0.17 },
  { top: "96%", left: "10%", size: 14, opacity: 0.13 },
  { top: "98%", left: "34%", size: 10, opacity: 0.1 },
  { top: "95%", left: "60%", size: 18, opacity: 0.16 },
  { top: "97.5%", left: "84%", size: 12, opacity: 0.12 },
];

/* Clustered around the hero's call to action. The field behind the whole hero
   thins out around the text column, so these give the CTA its own sparkle
   without dropping squares on top of the form itself — they sit in the band
   outside it. */
export const CTA_PIXELS: Pixel[] = [
  { top: "6%", left: "2%", size: 14, opacity: 0.18 },
  { top: "38%", left: "0.5%", size: 10, opacity: 0.13 },
  { top: "74%", left: "3%", size: 16, opacity: 0.16 },
  { top: "12%", left: "97%", size: 12, opacity: 0.15 },
  { top: "52%", left: "94%", size: 18, opacity: 0.18 },
  { top: "86%", left: "98%", size: 10, opacity: 0.12 },
  { top: "2%", left: "44%", size: 10, opacity: 0.12 },
  { top: "95%", left: "62%", size: 14, opacity: 0.15 },
  { top: "92%", left: "24%", size: 10, opacity: 0.11 },
];

export function PixelField({ pixels = PIXELS, seed = 0 }: { pixels?: Pixel[]; seed?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pixels.map((p, i) => (
        <span
          key={i}
          className="absolute animate-pixel-blink bg-white"
          style={
            {
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              // Base value for the first paint, before the animation applies.
              // The keyframes take over from here.
              opacity: p.opacity,
              "--pixel-opacity": p.opacity,
              // Derived from the index so every square drifts on its own cycle
              // while staying identical between server and client renders. The
              // seed keeps the two fields from blinking in lockstep.
              "--pixel-delay": `${(((i + seed) * 0.83) % 5).toFixed(2)}s`,
              "--pixel-duration": `${(3.6 + ((i + seed) % 5) * 0.7).toFixed(1)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * The site's favicon, shown in place of the leading icon once the visitor has
 * typed something that looks like a domain.
 *
 * Uses DuckDuckGo's icon service rather than our own server: this fires while
 * the visitor types, on an unauthenticated page, so a server round trip (or a
 * Firecrawl scrape) would be far too slow and expensive per keystroke — and
 * would mean opening a public scrape endpoint. Note the service returns a
 * generic icon for unknown domains, so this is decoration, not validation.
 */
function SiteIcon({ url }: { url: string }) {
  const [host, setHost] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  // Debounced so we resolve once the visitor pauses, not on every keystroke.
  useEffect(() => {
    const next = hostnameFrom(url);
    if (!next) {
      setHost(null);
      return;
    }
    const id = window.setTimeout(() => {
      setHost(next);
      setFailed(false);
    }, 400);
    return () => window.clearTimeout(id);
  }, [url]);

  const src = host ? brandIconUrl(host) : null;
  if (!src || failed) {
    return <Sparkles className="h-4 w-4 shrink-0 text-muted-foreground" />;
  }
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      width={16}
      height={16}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-4 w-4 shrink-0 rounded-[3px] object-contain"
    />
  );
}

export function UrlForm({
  url,
  onChange,
  variant = "card",
}: {
  url: string;
  onChange: (v: string) => void;
  /**
   * `card` (default): the field and button share one raised card.
   * `split`: the landing hero's flat pair, a hairline field beside a solid
   * button of the same height, stacking on narrow screens.
   */
  variant?: "card" | "split";
}) {
  const go = () => {
    const trimmed = url.trim();
    // Persist before navigating: this is a full page load, and OAuth adds a
    // third-party round trip, so the query string alone will not survive.
    if (trimmed) setPendingSiteUrl(trimmed);
    const q = trimmed ? `?url=${encodeURIComponent(trimmed)}` : "";
    window.location.href = `/auth${q}`;
  };
  if (variant === "split") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
        className="group flex w-full flex-col gap-2.5 sm:flex-row"
      >
        <label className="flex h-12 min-w-0 shrink-0 cursor-text items-center gap-2.5 rounded-lg border border-ink/[0.1] bg-white px-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-ink/[0.16] focus-within:border-cta/50 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_12%,transparent)] sm:flex-1">
          <SiteIcon url={url} />
          <input
            type="text"
            inputMode="url"
            autoComplete="url"
            value={url}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Your website URL"
            className="w-full text-ellipsis bg-transparent text-[0.95rem] text-ink outline-none placeholder:text-muted-foreground"
            aria-label="Your website URL"
          />
        </label>
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-cta px-6 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25 sm:w-[13.5rem]"
        >
          Get Started Free
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-focus-within:translate-x-0.5 group-hover:translate-x-0.5" />
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className="group flex w-full max-w-xl flex-row items-center gap-2 rounded-xl border border-border bg-card p-1.5 shadow-elevation transition-all focus-within:shadow-elevation-lg"
    >
      {/* min-w-0 lets the field shrink instead of pushing the button out of the
          card on a narrow phone. */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5 pl-2.5 pr-1 sm:pl-3.5 sm:pr-2">
        <SiteIcon url={url} />
        <input
          type="text"
          inputMode="url"
          autoComplete="url"
          value={url}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your website URL"
          className="w-full text-ellipsis bg-transparent py-3 text-sm text-ink outline-none placeholder:text-sm placeholder:text-muted-foreground"
          aria-label="Your website URL"
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-cta px-4 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-md active:translate-y-0 sm:px-6"
      >
        {/* "Free" and the arrow are dropped on the narrowest phones so the
            button keeps its place on the row and the field keeps room to read. */}
        <span className="max-[420px]:hidden">Get Started Free</span>
        <span className="hidden max-[420px]:inline">Get Started</span>
        <ArrowRight className="h-4 w-4 transition-transform group-focus-within:translate-x-0.5 max-[420px]:hidden" />
      </button>
    </form>
  );
}

export function TrustRow() {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      {/* The same five customer logos as the band below the hero, overlapped.
          The blue ring is the hero's own field, so the tiles read as a stack
          rather than a row of loose squares. */}
      <div className="flex -space-x-2">
        {BRANDS.map((brand) => (
          <BrandTile key={brand.name} brand={brand} className="h-9 w-9 ring-2 ring-brand-blue" />
        ))}
      </div>
      <div className="flex flex-col items-center sm:items-start">
        <Stars />
        <p className="text-sm text-white/75">
          <span className="font-semibold text-white">400+</span> founders growing with Rankbox
        </p>
      </div>
    </div>
  );
}

/* The landing hero, after Rankaria: white, framed between hairline rails
   that run down from the navbar, the copy centred over a dithered Rankbox
   mark, and a proof band closing the frame. */
const RAIL = "border-ink/[0.07]";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

export function Hero() {
  const [url, setUrl] = useState("");

  return (
    <section id="top" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", RAIL)}>
        {/* Faded toward the edges, so the mark sits behind the copy and the
            rails stay clean. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.42] [mask-image:radial-gradient(ellipse_66%_82%_at_50%_50%,#000_50%,transparent_100%)]"
        >
          <MarkDither />
        </div>

        <div className="relative flex flex-col items-center px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-20 sm:pt-20 lg:pb-[5.5rem] lg:pt-24">
          <h1 className="font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink min-[400px]:text-[2.6rem] sm:text-[3.5rem] lg:text-[4.15rem]">
            {/* The full sentence for crawlers and screen readers; the visual
                line below swaps the engine names for the rolling reel. */}
            <span className="sr-only">
              Get AI Traffic from ChatGPT, Claude, Gemini and other AI on Autopilot
            </span>
            <span aria-hidden className="block motion-safe:animate-hero-rise" style={rise(0.05)}>
              Get ai traffic from
            </span>
            <span
              aria-hidden
              className="mt-[0.04em] flex flex-wrap items-center justify-center gap-x-[0.25em] motion-safe:animate-hero-rise"
              style={rise(0.14)}
            >
              <EngineTicker />
              <span>on autopilot</span>
            </span>
          </h1>

          <p
            className="mt-6 max-w-[41rem] text-balance text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.15rem]"
            style={rise(0.24)}
          >
            Publishes daily articles engineered to get your brand cited when buyers ask ChatGPT,
            Claude, Perplexity, and Google AI Overviews — fully on autopilot.
          </p>

          <div
            className="mt-9 w-full max-w-[37rem] motion-safe:animate-hero-rise"
            style={rise(0.34)}
          >
            <UrlForm url={url} onChange={setUrl} variant="split" />
            <p className="mt-3.5 text-[0.82rem] text-muted-foreground">
              No credit card required · Free 7-day trial
            </p>
          </div>
        </div>
      </div>

      <HeroProofBand className="motion-safe:animate-hero-rise" style={rise(0.44)} />
    </section>
  );
}
