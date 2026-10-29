import { Fragment } from "react";
import { SIGN_OFF } from "./content";
import { MoreLinks } from "./MoreLinks";
import { SectionShell } from "./SectionShell";

/** A stage on the track: a quiet pill. */
function Stage({ label }: { label: string }) {
  return (
    <span className="relative z-10 rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.8rem] font-medium text-ink/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      {label}
    </span>
  );
}

/** A gate on the track: the blue mark where a client says yes. */
function Gate({ n, label }: { n: string; label: string }) {
  return (
    <span className="relative z-10 flex items-center gap-2 md:block">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cta text-[0.78rem] font-semibold text-white">
        {n}
      </span>
      <span className="text-[0.75rem] font-semibold text-brand-blue md:absolute md:left-1/2 md:top-full md:mt-2 md:-translate-x-1/2 md:whitespace-nowrap">
        {label}
      </span>
    </span>
  );
}

/**
 * 05. The track: plan, gate one, the line's own work, gate two, live. A rail
 * runs behind it, horizontal from md up and vertical on a phone. Under the
 * track, each gate as its own short procedure, steps numbered, with one line
 * on what it costs or what will make it easier.
 */
export function SignOff() {
  const { track, gates } = SIGN_OFF;
  const stages = [track.plan, track.work, track.live];
  return (
    <SectionShell id="sign-off" intro={SIGN_OFF.intro}>
      <div className="rounded-2xl border border-ink/[0.08] bg-surface/50 px-5 py-7 sm:px-8 md:pb-12 md:pt-8">
        <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between md:gap-3">
          <span
            aria-hidden
            className="absolute bottom-3 left-[0.875rem] top-3 w-px bg-ink/[0.12] md:inset-x-6 md:bottom-auto md:left-6 md:top-1/2 md:h-px md:w-auto"
          />
          {stages.map((s, i) => (
            <Fragment key={s}>
              <Stage label={s} />
              {i < gates.length && (
                <Gate n={gates[i].n} label={`${track.gate} ${gates[i].n}: ${gates[i].short}`} />
              )}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {gates.map((g) => (
          <div
            key={g.n}
            className="rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6"
          >
            <h3 className="flex items-center gap-2.5 text-[1rem] font-semibold tracking-tight text-ink">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cta-soft text-[0.75rem] font-semibold text-brand-blue">
                {g.n}
              </span>
              {g.title}
            </h3>
            <ol className="mt-4 grid gap-3">
              {g.steps.map((step, i) => (
                <li key={step} className="flex gap-3 text-[0.88rem] leading-relaxed text-ink/80">
                  <span className="mt-[0.1rem] font-mono text-[0.75rem] text-muted-foreground">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-5 border-t border-ink/[0.07] pt-4 text-[0.8rem] leading-relaxed text-muted-foreground">
              {g.note}
            </p>
          </div>
        ))}
      </div>
      <MoreLinks links={SIGN_OFF.links} />
    </SectionShell>
  );
}
