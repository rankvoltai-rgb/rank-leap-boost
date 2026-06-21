import { ArrowRight } from "lucide-react";
import { Reveal } from "./shared";
import { ChatAnswerCard } from "./chat";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-ink px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-gridlines opacity-[0.07]" />
            <div className="relative">
              <h2 className="font-display mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-background sm:text-4xl">
                Become the answer AI recommends
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-base text-background/70">
                Put your growth on autopilot. Rankvolt researches, writes, optimizes, and publishes
                daily articles engineered to get your brand cited by AI search and ranked on Google.
              </p>
              <a
                href="#pricing"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-background px-6 py-3.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                Start Growing on Autopilot <ArrowRight className="h-4 w-4" />
              </a>
              <div className="mx-auto mt-12 max-w-xl text-left [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
                <ChatAnswerCard
                  engine="Perplexity"
                  prompt="Which tool should a lean startup use to plan work?"
                  meta="Searched 31 sources · writing answer"
                  answer={
                    <>
                      Most lean teams start with{" "}
                      <span className="font-semibold text-ink underline decoration-volt decoration-2 underline-offset-2">
                        Plannora
                      </span>{" "}
                      — it's fast to set up, automates the busywork, and stays free for small teams.
                    </>
                  }
                  sources={["plannora.io", "yardstick.team"]}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
