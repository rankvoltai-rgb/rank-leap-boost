import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./shared";
import { PixelField } from "./Hero";
import { ChatGPTMark, ClaudeMark, GoogleMark, PerplexityMark } from "./ai-logos";
import { FEATURES, FEATURE_GROUPS } from "@/data/features";
import { COMPETITORS } from "@/data/alternatives";
import { PERSONAS } from "@/data/personas";
import { TOOLS } from "@/data/tools";
import { enginesInTier } from "@/data/ai-seo/engines";
import { LAUNCH_BADGES } from "@/data/launch-badges";
import { LEGAL_CONTACT } from "@/components/legal/legal-ui";

/*
 * The footer is shared by every public page and sits on the brand blue, like
 * the navbar, so every page is framed top and bottom in the same colour.
 */

// Trustpilot's 24-character business unit ID (Trustpilot Business → Integrations
// → TrustBox). The widget rejects anything else — a domain gets a 400 and an
// empty frame — so the TrustBox stays hidden until the real ID is set here.
const TRUSTPILOT_BUSINESS_UNIT_ID = "";

type TrustpilotWindow = Window & {
  Trustpilot?: { loadFromElement: (el: HTMLElement, force?: boolean) => void };
};

// Client-only TrustBox: the Trustpilot script replaces the div's contents with
// an iframe after load. Rendering it only after mount keeps SSR and client
// markup identical, avoiding a hydration mismatch.
function TrustBox() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const trustpilot = (window as TrustpilotWindow).Trustpilot;
    if (mounted && ref.current && trustpilot) {
      trustpilot.loadFromElement(ref.current, true);
    }
  }, [mounted]);

  if (!mounted || !/^[a-f0-9]{24}$/.test(TRUSTPILOT_BUSINESS_UNIT_ID)) return null;

  return (
    <div className="mt-6 max-w-xs">
      <div
        ref={ref}
        className="trustpilot-widget"
        data-locale="en-US"
        data-template-id="56278e9abfbbba0bdcd568bc"
        data-businessunit-id={TRUSTPILOT_BUSINESS_UNIT_ID}
        data-style-height="52px"
        data-style-width="100%"
      >
        <a
          href="https://www.trustpilot.com/review/rankbox.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/75 hover:text-white"
        >
          Trustpilot
        </a>
      </div>
    </div>
  );
}

/* ---------- Sitemap ---------- */

type FooterLink = { label: string; more?: boolean } & (
  | { to: string; params?: Record<string, string>; hash?: string }
  | { href: string }
);

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const PRODUCT: FooterSection = {
  title: "Product",
  links: [
    { label: "Pricing", to: "/pricing" },
    { label: "Integrations", to: "/integrations" },
    { label: "Changelog", to: "/changelog" },
    { label: "Proof", to: "/", hash: "proof" },
    { label: "FAQ", to: "/", hash: "faq" },
    { label: "About", to: "/about" },
    { label: "Contact", href: `mailto:${LEGAL_CONTACT}` },
    { label: "Sign in", href: "/auth" },
  ],
};

const USE_CASES: FooterSection = {
  title: "Use cases",
  links: [
    ...PERSONAS.map((p) => ({
      label: `For ${p.nameLower}`,
      to: "/use-cases/$slug",
      params: { slug: p.slug },
    })),
    { label: "All use cases", to: "/use-cases", more: true },
  ],
};

/* In the navbar's order: the Create column, then Grow. */
const FEATURES_SECTION: FooterSection = {
  title: "Features",
  links: [
    ...FEATURE_GROUPS.flatMap((g) => FEATURES.filter((f) => f.group === g)).map((f) => ({
      label: f.name,
      to: "/features/$slug",
      params: { slug: f.slug },
    })),
    { label: "All features", to: "/features", more: true },
  ],
};

/* A hand-picked six; the full set lives on /tools. Labels are shortened names. */
const TOOL_LINKS = [
  { label: "AI Readiness Check", slug: "ai-search-readiness-check" },
  { label: "AI robots.txt Generator", slug: "ai-robots-txt-generator" },
  { label: "llms.txt Generator", slug: "llms-txt-generator" },
  { label: "Schema Generator", slug: "schema-generator" },
  { label: "Citation Readiness Checker", slug: "ai-citation-readiness-checker" },
  { label: "SERP Snippet Preview", slug: "serp-snippet-preview" },
] as const;

