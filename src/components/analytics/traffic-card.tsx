"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { SOURCES, type Source } from "./data";
import { ease, Panel } from "./panel";

/** Where each slice starts on the ring (0–1), computed once from the shares. */
const STARTS = SOURCES.map((_, i) => SOURCES.slice(0, i).reduce((sum, s) => sum + s.value / 100, 0));

/** Donut chart; hover a legend row to focus that slice. */
export function TrafficCard() {
  const [active, setActive] = useState<Source["key"] | null>(null);
  const focus = SOURCES.find((s) => s.key === active) ?? SOURCES[0];

  return (
    <Panel id="traffic-card" className="p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[14.5px] font-semibold">Traffic sources</h2>
        <span className="font-mono text-[12px] text-smoke">284K visits</span>
      </div>
      <div className="mt-3 flex items-center gap-5">
        <div className="relative size-[104px] flex-none">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90 overflow-visible" aria-hidden>
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(242,240,233,.08)" strokeWidth={11} />
            {SOURCES.map((s, i) => {
              const start = STARTS[i];
              const dim = active !== null && active !== s.key;
              return (
                <motion.circle
                  key={s.key}
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke={s.color}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, pathOffset: start, opacity: 1, strokeWidth: 11 }}
                  animate={{ pathLength: Math.max(0, s.value / 100 - 0.03), pathOffset: start, opacity: dim ? 0.22 : 1, strokeWidth: active === s.key ? 15 : 11 }}
                  transition={{ pathLength: { duration: 1.1, delay: 0.7 + i * 0.2, ease }, default: { type: "spring", stiffness: 320, damping: 22 } }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 grid place-content-center text-center">
            <motion.b key={focus.key} className="font-mono text-[22px] leading-none font-bold" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
              {focus.value}%
            </motion.b>
            <motion.span key={`l-${focus.key}`} className="mt-1 text-[10.5px] font-medium text-smoke" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {focus.label.split(" ")[0]}
            </motion.span>
          </div>
        </div>
        <ul className="grid flex-1 gap-1.5">
          {SOURCES.map((s, i) => (
            <li
              key={s.key}
              id={`legend-${s.key}`}
              onPointerEnter={() => setActive(s.key)}
              onPointerLeave={() => setActive(null)}
              className={`rounded-lg px-2 py-1 text-[12.5px] transition-colors ${active === s.key ? "bg-bone/[.08] text-bone" : "text-smoke"}`}
            >
              <div className="flex items-center gap-2">
                <i className="size-2 rounded-full" style={{ background: s.color }} />
                {s.label}
                <b className="ml-auto font-mono font-semibold text-bone">{s.value}%</b>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-bone/10">
                <motion.div className="h-full origin-left rounded-full" style={{ background: s.color }} initial={{ scaleX: 0 }} animate={{ scaleX: s.value / 100 }} transition={{ duration: 1, ease, delay: 0.8 + i * 0.15 }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
