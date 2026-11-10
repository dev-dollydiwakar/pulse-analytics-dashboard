"use client";

import { motion } from "motion/react";
import { RANGES, type RangeKey } from "./data";
import { Icon } from "./icons";
import { ease } from "./panel";

type TopbarProps = {
  name: string;
  range: RangeKey;
  onRange: (r: RangeKey) => void;
  online: number;
  alerts: number;
  /** Opens the command palette. */
  onSearch: () => void;
};

export function Topbar({ name, range, onRange, online, alerts, onSearch }: TopbarProps) {
  return (
    <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.15 }} className="flex flex-wrap items-center gap-3">
      <div className="min-w-0 flex-1">
        <h1 className="text-[24px] font-bold tracking-tight">Good evening, {name} 👋</h1>
        <p className="mt-0.5 flex items-center gap-2 text-[13.5px] text-smoke">
          Here&apos;s what&apos;s happening with your store today
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-lime">
            <motion.i className="size-1.5 rounded-full bg-lime" animate={{ scale: [1, 1.8, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
            {Math.round(online).toLocaleString("en-US")} online
          </span>
        </p>
      </div>

      <button type="button" id="search" onClick={onSearch} className="hidden h-11 w-[230px] cursor-pointer items-center gap-2.5 rounded-[14px] whitespace-nowrap border border-bone/[.09] bg-white/[.04] px-3.5 text-[13px] text-smoke backdrop-blur-xl transition-colors hover:border-lime/30 hover:text-bone lg:flex">
        <Icon name="search" className="size-4" />
        Search anything…
        <kbd className="ml-auto rounded-md bg-bone/10 px-1.5 py-0.5 font-sans text-[10.5px] font-semibold text-bone">Ctrl K</kbd>
      </button>

      <div className="relative flex rounded-[14px] border border-bone/[.09] bg-white/[.04] p-1 backdrop-blur-xl" role="tablist" aria-label="Date range">
        {(Object.keys(RANGES) as RangeKey[]).map((key) => (
          <button
            key={key}
            id={`range-${key}`}
            type="button"
            role="tab"
            aria-selected={range === key}
            onClick={() => onRange(key)}
            className={`relative z-10 w-14 cursor-pointer rounded-[10px] py-2 text-[12.5px] font-bold transition-colors ${range === key ? "text-graphite" : "text-smoke hover:text-bone"}`}
          >
            {range === key && <motion.span layoutId="range-pill" className="absolute inset-0 -z-10 rounded-[10px] bg-lime shadow-[0_0_18px_-4px_#c6f432]" transition={{ type: "spring", stiffness: 420, damping: 30 }} />}
            {RANGES[key].label}
          </button>
        ))}
      </div>

      <button type="button" aria-label="Notifications" className="relative grid size-11 cursor-pointer place-items-center rounded-[14px] border border-bone/[.09] bg-white/[.04] text-bone backdrop-blur-xl">
        <Icon name="bell" />
        <motion.span
          key={alerts}
          className="absolute -top-1.5 -right-1.5 grid min-w-[20px] place-items-center rounded-full bg-coral px-1 font-mono text-[10.5px] font-bold text-graphite"
          initial={{ scale: 0.4 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 14 }}
        >
          {alerts}
        </motion.span>
      </button>
      <span className="grid size-11 place-items-center rounded-[14px] bg-[linear-gradient(135deg,#ffb38a,#ff6b4a)] text-[13px] font-extrabold text-graphite">DD</span>
    </motion.header>
  );
}
