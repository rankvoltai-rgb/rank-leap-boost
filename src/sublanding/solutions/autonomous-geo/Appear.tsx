import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * A short rise-and-fade the first time a block scrolls into view. Page.tsx
 * wraps everything in <MotionConfig reducedMotion="user">, so visitors who ask
 * for less motion get the fade without the movement.
 */
export function Appear({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
