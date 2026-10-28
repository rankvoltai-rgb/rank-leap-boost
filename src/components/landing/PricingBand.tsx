/**
 * The landing page's pricing, laid out the way Rankaria lays out its plans: a
 * row of static cards, each with a name, a price, a full-width button, a line
 * of reassurance, then what it includes as icon rows with a title and a
 * one-line detail. Rankaria marks its recommended plan with a blue border and
 * a header strip; here that's Business, in the middle.
 *
 * Beside it sit the two other real ways in: the free tools (no signup) and
 * Studio (extra sites on the same account, shown only while STUDIO.live).
 * Nothing moves. Every price comes from data/pricing, every tool from
 * data/tools, and the Business rows say the same things as INCLUDED, the list
 * <Pricing> shows on other pages, split into a title and a detail.
 */
import type { ComponentType, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  ImageIcon,
  Layers,
  LayoutGrid,
  Link2,
  Palette,
  Receipt,
  Search,
  Send,
  ShieldCheck,
  Tag,
  Users,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { TOOL_ICONS } from "@/components/tools/icons";
import { Stars } from "./shared";
import { BrandTile } from "./used-by";
import { BRANDS } from "@/data/brands";
import { PLAN, STUDIO, TRIAL_CTA, TRIAL_DAYS, formatUsd, priceFor } from "@/data/pricing";
import { TOOLS, getTool } from "@/data/tools";
import { PLATFORMS } from "./Pricing";
import { Accent, Band, LINE, SectionHead, Spacer } from "./frame";

type Icon = ComponentType<{ className?: string }>;

interface Row {
  icon: Icon;
  title: string;
  detail: string;
  /** Rows that are destinations (the free tools) link to that tool. */
  tool?: string;
}

/* ---------- The card every plan shares ---------- */

function Price({ amount, suffix }: { amount: number; suffix: string }) {
  const [whole, cents] = amount.toFixed(2).split(".");
  return (
    <p className="mt-6 flex items-start text-ink">
      <span className="mt-1.5 text-xl font-medium">$</span>
      <span className="font-display text-[3.25rem] font-medium leading-none tracking-[-0.04em] tabular-nums">
        {whole}
        {cents !== "00" && <span className="text-[2rem] tracking-[-0.02em]">.{cents}</span>}
      </span>
      <span className="ml-1.5 self-end pb-1.5 text-sm text-muted-foreground">{suffix}</span>
    </p>
  );
}

function PlanCard({
  featured = false,
  strip,
  icon,
  name,
  tag,
  subtitle,
  price,
  priceNote,
  action,
  reassurance,
  rows,
  className,
}: {
  featured?: boolean;
  strip?: string;
  icon: ReactNode;
  name: string;
  tag?: string;
  subtitle: string;
  price: ReactNode;
  priceNote: ReactNode;
  action: { label: string; href: string };
  reassurance: string;
  rows: Row[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl bg-white",
        featured
          ? "border-[1.5px] border-cta shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-28px_rgba(16,24,40,0.28)]"
          : "border border-ink/[0.09] shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        className,
      )}
    >
      {strip && (
        <p className="bg-cta py-1.5 text-center text-xs font-semibold text-white">{strip}</p>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start gap-3">
          {icon}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[1.35rem] font-medium leading-tight tracking-tight text-ink">
                {name}
              </h3>
              {tag && (
                <span className="rounded-md bg-cta-soft px-2 py-0.5 text-xs font-medium text-cta-hover">
                  {tag}
                </span>
              )}
            </div>
            {/* Two lines' room on every card, so the prices line up. */}
            <p className="mt-0.5 min-h-[2.5rem] text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {price}
        <p className="mt-2 text-sm text-muted-foreground">{priceNote}</p>

        <a
          href={action.href}
          className="group mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="mt-3 text-balance text-center text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="mr-1 inline h-3.5 w-3.5 -translate-y-px align-middle" />
          {reassurance}
        </p>

        <ul className={cn("mt-6 space-y-4 border-t pt-6", LINE)}>
          {rows.map(({ icon: RowIcon, title, detail, tool }) => {
            const body = (
              <>
                <RowIcon className="mt-0.5 h-[1.1rem] w-[1.1rem] shrink-0 text-brand-blue" />
                <div className="min-w-0">
                  <p className="text-[0.92rem] font-medium leading-snug text-ink transition-colors group-hover/row:text-cta">
                    {title}
                  </p>
                  <p className="mt-0.5 text-[0.8rem] leading-snug text-muted-foreground">
                    {detail}
                  </p>
                </div>
              </>
            );
            return (
              <li key={title}>
                {tool ? (
                  <Link
                    to="/tools/$slug"
                    params={{ slug: tool }}
                    className="group/row -m-1.5 flex items-start gap-3 rounded-lg p-1.5 transition-colors hover:bg-ink/[0.03]"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="flex items-start gap-3">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const PlanIcon = ({ icon: I }: { icon: Icon }) => (
  <I className="mt-0.5 h-8 w-8 shrink-0 text-brand-blue" />
);

/* ---------- The three plans ---------- */

const BUSINESS_ROWS: Row[] = [
  {
    icon: CalendarDays,
    title: `${PLAN.articlesPerMonth} articles a month`,
    detail: "A new article researched, written and published every day",
  },
  { icon: Search, title: "Answer-space research plan", detail: "Tailored to your buyers" },
  { icon: FileText, title: "2,500+ word articles", detail: "Source-backed" },
  { icon: Send, title: "Auto-published", detail: "To your website" },
  { icon: ImageIcon, title: "Images, links and promotion", detail: "Handled for you" },
  {
    icon: Link2,
    title: `${PLAN.backlinkCreditsPerMonth} backlink credits`,
    detail: "From your first paid month",
  },
  { icon: Users, title: "Unlimited rewrites", detail: "And team members" },
];

/* The free tools that make a site readable by AI, in the order the toolkit
   walks them. Names and taglines are the tools' own. */
const FREE_TOOL_SLUGS = [
  "ai-search-readiness-check",
  "ai-robots-txt-generator",
  "llms-txt-generator",
  "schema-generator",
  "ai-citation-readiness-checker",
];
const TOOL_ROWS: Row[] = FREE_TOOL_SLUGS.flatMap((slug) => {
  const tool = getTool(slug);
  if (!tool) return [];
  return [{ icon: TOOL_ICONS[tool.icon], title: tool.name, detail: tool.tagline, tool: slug }];
});

const STUDIO_ROWS: Row[] = [
  {
    icon: CalendarDays,
    title: "The full plan for every site",
    detail: `${PLAN.articlesPerMonth} articles a month for each one`,
  },
  {
    icon: Receipt,
    title: "One account, one invoice",
    detail: "Every site on the same subscription",
  },
  { icon: Palette, title: "Its own voice and topic map", detail: "For each brand you run" },
  { icon: Users, title: "Unlimited team members", detail: "No per-seat fee" },
  { icon: LayoutGrid, title: "Switch between sites", detail: "From the dashboard" },
];

/**
 * The plans, side by side: Free tools, Business (featured) and Studio while
 * it's live. Shared by the landing's pricing band and the /pricing page, so
 * the two can never show different plans.
 */
export function PlanCards() {
  const price = priceFor();
  return (
    <div
      className={cn(
        "mx-auto grid max-w-[26rem] items-start gap-5 lg:max-w-none",
        STUDIO.live ? "lg:grid-cols-3" : "lg:max-w-4xl lg:grid-cols-2",
      )}
    >
      <PlanCard
        icon={<PlanIcon icon={Wrench} />}
        name="Free tools"
        subtitle="For Google and AI search"
        price={<Price amount={0} suffix="no signup" />}
        priceNote={`${TOOLS.length} tools, free to use.`}
        action={{ label: `Browse all ${TOOLS.length} tools`, href: "/tools" }}
        reassurance="No signup, no card."
        rows={TOOL_ROWS}
        className="lg:order-none order-2"
      />

      <PlanCard
        featured
        strip={`${TRIAL_DAYS} days free`}
        icon={<Mark className="mt-0.5 h-8 w-8 shrink-0 text-brand-blue" />}
        name={PLAN.name}
        tag={`${PLAN.sites} website`}
        subtitle="Everything Rankbox does, in one plan."
        price={<Price amount={price.perMonth} suffix="/month" />}
        priceNote={
          <>
            Works out to{" "}
            <span className="font-semibold text-ink tabular-nums">
              {formatUsd(price.perArticle)}
            </span>{" "}
            an article, all-in.
          </>
        }
        action={{ label: TRIAL_CTA, href: "/auth" }}
        reassurance={`Card required. ${TRIAL_DAYS} days free, then ${formatUsd(PLAN.monthly)}/month. Cancel anytime.`}
        rows={BUSINESS_ROWS}
        className="order-1 lg:order-none"
      />

      {STUDIO.live && (
        <PlanCard
          icon={<PlanIcon icon={Layers} />}
          name={STUDIO.name}
          subtitle="For agencies and founders running several brands"
          price={<Price amount={STUDIO.monthlyPerSite} suffix="/extra site a month" />}
          priceNote={`Your plan covers your first site. Every other site is ${formatUsd(STUDIO.monthlyPerSite)} a month, on the same invoice.`}
          action={{ label: TRIAL_CTA, href: "/auth" }}
          reassurance="Add sites from your dashboard once your plan is active."
          rows={STUDIO_ROWS}
          className="order-3 lg:order-none"
        />
      )}
    </div>
  );
}

export function PricingBand() {
  return (
    <section id="pricing" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Tag}
        eyebrow="Simple pricing"
        title={
          <>
            One plan, <Accent>your whole growth loop</Accent>
          </>
        }
        subtitle="Research, a new article every day, auto-publishing and authority backlinks, for less than you'd pay for a single freelance article."
      />

      <Band inner="px-5 py-14 sm:px-8 sm:py-16">
        <PlanCards />
      </Band>

      {/* Proof: where the articles are built to rank, and who's using it. */}
      <Band>
        <div className="grid items-center md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:gap-5 sm:px-8">
            <span className="shrink-0 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground/85">
              Optimized for
            </span>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {PLATFORMS.map(({ name, Mark: PlatformMark }) => (
                <li
                  key={name}
                  className="group/p flex items-center gap-1.5 text-[0.85rem] font-medium text-ink/60 transition-colors hover:text-ink"
                >
                  <PlatformMark className="h-4 w-4 opacity-70 grayscale transition-[filter,opacity] group-hover/p:opacity-100 group-hover/p:grayscale-0" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div
            className={cn(
              "flex items-center gap-3 border-t px-6 py-5 sm:px-8 md:border-l md:border-t-0",
              LINE,
            )}
          >
            <div className="flex -space-x-2">
              {BRANDS.map((brand) => (
                <BrandTile
                  key={brand.name}
                  brand={brand}
                  label={null}
                  className="h-8 w-8 ring-2 ring-white"
                />
              ))}
            </div>
            <div>
              <Stars className="[&_svg]:h-3.5 [&_svg]:w-3.5" />
              <p className="text-[0.8rem] text-muted-foreground">
                <span className="font-semibold text-ink">400+</span> brands growing with Rankbox
              </p>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}
