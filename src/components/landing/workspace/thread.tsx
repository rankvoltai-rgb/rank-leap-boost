/**
 * The middle of the window: one run, told the way the reference tells its
 * chat (a request, a "Working" clock, prose that streams in, then a result
 * card), and the bar under it. Rankbox has no chat box, so the request comes
 * from the content plan and the bar is autopilot's status: what's up next,
 * and how many articles are left this cycle.
 *
 * Type follows the reference's scale: 13/18 medium for chrome, 14/22 for
 * prose, 32px controls, 8 and 12px radii, hairline rings instead of borders.
 */
import { memo, useMemo } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN } from "@/data/pricing";
import type { Run, StepState, View } from "./script";

/* ---------- Atoms ---------- */

/** "Working 5s": a light sweeping across muted text. */
function Shimmer({ children }: { children: string }) {
  return (
    <span className="bg-[linear-gradient(90deg,var(--muted-foreground)_0%,var(--muted-foreground)_35%,var(--ink)_50%,var(--muted-foreground)_65%,var(--muted-foreground)_100%)] bg-[length:220%_100%] bg-clip-text text-transparent motion-safe:animate-[workspace-shimmer_1.6s_linear_infinite]">
      {children}
    </span>
  );
}

/**
 * A paragraph that arrives word by word. Every word is in the layout from
 * the start, so nothing below it moves; each one only fades in, and the slow
 * fade against the fast pace gives the soft leading edge.
 */
const Stream = memo(function Stream({ text, shown }: { text: string; shown: number }) {
  const words = useMemo(() => text.split(" "), [text]);
  return (
    <p className="text-[14px] leading-[22px] text-ink">
      {words.map((w, i) => (
        <span
          key={i}
          className={cn(
            "transition-opacity duration-500 ease-out",
            i < shown ? "opacity-100" : "opacity-0",
          )}
        >
          {w}{" "}
        </span>
      ))}
    </p>
  );
});

function StepRow({
  icon: Icon,
  label,
  state,
}: {
  icon: Run["ran"]["icon"];
  label: string;
  state: StepState;
}) {
  return (
    <li
      className={cn(
        "relative flex h-[26px] items-center gap-2 pl-5 text-[13px] leading-[18px] transition-opacity duration-300",
        state === "idle" ? "opacity-0" : "opacity-100",
      )}
    >
      {/* The marker sits on the rail: a spinner while it runs, a dot once done. */}
      <span className="absolute -left-[5.5px] flex h-[11px] w-[11px] items-center justify-center bg-white">
        {state === "active" ? (
          <Loader2
            className="h-[11px] w-[11px] text-ink motion-safe:animate-spin"
            strokeWidth={2.5}
          />
        ) : (
          <span className="h-[5px] w-[5px] rounded-full bg-ink/25" />
        )}
      </span>
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      {state === "active" ? (
        <Shimmer>{label}</Shimmer>
      ) : (
        <span className="text-muted-foreground">{label}</span>
      )}
    </li>
  );
}

/* ---------- The thread ---------- */

