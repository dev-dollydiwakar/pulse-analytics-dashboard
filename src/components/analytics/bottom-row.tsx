"use client";

import { motion } from "motion/react";
import { useCountUp } from "@/hooks/use-count-up";
import { GOAL, PRODUCTS } from "./data";
import { ease, Panel } from "./panel";

const MAX = Math.max(...PRODUCTS.map((p) => p.revenue));

export function TopProducts() {
  return (
    <Panel id="products" className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[14.5px] font-semibold">Top products</h2>
        <span className="rounded-full border border-bone/10 px-2.5 py-0.5 text-[11.5px] text-smoke">This month</span>
      </div>
      <ul className="mt-2.5 grid gap-1">
        {PRODUCTS.slice(0, 3).map((p, i) => (
          <li key={p.name} className="grid grid-cols-[1.5fr_1fr_.6fr_.9fr_1.6fr] items-center gap-3 rounded-lg px-1 py-1 text-[12.5px]">
            <span className="flex items-center gap-2.5 font-semibold">
              <i className="size-2.5 rounded-[4px]" style={{ background: p.color }} />
              {p.name}
            </span>
            <span className="text-smoke">{p.category}</span>
            <span className="font-mono text-smoke">{p.units}</span>
            <span className="font-mono font-semibold">${p.revenue.toLocaleString("en-US")}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-bone/10">
              <motion.span className="block h-full origin-left rounded-full" style={{ background: p.color }} initial={{ scaleX: 0 }} animate={{ scaleX: p.revenue / MAX }} transition={{ duration: 1.1, ease, delay: 1 + i * 0.12 }} />
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function GoalCard() {
  const pct = GOAL.current / GOAL.target;
  const shown = useCountUp(pct * 100, 1.4, 1);
  return (
    <Panel id="goal" className="flex items-center gap-5 p-5">
      <div className="relative size-[112px] flex-none">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
          <defs>
            <linearGradient id="goal-ring" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#c6f432" />
              <stop offset="1" stopColor="#7fa81a" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(242,240,233,.08)" strokeWidth={10} />
          <motion.circle cx="50" cy="50" r="40" fill="none" stroke="url(#goal-ring)" strokeWidth={10} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(198,244,50,.5))" }} initial={{ pathLength: 0 }} animate={{ pathLength: pct }} transition={{ duration: 1.4, ease, delay: 1 }} />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <b className="font-mono text-[22px] leading-none font-bold">{Math.round(shown)}%</b>
          <span className="mt-1 text-[10.5px] text-smoke">of goal</span>
        </div>
      </div>
      <div>
        <h2 className="text-[14.5px] font-semibold">Monthly goal</h2>
        <p className="mt-1 font-mono text-[13px] text-smoke">${GOAL.current.toLocaleString("en-US")} / ${GOAL.target.toLocaleString("en-US")}</p>
        <span className="mt-3 inline-flex rounded-full bg-lime/12 px-2.5 py-1 text-[11.5px] font-semibold text-lime">↑ ${GOAL.thisWeek.toLocaleString("en-US")} this week</span>
      </div>
    </Panel>
  );
}