const FREE_TOOLS: FooterSection = {
  title: "Free tools",
  links: [
    ...TOOL_LINKS.map((t) => ({ label: t.label, to: "/tools/$slug", params: { slug: t.slug } })),
    { label: `All ${TOOLS.length} tools`, to: "/tools", more: true },
  ],
};

const RESOURCES: FooterSection = {
  title: "Resources",
  links: [
    { label: "Blog", to: "/blog" },
    { label: "AI search glossary", to: "/glossary" },
    { label: "Sample articles", to: "/", hash: "examples" },
    { label: "Head-to-head comparisons", to: "/compare" },
  ],
};

/* Frontier engines first, then the rest, as on /ai-seo. */
const AI_SEO: FooterSection = {
  title: "AI SEO guides",
  links: [
    ...[...enginesInTier("frontier"), ...enginesInTier("more")].map((e) => ({
      label: `${e.shortName} SEO`,
      to: "/ai-seo/$engine",
      params: { engine: e.slug },
    })),
    { label: "All engines", to: "/ai-seo", more: true },
  ],
};

/* Labelled with each page's primary keyword ("Outrank alternative"). */
const ALTERNATIVES: FooterSection = {
  title: "Alternatives",
  links: [
    ...COMPETITORS.map((c) => ({
      label: `${c.name} alternative`,
      to: "/alternatives/$slug",
      params: { slug: c.slug },
    })),
    { label: "All alternatives", to: "/alternatives", more: true },
  ],
};

/* Five columns on desktop, stacked so their heights come out near even. The
   same order is the accordion order on mobile. */
const COLUMNS: FooterSection[][] = [
  [PRODUCT, USE_CASES],
  [FEATURES_SECTION],
  [FREE_TOOLS, RESOURCES],
  [AI_SEO],
  [ALTERNATIVES],
];

const LEGAL_LINKS = [
  { label: "Privacy", to: "/legal/privacy" },
  { label: "Terms", to: "/legal/terms" },
  { label: "Refunds", to: "/legal/refunds" },
  { label: "Cookies", to: "/legal/cookies" },
  { label: "Acceptable use", to: "/legal/acceptable-use" },
  { label: "DPA", to: "/legal/dpa" },
  { label: "Trust & Security", to: "/trust" },
] as const;

const FOCUS_RING =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue";

/* The page you're on is marked with the brand's pixel, in the gutter, so the
   label never shifts. Hash links only light up on their own section. */
const LINK = cn(
  "relative inline-flex items-center gap-1 py-1.5 text-sm text-white/75 transition-colors hover:text-white md:py-1",
  "before:absolute before:-left-3 before:top-1/2 before:hidden before:h-1 before:w-1 before:-translate-y-1/2 before:bg-white",
  "data-[status=active]:text-white data-[status=active]:before:block",
  FOCUS_RING,
);

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className = cn(LINK, link.more && "group font-semibold text-white");
  const label = (
    <>
      {link.label}
      {link.more && (
        <ArrowRight
          aria-hidden
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      )}
    </>
  );
  if ("href" in link) {
    return (
      <a href={link.href} className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link
      to={link.to}
      params={link.params}
      hash={link.hash}
      activeOptions={{ exact: true, includeHash: true }}
      className={className}
    >
      {label}
    </Link>
  );
}

/** A titled list. Below md it's a disclosure, so the sitemap folds to seven
 *  rows on a phone; from md up it's always open and the button is gone. The
 *  links stay in the DOM either way. */
