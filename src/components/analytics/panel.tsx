"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";

export const ease = [0.2, 0.8, 0.2, 1] as const;

/** Rise + un-blur, staggered by the parent. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.98, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};

/** Frosted glass panel used by every dashboard card. */
export function Panel({ className = "", children, ...rest }: HTMLMotionProps<"section">) {
  return (
    <motion.section
      variants={rise}
      className={`relative rounded-[22px] border border-bone/[.09] bg-[linear-gradient(160deg,rgba(255,255,255,.075),rgba(255,255,255,.02))] shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_30px_60px_-40px_rgba(0,0,0,.9)] backdrop-blur-xl ${className}`}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
