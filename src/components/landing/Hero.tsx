import { ArrowRight, Play } from "lucide-react";
import { Reveal, Stars, Avatar, PrimaryButton, SecondaryButton } from "./shared";
import { DashboardMockup } from "./DashboardMockup";

const FACES = ["Mark Eckert", "Nik Zechner", "Denis Yurchak", "Ray Joe", "John Logan"];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:pt-20 md:pt-24">
        <div className="max-w-3xl">
          <Reveal>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-[4.2rem]">
              Get Google, ChatGPT Traffic on Autopilot
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Grow organic traffic on autopilot. Daily published articles to your
              website and backlink building even while you sleep.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryButton>
                Get Traffic on Autopilot <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
              <SecondaryButton>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-background">
                  <Play className="h-3 w-3 fill-current" />
                </span>
                View Demo
              </SecondaryButton>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-7 flex items-center gap-3">
              <div className="flex -space-x-2">
                {FACES.map((f) => (
                  <Avatar key={f} name={f} className="h-9 w-9" />
                ))}
              </div>
              <div className="flex flex-col">
                <Stars />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-ink">3,000+</span> happy customers
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.3} className="mt-14">
          <DashboardMockup />
        </Reveal>
      </div>
    </section>
  );
}