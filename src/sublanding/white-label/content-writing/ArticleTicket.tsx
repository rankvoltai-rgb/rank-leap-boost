import { Check, FileText } from "lucide-react";
import { TICKET } from "./content";
import { OwnerChip } from "./OwnerChip";

/**
 * The hero's focal visual: one sample client article as a production ticket.
 * Six stations, what each produced for this article, and who did the work;
 * the score in blue as the one number that matters; the client's byline at
 * the end. The next client's ticket peeks out behind it, because the line
 * runs for every client at once.
 *
 * Static on purpose: it's in the server-rendered HTML and on first paint.
 * Fictional client, labelled as a sample.
 */
export function ArticleTicket() {
  const t = TICKET;
  return (
    <figure
      className="relative mx-auto w-full max-w-[30rem]"
      aria-label={`${t.sample}: ${t.title}`}
    >
      {/* The next client's ticket, behind. */}
      <div
        aria-hidden
        className="absolute inset-x-6 -top-6 h-16 rounded-2xl border border-ink/[0.07] bg-white/80 px-5 pt-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
      >
        <span className="text-[0.7rem] font-medium text-muted-foreground/80">{t.next}</span>
      </div>

      <div className="relative rounded-2xl border border-ink/[0.09] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_12px_32px_-12px_rgba(16,24,40,0.14)]">
        {/* Header: the client, then the article. */}
        <div className="flex items-start justify-between gap-3 border-b border-ink/[0.07] px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-surface text-[0.8rem] font-semibold text-ink"
            >
              {t.client.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.9rem] font-semibold text-ink">{t.client}</p>
              <p className="truncate font-mono text-[0.72rem] text-muted-foreground">{t.domain}</p>
            </div>
          </div>
          <span className="shrink-0 rounded-md border border-ink/[0.1] px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground">
            {t.sample}
            <span className="hidden sm:inline"> · {t.sampleNote}</span>
          </span>
        </div>

        <div className="px-5 pt-4">
          <p className="flex items-start gap-2 text-[1rem] font-semibold leading-snug tracking-tight text-ink">
            <FileText aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            {t.title}
          </p>
          <p className="mt-1.5 pl-6 text-[0.75rem] text-muted-foreground">
            {t.keywordLabel}: <span className="font-mono text-ink/70">{t.keyword}</span>
          </p>
        </div>

        {/* The six stations. */}
        <ol className="relative px-5 pb-2 pt-4">
          <span aria-hidden className="absolute bottom-6 left-[1.83rem] top-6 w-px bg-ink/[0.09]" />
          {t.stations.map((s, i) => {
            const isScore = i === 3;
            return (
              <li key={s.name} className="relative flex gap-3 py-2.5">
                <span
                  aria-hidden
                  className="relative z-10 mt-0.5 flex h-[1.1rem] w-[1.1rem] shrink-0 items-center justify-center rounded-full bg-brand-blue text-white"
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <p className="text-[0.84rem] font-medium text-ink">{s.name}</p>
                    <OwnerChip owner={s.owner} />
                  </div>
                  {isScore ? (
                    <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-display text-[1.35rem] font-semibold leading-none tracking-tight text-brand-blue">
                        {t.score}
                      </span>
                      <span className="text-[0.75rem] text-muted-foreground">
                        / 100 {t.scoreLabel}
                      </span>
                      <span className="w-full text-[0.78rem] leading-relaxed text-muted-foreground">
                        {s.out}. {t.openCheck}.
                      </span>
                    </div>
                  ) : (
                    <p className="mt-0.5 text-[0.78rem] leading-relaxed text-muted-foreground">
                      {s.out}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* The end of the line: the client's name. */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-2xl border-t border-ink/[0.07] bg-surface/60 px-5 py-3.5">
          <p className="text-[0.8rem] text-muted-foreground">
            {t.bylineLabel} <span className="font-semibold text-ink">{t.byline}</span>
          </p>
          <p className="text-[0.72rem] text-muted-foreground">{t.bylineNote}</p>
        </div>
      </div>
    </figure>
  );
}
