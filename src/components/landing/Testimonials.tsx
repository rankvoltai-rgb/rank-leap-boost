import { Reveal, SectionHeading, Avatar, Stars } from "./shared";

const QUOTES = [
  { q: "This actually works. I'm kind of astounded. About 1 month in, went from a couple hundred impressions a day, to about 3,800 a day - and this is hyper-niche in my industry. Support is super helpful and the founder genuinely cares.", n: "Mark Eckert", r: "Owner at That Pitch" },
  { q: "RankPill helped me rank for my main keywords on ChatGPT! Traffic is increasing, and all that with a few clicks. Crazy good!", n: "Nik Zechner", r: "Managing Director at Grauberg" },
  { q: "We've been using RankPill at Yadaphone for under a month, and it already helped us fill our website with high-quality content. Now we can reach out to incumbent competitors and have a strong argument to exchange backlinks.", n: "Denis Yurchak", r: "Founder at Yadaphone" },
  { q: "I am amazed at the quality of the articles. Choice and variety of links and images! RankPill is very easy to setup and integrates with Shopify like a glove. The keyword research is top shelf.", n: "Ray Joe Freyaldenhoven", r: "President at Journeys of Faith" },
  { q: "I was spending $3,000/month on content writers and $300/month on Ahrefs. RankPill replaced both and produces better content. After 3 months, I'm ranking for competitive keywords and getting 5-10 new clients every month.", n: "Elena Kowalski", r: "Marketing Director" },
  { q: "RankPill has been a huge time-saver for our business. We're able to publish high-quality, search-optimized content consistently without having to think about keywords, outlines, or publishing workflows.", n: "Alex Drizen", r: "CEO at Tk Trends" },
  { q: "Love RankPill so far! Generating articles has been super easy and compared to paying an agency this saves us so much money. Brought views up by 721.9% over 90 days for a brand new website!", n: "Clive", r: "Founder at TSS" },
  { q: "The difference with RankPill is that it really is that easy, and it produces great content. I've already got two other people on board doing it for their businesses.", n: "John Logan", r: "Owner at John Logan Consulting" },
  { q: "Love RankPill! Daily content added to my site that has already scaled my visitors to 250 in two weeks.", n: "Adam Myrick", r: "adamevansco.com" },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title="Trusted by Thousands of Businesses"
          subtitle="See how businesses across e-commerce, SaaS, and agencies are using RankPill to grow their organic traffic and get mentioned by AI assistants."
        />
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {QUOTES.map((t, i) => (
            <Reveal key={t.n} delay={(i % 3) * 0.05}>
              <figure className="break-inside-avoid rounded-2xl border border-border bg-card p-6">
                <Stars className="mb-3" />
                <blockquote className="text-sm leading-relaxed text-ink">"{t.q}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <Avatar name={t.n} className="h-9 w-9" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.n}</p>
                    <p className="text-xs text-muted-foreground">{t.r}</p>
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