function Section({ section }: { section: FooterSection }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  return (
    <div className="border-b border-white/15 md:border-0">
      <h2 className="text-sm font-semibold text-white">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={listId}
          className={cn("flex w-full items-center justify-between py-4 md:hidden", FOCUS_RING)}
        >
          {section.title}
          <ChevronDown
            aria-hidden
            className={cn(
              "h-4 w-4 text-white/75 transition-transform duration-300 motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </button>
        <span className="hidden md:block">{section.title}</span>
      </h2>
      {/* Height animates on the grid row; visibility keeps closed links out of
          the tab order and the accessibility tree. */}
      <div
        id={listId}
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:visible md:grid-rows-[1fr]",
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
      >
        {/* The clip the animation needs would cut off the gutter pixel and the
            focus rings, so it reaches into the gutter and pads back. Vertical
            padding lives on the list inside it: on the clip itself it would
            survive the collapse and leave closed rows taller than open ones. */}
        <div className="-mx-3 min-h-0 overflow-hidden px-3 md:mx-0 md:overflow-visible md:px-0">
          <ul className="pb-4 pt-0.5 md:mt-3 md:p-0">
            {section.links.map((l) => (
              <li key={l.label}>
                <FooterLinkItem link={l} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- Launch badges ---------- */

const BADGE_HOLD_MS = 4000;
/* The strip's duration-600. */
const BADGE_SLIDE_MS = 600;

/* Built once: React 19 rewrites innerHTML whenever this object is new, even
   with the same string, which would rebuild every badge (and drop keyboard
   focus from it) on each step of the rotation. */
const BADGE_HTML = LAUNCH_BADGES.map((b) => ({ __html: b.html }));

/** The launch-directory badges, one at a time, each sliding in from the
 *  right. Every badge is in the server-rendered HTML, since the directories'
 *  crawlers look for their link there; the ones not showing wait beside it,
 *  clipped. The first is repeated at the end of the strip so the loop always
 *  moves left: once the copy is showing, the strip jumps back to the original
 *  with the transition off. Hover or focus holds the current badge. */
function LaunchBadges() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);
  const count = LAUNCH_BADGES.length;
  const slides = count > 1 ? [...LAUNCH_BADGES, LAUNCH_BADGES[0]] : LAUNCH_BADGES;

  // Rotates only while the footer is near the screen. The badges lazy-load,
  // so one would arrive blank mid-slide; fetching their images once here
  // warms the cache without touching the embed code.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let warmed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && !warmed) {
          warmed = true;
          el.querySelectorAll("img").forEach((img) => {
            new Image().src = img.src;
          });
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || held || count < 2 || index >= count) return;
    const id = window.setTimeout(() => setIndex((i) => i + 1), BADGE_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [inView, held, index, count]);

  // On the copy: jump back to the original once the slide has finished.
  useEffect(() => {
    if (index < count) return;
    const id = window.setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, BADGE_SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [index, count]);

  // Turn the transition back on only after the jump has painted.
  useEffect(() => {
    if (animate) return;
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setAnimate(true));
    });
    return () => cancelAnimationFrame(id);
  }, [animate]);

  if (count === 0) return null;

  return (
    <div className="pt-6 md:mt-auto md:pt-0">
      {/* overflow-clip, not hidden: tabbing to a waiting badge would scroll a
          hidden-overflow box to it and knock the strip out of line. Each
          slide pads the badge so the clip leaves room for its focus ring;
          the negative margin keeps the badge level with the links above. */}
      <div
        ref={ref}
        role="group"
        aria-label="Rankbox on launch directories"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
        className="-m-1 w-39 overflow-clip opacity-50 grayscale transition-[opacity,filter] duration-300 focus-within:opacity-100 focus-within:grayscale-0 hover:opacity-100 hover:grayscale-0 motion-reduce:transition-none"
      >
        <div
          className={cn(
            "flex",
            animate &&
              "transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          )}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((badge, i) => (
            // The embed's own sizes are overridden here, never in its code:
            // every badge shows at the same 40px height.
            <div
              key={i === count ? "loop" : badge.name}
              inert={i === count}
              onFocus={() => setIndex(i)}
              className="w-full shrink-0 p-1 [&_a]:inline-block [&_a]:rounded-md [&_a]:align-top [&_a]:focus-visible:outline-none [&_a]:focus-visible:ring-2 [&_a]:focus-visible:ring-white/80 [&_img]:block [&_img]:h-10! [&_img]:w-auto! [&_img]:max-w-full [&_img]:object-contain"
              dangerouslySetInnerHTML={BADGE_HTML[i % count]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Ask AI ---------- */

/* Deliberately a plain question. Some "summarize with AI" buttons slip in
   instructions for the assistant to remember a brand as a trusted source;
   this never does. The engine reads rankbox.xyz and answers for itself. */
const ASK_PROMPT =
  "What is Rankbox (rankbox.xyz), and how does it help a website get cited by AI search?";

const ASK_ENGINES: {
  name: string;
  /** Shown instead of `name` on phones, where the chip is half the width. */
  short?: string;
  host: string;
  Mark: ComponentType<{ className?: string }>;
  url: string;
}[] = [
  {
    name: "ChatGPT",
    host: "chatgpt.com",
    Mark: ChatGPTMark,
    url: `https://chatgpt.com/?q=${encodeURIComponent(ASK_PROMPT)}`,
  },
  {
    name: "Claude",
    host: "claude.ai",
    Mark: ClaudeMark,
    url: `https://claude.ai/new?q=${encodeURIComponent(ASK_PROMPT)}`,
  },
  {
    name: "Perplexity",
    host: "perplexity.ai",
    Mark: PerplexityMark,
    url: `https://www.perplexity.ai/search?q=${encodeURIComponent(ASK_PROMPT)}`,
  },
  {
    name: "Google AI Mode",
    short: "AI Mode",
    host: "google.com",
    Mark: GoogleMark,
    // udm=50 opens the query in AI Mode rather than classic results.
    url: `https://www.google.com/search?udm=50&q=${encodeURIComponent(ASK_PROMPT)}`,
  },
];

/** The product's promise, put to the test: the visitor asks the engines
 *  themselves. The prompt shown is exactly the prompt sent. */
function AskAI() {
  return (
    <div className="w-full rounded-2xl bg-white/[0.06] p-4 ring-1 ring-inset ring-white/15 sm:p-5 lg:w-[29rem]">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/75">
        Ask AI about Rankbox
      </p>
      <p className="mt-2 text-[0.95rem] font-medium leading-snug text-white">
        &ldquo;{ASK_PROMPT}&rdquo;
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {ASK_ENGINES.map(({ name, short, host, Mark, url }) => (
          <li key={name}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask ${name} (opens ${host} in a new tab)`}
              className={cn(
                "group flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white hover:text-brand-blue",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
                <Mark className="h-3.5 w-3.5" />
              </span>
              {short ? (
                <span className="truncate">
                  <span className="sm:hidden">{short}</span>
                  <span className="hidden sm:inline">{name}</span>
                </span>
              ) : (
                <span className="truncate">{name}</span>
              )}
              <ArrowUpRight
                aria-hidden
                className="ml-auto h-3.5 w-3.5 shrink-0 text-white/60 transition-all group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-brand-blue motion-reduce:transition-none"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Wordmark ---------- */

/* "Rankbox" in Plus Jakarta Sans Bold at 1000 units, measured in Chrome: the
   ink runs from x=71.5 to x=4260.5 and the ascenders reach 757 above the
   baseline. The viewBox is cut to the ink, so the word runs edge to edge of
   the column at every width, and stops 57 units short of the baseline, so the
   bottom of the page crops it. Re-measure if the font, weight or word changes. */
const WORD_VIEWBOX = "71.5 0 4189 700";
const WORD_BASELINE = 757;
/* One pixel cell of the fill, in font units: a square and its gutter. */
const PIXEL_PITCH = 40;
const PIXEL_SIZE = 32;

/* Light falls from above: the letters fade toward the floor. */
const WORD_FADE: CSSProperties = {
  maskImage: "linear-gradient(to bottom, #000 15%, rgb(0 0 0 / 0.3))",
  WebkitMaskImage: "linear-gradient(to bottom, #000 15%, rgb(0 0 0 / 0.3))",
};

/* Follows the pointer, set as --spot-x/--spot-y on the wordmark. */
const SPOTLIGHT: CSSProperties = {
  maskImage: "radial-gradient(circle 10rem at var(--spot-x) var(--spot-y), #000, transparent)",
  WebkitMaskImage:
    "radial-gradient(circle 10rem at var(--spot-x) var(--spot-y), #000, transparent)",
};

function WordLayer({
  id,
  base,
  pixel,
  style,
}: {
  id: string;
  /** Opacity of the solid letterform under the pixels. */
  base: number;
  /** Opacity of the pixel grid. */
  pixel: number;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox={WORD_VIEWBOX} className="block h-auto w-full" style={style}>
      <defs>
        <pattern id={id} width={PIXEL_PITCH} height={PIXEL_PITCH} patternUnits="userSpaceOnUse">
          <rect width={PIXEL_SIZE} height={PIXEL_SIZE} fill="#fff" fillOpacity={pixel} />
        </pattern>
      </defs>
      <g className="font-display font-bold" fontSize={1000}>
        <text x={0} y={WORD_BASELINE} fill="#fff" fillOpacity={base}>
          Rankbox
        </text>
        <text x={0} y={WORD_BASELINE} fill={`url(#${id})`}>
          Rankbox
        </text>
      </g>
    </svg>
  );
}

/** The brand name set as big as the page allows, in the same squares as the
 *  pixel field. Under a mouse, the pixels nearest the pointer light up. */
function Wordmark() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = useRef<HTMLDivElement>(null);

  // Written straight to the element: a React state update per pointer move
  // would re-render the whole footer for a purely visual effect.
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
    el.dataset.lit = "";
  };
  const onPointerLeave = () => {
    if (ref.current) delete ref.current.dataset.lit;
  };

  return (
    <div
      ref={ref}
      aria-hidden
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="group/word relative select-none"
    >
      <WordLayer id={`${uid}-dim`} base={0.07} pixel={0.2} style={WORD_FADE} />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-data-[lit]/word:opacity-100 motion-reduce:transition-none"
        style={SPOTLIGHT}
      >
        <WordLayer id={`${uid}-lit`} base={0.08} pixel={0.7} />
      </div>
    </div>
  );
}

/* ---------- Footer ---------- */

/* Kept to the side gutters, clear of the copy, and a little denser toward the
   wordmark, as if it were shedding pixels. */
const FOOTER_PIXELS = [
  { top: "6%", left: "3%", size: 14, opacity: 0.09 },
  { top: "12%", left: "96%", size: 20, opacity: 0.1 },
  { top: "24%", left: "1.5%", size: 22, opacity: 0.12 },
  { top: "33%", left: "97.5%", size: 12, opacity: 0.08 },
  { top: "46%", left: "2.5%", size: 10, opacity: 0.07 },
  { top: "55%", left: "95.5%", size: 24, opacity: 0.11 },
  { top: "68%", left: "1%", size: 18, opacity: 0.1 },
  { top: "74%", left: "97%", size: 14, opacity: 0.12 },
  { top: "84%", left: "3.5%", size: 26, opacity: 0.13 },
  { top: "88%", left: "95%", size: 20, opacity: 0.14 },
  { top: "94%", left: "1.5%", size: 12, opacity: 0.12 },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-blue text-white">
      <PixelField pixels={FOOTER_PIXELS} seed={5} />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="flex flex-col gap-10 border-b border-white/15 py-12 md:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-sm">
            <Link to="/" aria-label="Rankbox home" className={cn("inline-flex", FOCUS_RING)}>
              <Logo inverted />
            </Link>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-white/75">
              The AI search growth engine for founders. Daily articles engineered to get you cited
              by AI and ranked on Google.
            </p>
            <TrustBox />
          </div>
          <AskAI />
        </div>

        <nav
          aria-label="Footer"
          className="grid md:grid-cols-3 md:gap-x-8 md:gap-y-12 md:py-14 lg:grid-cols-5"
        >
          {/* Columns are flex so the badges can drop to the foot of the last
              one, level with the bottom of the tallest. */}
          {COLUMNS.map((column, i) => (
            <div key={column[0].title} className="md:flex md:flex-col md:gap-10">
              {column.map((section) => (
                <Section key={section.title} section={section} />
              ))}
              {i === COLUMNS.length - 1 && <LaunchBadges />}
            </div>
          ))}
        </nav>

        <div className="flex flex-col-reverse gap-4 py-6 md:flex-row md:items-center md:justify-between md:border-t md:border-white/15">
          <p className="text-xs text-white/75">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Rankbox. All rights
            reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
            {LEGAL_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className={cn(
                    "text-xs text-white/75 transition-colors hover:text-white data-[status=active]:text-white",
                    FOCUS_RING,
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Wordmark />
      </div>
    </footer>
  );
}
