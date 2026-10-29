import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ANATOMY, type BlockKind } from "./content";
import { MoreLinks } from "./MoreLinks";
import { SectionShell } from "./SectionShell";

/** A grey text line in the skeleton. */
function Line({
  w,
  strong = false,
  tint = false,
}: {
  w: string;
  strong?: boolean;
  tint?: boolean;
}) {
  return (
    <span
      className={cn(
        "block rounded-full",
        strong ? "h-2.5 bg-ink/[0.16]" : "h-1.5 bg-ink/[0.08]",
        tint && "bg-brand-blue/25",
      )}
      style={{ width: w }}
    />
  );
}

function Bullets({ n, box = false }: { n: number; box?: boolean }) {
  return (
    <span
      className={cn(
        "grid gap-1.5",
        box && "rounded-lg border border-ink/[0.08] bg-surface/70 p-2.5",
      )}
    >
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="h-1 w-1 shrink-0 rounded-full bg-ink/25" />
          <Line w={`${68 - ((i * 13) % 30)}%`} />
        </span>
      ))}
    </span>
  );
}

/** The drawn block for one part of the article. */
function Block({ kind }: { kind: BlockKind }) {
  switch (kind) {
    case "meta":
      return (
        <span className="grid gap-1.5 rounded-lg border border-dashed border-ink/[0.14] p-2.5">
          <Line w="38%" />
          <Line w="92%" />
          <Line w="70%" />
        </span>
      );
    case "title":
      return (
        <span className="grid gap-2 pt-1">
          <span className="block h-3.5 w-[82%] rounded-full bg-ink/[0.22]" />
          <span className="block h-3.5 w-[46%] rounded-full bg-ink/[0.22]" />
        </span>
      );
    case "intro":
      return (
        <span className="grid gap-1.5">
          <span className="grid gap-1.5 rounded-md bg-cta-soft px-2 py-2">
            <Line w="96%" tint />
            <Line w="88%" tint />
          </span>
          <Line w="94%" />
          <Line w="90%" />
          <Line w="62%" />
        </span>
      );
    case "video":
      return (
        <span className="flex aspect-[16/7] items-center justify-center rounded-lg bg-ink/[0.06]">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
            <Play aria-hidden className="h-3 w-3 translate-x-px text-ink/50" fill="currentColor" />
          </span>
        </span>
      );
    case "sections":
      return (
        <span className="grid gap-1.5">
          <Line w="54%" strong />
          <Line w="96%" />
          <Line w="92%" />
          <Line w="84%" />
          <span className="mt-1.5 block">
            <Line w="38%" strong />
          </span>
          <Line w="94%" />
          <Line w="70%" />
        </span>
      );
    case "list":
      return <Bullets n={4} />;
    case "takeaways":
      return <Bullets n={5} box />;
    case "conclusion":
      return (
        <span className="grid gap-1.5">
          <Line w="96%" />
          <Line w="90%" />
          <Line w="58%" />
        </span>
      );
    case "faq":
      return (
        <span className="grid gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-[0.65rem] font-semibold leading-none text-ink/35">?</span>
              <Line w={`${64 - i * 6}%`} strong={false} />
            </span>
          ))}
        </span>
      );
    case "refs":
      return (
        <span className="grid gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="flex items-center gap-2">
              <span className="font-mono text-[0.6rem] leading-none text-ink/35">{n}</span>
              <span
                className="block h-1.5 rounded-full bg-brand-blue/20"
                style={{ width: `${56 - n * 5}%` }}
              />
            </span>
          ))}
        </span>
      );
  }
}

/**
 * 03. The spec as a document skeleton. Each part of the article is drawn as
 * grey bars on one continuous page, with its spec beside it from md up (above
 * it on a phone). The opening answer is the only tinted block: it's the
 * passage written to be lifted on its own. Then the three things that change
 * on the way to the client's site.
 */
export function ArticleSpec() {
  return (
    <SectionShell id="anatomy" intro={ANATOMY.intro}>
      <div className="rounded-2xl border border-ink/[0.08] bg-surface/50 p-2 sm:p-3">
        <div className="rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <p className="border-b border-ink/[0.06] px-5 py-2.5 text-right text-[0.7rem] text-muted-foreground">
            {ANATOMY.schematic}
          </p>
          <ol>
            {ANATOMY.blocks.map((b) => (
              <li
                key={b.kind}
                className="grid gap-3 border-b border-ink/[0.05] px-5 py-5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10 md:py-4"
              >
                <div aria-hidden className="order-2 md:order-1 md:py-1">
                  <Block kind={b.kind} />
                </div>
                <div className="order-1 md:order-2 md:border-l md:border-dashed md:border-ink/[0.1] md:pl-6">
                  <p className="text-[0.86rem] font-semibold text-ink">{b.label}</p>
                  <p className="mt-1 text-[0.84rem] leading-relaxed text-muted-foreground">
                    {b.spec}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <h3 className="mt-14 text-[1rem] font-semibold tracking-tight text-ink">
        {ANATOMY.outTitle}
      </h3>
      <ul className="mt-5 grid gap-px overflow-hidden rounded-xl border border-ink/[0.08] bg-ink/[0.07] md:grid-cols-3">
        {ANATOMY.out.map((o) => (
          <li key={o.title} className="bg-white p-5">
            <p className="text-[0.9rem] font-semibold text-ink">{o.title}</p>
            <p className="mt-1.5 text-[0.85rem] leading-relaxed text-muted-foreground">{o.body}</p>
          </li>
        ))}
      </ul>
      <MoreLinks links={ANATOMY.links} />
    </SectionShell>
  );
}
