import { Reveal, SectionHeading, Avatar, Stars, StatCard } from "./shared";
import nikAsset from "@/assets/nik.png.asset.json";
import johnAsset from "@/assets/john-logan.png.asset.json";
import denisAsset from "@/assets/denis.png.asset.json";
import demoAsset from "@/assets/demo.png.asset.json";

const PHOTOS: Record<string, string> = {
  "Nik Zechner": nikAsset.url,
  "John Logan": johnAsset.url,
  "Denis Yurchak": denisAsset.url,
  "Adam Myrick": demoAsset.url,
};

const QUOTES = [
  { q: "This actually works. I'm kind of astounded. About 1 month in, went from a couple hundred impressions a day, to about 3,800 a day - and this is hyper-niche in my industry. Support is super helpful and the founder genuinely cares.", n: "Mark Eckert", r: "Owner", c: "That Pitch" },
  { q: "Rankvolt helped me rank for my main keywords on ChatGPT! Traffic is increasing, and all that with a few clicks. Crazy good!", n: "Nik Zechner", r: "Managing Director", c: "Grauberg" },
  { q: "We've been using Rankvolt at Yadaphone for under a month, and it already helped us fill our website with high-quality content. Now we can reach out to incumbent competitors and have a strong argument to exchange backlinks.", n: "Denis Yurchak", r: "Founder", c: "Yadaphone" },
  { q: "I am amazed at the quality of the articles. Choice and variety of links and images! Rankvolt is very easy to setup and integrates with Shopify like a glove. The keyword research is top shelf.", n: "Ray Joe Freyaldenhoven", r: "President", c: "Journeys of Faith" },
  { q: "I was spending $3,000/month on content writers and $300/month on Ahrefs. Rankvolt replaced both and produces better content. After 3 months, I'm ranking for competitive keywords and getting 5-10 new clients every month.", n: "Elena Kowalski", r: "Marketing Director", c: "" },
  { q: "Rankvolt has been a huge time-saver for our business. We're able to publish high-quality, search-optimized content consistently without having to think about keywords, outlines, or publishing workflows.", n: "Alex Drizen", r: "CEO", c: "Tk Trends" },
  { q: "Love Rankvolt so far! Generating articles has been super easy and compared to paying an agency this saves us so much money. Brought views up by 721.9% over 90 days for a brand new website!", n: "Clive", r: "Founder", c: "TSS" },
  { q: "The difference with Rankvolt is that it really is that easy, and it produces great content. I've already got two other people on board doing it for their businesses.", n: "John Logan", r: "Owner", c: "John Logan Consulting" },
  { q: "Love Rankvolt! Daily content added to my site that has already scaled my visitors to 250 in two weeks.", n: "Adam Myrick", r: "Founder", c: "adamevansco.com" },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Stars className="scale-90" /> Trusted by growing businesses
          </span>
        </div>
        <SectionHeading
          title="Loved by Thousands of Businesses"
          subtitle="See how businesses across e-commerce, SaaS, and agencies are using Rankvolt to grow their organic traffic and get mentioned by AI assistants."
        />

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard value="3,000+" label="Happy customers" />
          <StatCard value="4.9/5" label="Average rating" />
          <StatCard value="721%" label="Peak traffic lift" />
          <StatCard value="1M+" label="Articles published" />
        </div>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {QUOTES.map((t, i) => (
            <Reveal key={t.n} delay={(i % 3) * 0.05}>
              <figure className="break-inside-avoid rounded-2xl border border-border bg-card p-6 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg">
                <Stars className="mb-3" />
                <blockquote className="text-sm leading-relaxed text-ink">"{t.q}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <Avatar name={t.n} src={PHOTOS[t.n]} className="h-10 w-10" />
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
