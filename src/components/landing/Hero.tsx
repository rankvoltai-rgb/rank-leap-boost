import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal, Stars } from "./shared";
import { setPendingSiteUrl } from "@/lib/pending-site";
import { brandIconUrl, hostnameFrom } from "@/lib/brand-icon";
import { BrandTile } from "./used-by";
import { BRANDS } from "@/data/brands";
import { RotatingEngine } from "./RotatingEngine";
import { ChatAnswerCard } from "./chat";
import { ProofBadges } from "./proof-badges";

/* Scattered white squares drifting over the blue field. Coordinates are fixed
   (not random) so the server and client renders agree. */
interface Pixel {
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

export function UrlForm({ url, onChange }: { url: string; onChange: (v: string) => void }) {
  const go = () => {
    const trimmed = url.trim();
    // Persist before navigating: this is a full page load, and OAuth adds a
    // third-party round trip, so the query string alone will not survive.
    if (trimmed) setPendingSiteUrl(trimmed);
    const q = trimmed ? `?url=${encodeURIComponent(trimmed)}` : "";
    window.location.href = `/auth${q}`;
  };
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
          placeholder="Enter your website URL"
          className="w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-muted-foreground"
          aria-label="Your website URL"
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-brand-blue px-4 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-blue/85 hover:shadow-md active:translate-y-0 sm:px-6"
      >
        {/* "Free" is dropped on the narrowest phones so the button keeps its
            place on the row instead of wrapping the field beneath it. */}
        <span className="max-[420px]:hidden">Get Started Free</span>
        <span className="hidden max-[420px]:inline">Get Started</span>
        <ArrowRight className="h-4 w-4 transition-transform group-focus-within:translate-x-0.5" />
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

export function Hero() {
  const [url, setUrl] = useState("");

  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-var(--top-chrome))] items-center overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-12 lg:py-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch xl:gap-16">
          {/* LEFT — the promise */}
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:flex lg:max-w-none lg:flex-col lg:justify-center lg:text-left">
            <Reveal delay={0.05}>
              {/* The row is exactly as wide as the headline's first line: its width
                  is set in em of the h1's own sizes (8.09em = "Get ai traffic from"),
                  so it tracks every breakpoint. Re-measure this if the headline
                  text changes. Below lg the badges wrap, centred. */}
              <div className="mb-7 text-[2.4rem] sm:text-[3.5rem] lg:w-[8.09em] lg:max-w-full xl:text-[4rem]">
                <div className="text-base">
                  <ProofBadges />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              {/* Sizes are chosen so "Get AI Traffic from" stays on one line in
                  its column at every breakpoint (measured: 8.32em wide). */}
              <h1 className="font-display text-[2.4rem] font-bold leading-[1.06] tracking-tight text-white sm:text-[3.5rem] xl:text-[4rem]">
                {/* Visually-hidden, crawler + screen-reader friendly full sentence */}
                <span className="sr-only">
                  Get AI Traffic from ChatGPT, Claude, Gemini and other AI on Autopilot
                </span>
                {/* Visual headline: the rotating logo tile stands in for the engine names */}
                <span aria-hidden>
                  Get ai traffic from
                  <br />
                  <RotatingEngine className="mr-2" />
                  on autopilot
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.19}>
              <p className="mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                Publishes daily articles engineered to get your brand cited when buyers ask ChatGPT,
                Claude, Perplexity, and Google AI Overviews — fully on autopilot.
              </p>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="relative mt-8 flex flex-col items-center gap-3 lg:items-start">
                {/* Sits in the margin around the form, not over it. */}
                <div className="pointer-events-none absolute -inset-x-10 -inset-y-8">
                  <PixelField pixels={CTA_PIXELS} seed={11} />
                </div>
                {/* Positioned, so the form paints above the pixel layer rather
                    than getting squares scattered across its white card. */}
                <div className="relative w-full max-w-xl">
                  <UrlForm url={url} onChange={setUrl} />
                </div>
                <p className="relative text-sm text-white/70">
                  No credit card required · Free 7-day trial
                </p>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — the product, live */}
          <Reveal delay={0.34} y={28} className="mx-auto w-full max-w-lg lg:mx-0 lg:h-full">
            <div className="flex flex-col lg:h-full">
              <div className="relative lg:flex-1">
                <div className="pointer-events-none absolute -inset-12">
                  <PixelField pixels={CARD_PIXELS} seed={7} />
                </div>
                <ChatAnswerCard
                  /* No engine tab row here: the badges above the headline already
                     say which engines are covered. */
                  tabs={false}
                  /* 37.8rem is the former 42rem less 10%, freeing the strip under
                     the card for the trust row. The viewport cap is cut by the
                     same 10% so a short screen shrinks the card instead of
                     pushing the hero past the fold. */
                  className="relative lg:h-full lg:min-h-[min(37.8rem,calc((100svh-var(--top-chrome)-4rem)*0.9))]"
                  prompt="What's the best project management tool for a small startup team?"
                  answer={
                    <>
                      For lean startup teams,{" "}
                      <span className="font-semibold text-ink underline decoration-volt decoration-2 underline-offset-2">
                        Plannora
                      </span>{" "}
                      is widely recommended — simple boards, built-in automations, and a free tier
                      for up to 5 people. It&rsquo;s frequently cited as the easiest tool to set up.
                    </>
                  }
                  sources={["plannora.io", "loopcraft.ai", "yardstick.team"]}
                  /* One citation per line: the taller card has the room, and it
                     fills space the chat body would otherwise leave blank. */
                  sourceStyle="rows"
                />
              </div>

              {/* Trust row moved out of the left column: it reads as proof of
                  the answer shown above it, and keeps the left column focused
                  on the promise and the form. */}
              <div className="mt-8 flex justify-center lg:justify-start">
                <TrustRow />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