export function Thread({ run, view }: { run: Run; view: View }) {
  const RanIcon = run.ran.icon;
  const CardIcon = run.card.icon;
  const stepsStarted = view.steps.some((s) => s !== "idle");
  return (
    <div
      className={cn(
        "flex flex-col transition-opacity duration-500",
        view.leaving ? "opacity-0" : "opacity-100",
      )}
    >
      {/* The request, as the reference shows its prompt: a quiet bubble on the right. */}
      <div className="flex flex-col items-end motion-safe:animate-[workspace-rise_0.5s_cubic-bezier(0.16,1,0.3,1)_both]">
        <span className="mb-1.5 pr-0.5 text-[12px] leading-4 text-muted-foreground">
          {run.source}
        </span>
        <div className="max-w-[88%] rounded-xl bg-ink/[0.045] px-3 py-2.5 text-[14px] leading-5 text-ink">
          {run.request}
        </div>
      </div>

      <div
        className={cn(
          "transition-opacity duration-300",
          "mt-11",
          view.working ? "opacity-100" : "opacity-0",
        )}
      >
        <p className="py-1 text-[13px] font-medium leading-[18px] tabular-nums text-muted-foreground">
          {view.done ? (
            <>Worked for {view.seconds}s</>
          ) : (
            <Shimmer>{`Working ${view.seconds}s`}</Shimmer>
          )}
        </p>

        <div className="mt-2.5 space-y-3.5">
          {run.prose.map((p, i) => (
            <Stream key={i} text={p} shown={view.shown[i]} />
          ))}
        </div>

        {run.steps && (
          <div
            className={cn(
              "mt-4 transition-opacity duration-300",
              stepsStarted ? "opacity-100" : "opacity-0",
            )}
          >
            <p className="text-[13px] font-medium leading-[18px] text-muted-foreground">
              {view.done ? "Ran" : "Running"} {run.steps.length} steps
            </p>
            <ul className="ml-[5px] mt-1.5 border-l border-ink/[0.1]">
              {run.steps.map((s, i) => (
                <StepRow key={s.label} icon={s.icon} label={s.label} state={view.steps[i]} />
              ))}
            </ul>
          </div>
        )}

        <p
          className={cn(
            "mt-[18px] flex items-center gap-1.5 text-[13px] leading-[18px] transition-[opacity,transform] duration-500 ease-out",
            view.ran ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
          )}
        >
          <span className="text-muted-foreground">Ran</span>
          <RanIcon className="h-3.5 w-3.5 text-cta" strokeWidth={2} />
          <span className="font-medium text-cta">{run.ran.label}</span>
        </p>

        <div
          className={cn(
            "mt-3 flex h-[60px] w-full max-w-[400px] items-center gap-3 rounded-xl bg-white pl-3 pr-4 shadow-[0_0_0_1px_rgba(16,24,40,0.08),0_1px_2px_rgba(16,24,40,0.05)] transition-[opacity,transform] duration-500 ease-out",
            view.card ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cta-soft text-cta">
            <CardIcon className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium leading-[18px] text-ink">
              {run.card.title}
            </span>
            <span className="block truncate text-[12px] leading-[18px] text-muted-foreground">
              {run.card.meta}
            </span>
          </span>
          <span
            className={cn(
              "flex h-7 shrink-0 items-center rounded-lg px-2 text-[13px] font-medium leading-[18px] text-ink shadow-[0_0_0_1px_rgba(16,24,40,0.1),0_1px_1px_rgba(16,24,40,0.04)] transition-colors duration-300",
              view.open ? "bg-ink/[0.05]" : "bg-white",
            )}
          >
            Open
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- The bar under it ---------- */

/**
 * Where the reference keeps its input: autopilot's status. The glow along
 * its top edge is lit while a run is working, as theirs is.
 */
export function Composer({ run, view }: { run: Run; view: View }) {
  const busy = view.working && !view.done;
  return (
    <div className="relative">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-10 -top-4 h-8 transition-opacity duration-700",
          busy ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--cta)_34%,transparent),transparent)] blur-md motion-safe:animate-[workspace-glow_2.8s_ease-in-out_infinite]" />
      </div>
      <div className="relative rounded-2xl bg-white p-4 pb-3.5 shadow-[0_0_0_1px_rgba(16,24,40,0.09),0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.28)]">
        {/* The lit hairline on the top edge. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--cta)_30%,#6db7ff_50%,var(--cta)_70%,transparent)] transition-opacity duration-700",
            busy ? "opacity-100" : "opacity-0",
          )}
        />
        <p className="flex min-w-0 items-baseline gap-1.5 text-[14px] leading-5">
          <span className="shrink-0 text-muted-foreground">Up next</span>
          <span className="min-w-0 truncate">
            <span className="text-ink">{run.next.title}</span>
            <span className="text-muted-foreground"> · {run.next.when}</span>
          </span>
        </p>
        <div className="mt-7 flex items-center justify-between gap-3">
          <span className="inline-flex h-7 items-center gap-2 rounded-full pl-1 pr-2.5 text-[13px] font-medium leading-[18px] text-ink shadow-[0_0_0_1px_rgba(16,24,40,0.1)]">
            <span className="flex h-[18px] w-8 items-center rounded-full bg-cta p-0.5">
              <span className="ml-auto h-3.5 w-3.5 rounded-full bg-white shadow-[0_1px_2px_rgba(16,24,40,0.25)]" />
            </span>
            Autopilot
          </span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[12px] leading-[18px] text-muted-foreground">
              <span>
                <span className="font-medium tabular-nums text-ink">{view.quota}</span> of{" "}
                {PLAN.articlesPerMonth} left this cycle
              </span>
            </span>
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300",
                busy ? "bg-cta text-white" : "bg-ink/[0.06] text-ink/40",
              )}
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 motion-safe:animate-spin" strokeWidth={2.5} />
              ) : (
                <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
              )}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
