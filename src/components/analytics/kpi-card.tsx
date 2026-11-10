"use client";

import { motion } from "motion/react";
import type { PointerEvent } from "react";
import { useCountUp } from "@/hooks/use-count-up";
import { sparkPaths } from "./chart-utils";
import { Icon, type IconName } from "./icons";
import { ease, Panel } from "./panel";

type KpiCardProps = {
  icon: IconName;
  label: string;
  value: number;
  delta: number;
  format: (v: number) => string;
  spark: number[];
  /** Changes when the date range changes, so the sparkline redraws. */
  sparkKey: string;
  /** Increments to flash the card (e.g. a live sale landed). */
  pulse?: number;
};

/** Moves the spotlight (two CSS variables) with the pointer. */
function spotlight(e: PointerEvent<HTMLElement>) {
  const box = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - box.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - box.top}px`);
}

/** KPI card: count-up value, delta chip, self-drawing sparkline and a cursor spotlight. */
export function KpiCard({ icon, label, value, delta, format, spark, sparkKey, pulse = 0 }: KpiCardProps) {
  const shown = useCountUp(value, 1.1, 0.35);
  const { line, area } = sparkPaths(spark);

  return (
    <Panel className="group overflow-hidden p-4 transition-[translate] duration-300 hover:-translate-y-1" onPointerMove={spotlight}>
      {/* spotlight fill + a glowing border that follow the cursor */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(260px circle at var(--mx) var(--my), rgba(198,244,50,.16), transparent 65%)" }} />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[22px] p-px opacity-0 transition-opacity duration-300 [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] group-hover:opacity-100"
        style={{ background: "radial-gradient(200px circle at var(--mx) var(--my), rgba(198,244,50,.95), transparent 70%)" }}
      />
      {pulse > 0 && (
        <motion.span key={pulse} aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] bg-lime" initial={{ opacity: 0.32 }} animate={{ opacity: 0 }} transition={{ duration: 1.2 }} />
      )}
      <div className="relative flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl bg-lime/12 text-lime ring-1 ring-lime/25"><Icon name={icon} /></span>
        <span className="text-[13px] font-medium text-smoke">{label}</span>
        <span className="ml-auto rounded-full bg-lime/12 px-2 py-0.5 font-mono text-[11.5px] font-semibold text-lime">↑ {delta.toFixed(1)}%</span>
      </div>
      <motion.p
        key={`v-${pulse}`}
        className="relative mt-3 origin-left font-mono text-[28px] leading-none font-bold tracking-tight tabular-nums"
        animate={pulse ? { scale: [1, 1.08, 1], color: ["#f2f0e9", "#c6f432", "#f2f0e9"] } : undefined}
        transition={{ duration: 0.8 }}
      >
        {format(shown)}
      </motion.p>
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="relative mt-2.5 h-8 w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={`spark-${icon}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#c6f432" stopOpacity="0.3" />
            <stop offset="1" stopColor="#c6f432" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path key={`a-${sparkKey}`} d={area} fill={`url(#spark-${icon})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} />
        <motion.path key={`l-${sparkKey}`} d={line} fill="none" stroke="#c6f432" strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: 0.3, ease }} />
      </svg>
    </Panel>
  );
}
