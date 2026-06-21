import { Reveal, Eyebrow, Avatar, Stars, StatCard } from "./shared";
import { AVATARS } from "./avatars";

const QUOTES = [
  { q: "About a month in, a couple of our guides started showing up as the cited source inside ChatGPT answers. We didn't even know that was possible — now it's our most qualified traffic.", n: "Owen Carter", r: "Founder", c: "Briefly", a: AVATARS[0] },
  { q: "Rankvolt got us quoted in Perplexity for our core questions. Steady visibility, real signups, and all of it runs without me touching a thing.", n: "Priya Raman", r: "Growth Lead", c: "Safeguard", a: AVATARS[1] },
  { q: "We filled a thin site with genuinely good, source-backed articles in weeks. The structure is clearly built for how AI models read content — it shows in where we surface.", n: "Aman Desai", r: "Founder", c: "Yardstick", a: AVATARS[2] },
  { q: "Setup took minutes and it plugged into our store cleanly. The answer-space research is the part that surprised me — it finds questions our buyers actually ask AI.", n: "Elise Tanaka", r: "Co-founder", c: "Plannora", a: AVATARS[3] },
  { q: "I was paying a writer and an SEO tool subscription. Rankvolt replaced both, writes better, and I'm finally ranking for terms I'd given up on.", n: "Marco Silva", r: "Marketing Lead", c: "Northwind Labs", a: AVATARS[4] },
  { q: "The consistency is the whole game. A strong article goes live every day without me thinking about outlines, keywords, or publishing. It just compounds.", n: "Hannah Whitfield", r: "Founder", c: "Loopcraft", a: AVATARS[5] },
  { q: "Compared to an agency this is a fraction of the cost and honestly more reliable. Our brand-new site is pulling steady search and AI traffic within months.", n: "Daniel Okafor", r: "Founder", c: "Northlight", a: AVATARS[6] },
  { q: "What sold me is how little effort it takes. It really is this easy, and the content holds up. I've already pointed two other founders to it.", n: "Sofia Marin", r: "Owner", c: "Verdure Goods", a: AVATARS[7] },
  { q: "Daily content has already scaled our visitors meaningfully in just a few weeks — and the citations in AI answers are a bonus I didn't expect.", n: "Lena Brandt", r: "Founder", c: "Claystone", a: AVATARS[1] },
];

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Loved by founders</Eyebrow>
          <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Growth-minded teams, real results
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            See how teams across SaaS, e-commerce, and agencies use Rankvolt to grow organic
            traffic and get their brand cited by AI assistants.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard value="400+" label="Active founders" />
          <StatCard value="4.8/5" label="Average rating" />
          <StatCard value="60K+" label="Articles published" />
          <StatCard value="Daily" label="Auto-published content" />
        </div>

        <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {QUOTES.map((t, i) => (
            <Reveal key={t.n} delay={(i % 3) * 0.05}>
              <figure className="break-inside-avoid rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elevation-lg">
                <Stars className="mb-3" />
                <blockquote className="text-[0.95rem] leading-relaxed text-ink">"{t.q}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <Avatar name={t.n} src={t.a} className="h-10 w-10" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.n}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.r}{t.c ? ` · ${t.c}` : ""}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
