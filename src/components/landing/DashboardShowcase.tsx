/**
 * The product, framed like a picture: the Rankbox dashboard laid on a
 * painted sky, then rows of everything it connects to. After Rankaria's
 * showcase under its hero (their dashboard on a Van Gogh, then a strip of
 * domains); the painting here is our own (scripts/painting).
 *
 * Motion is tied to the scroll, through a spring so it never jitters: the
 * dashboard rises and tips upright as the section comes up the screen, and
 * the painting drifts the other way behind it. Inside, the dashboard runs
 * its own autopilot loop (dashboard-replica.tsx). With reduced motion the
 * dashboard simply sits flat on the painting.
 */
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Band } from "./frame";
import { DashboardReplica } from "./dashboard-replica";
import { ConnectorRows } from "./connector-rows";

export function DashboardShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // The rise: from the section's top entering the screen to it reaching the
  // upper fifth, so the dashboard is flat by the time it's read.
  const { scrollYProgress: rise } = useScroll({ target: ref, offset: ["start end", "start 0.2"] });
  const p = useSpring(rise, { stiffness: 120, damping: 28, mass: 0.6 });
  const rotateX = useTransform(p, [0, 1], [16, 0]);
  const scale = useTransform(p, [0, 1], [0.92, 1]);
  const y = useTransform(p, [0, 1], [72, 0]);

  // The painting's drift, over the whole time the section is on screen.
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(pass, [0, 1], ["-7%", "7%"]);

  return (
    <section aria-label="The Rankbox dashboard">
      <Band inner="overflow-hidden">
        <div
          ref={ref}
          className="relative bg-[#1563d6] px-3 pb-14 pt-12 [perspective:1800px] sm:px-10 sm:pb-20 sm:pt-16 lg:px-16"
        >
          <motion.img
            src="/assets/painting-sky.webp"
            alt=""
            aria-hidden
            width={2200}
            height={1400}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full scale-[1.16] select-none object-cover"
            style={reduce ? undefined : { y: bgY }}
          />
          <motion.div
            className="relative mx-auto max-w-5xl will-change-transform"
            style={reduce ? undefined : { rotateX, scale, y, transformOrigin: "50% 0%" }}
          >
            <DashboardReplica />
          </motion.div>
        </div>
      </Band>
      <Band>
        <ConnectorRows />
      </Band>
    </section>
  );
}
