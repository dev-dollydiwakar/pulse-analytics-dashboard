"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Sale } from "./data";
import { Panel } from "./panel";

/** Latest orders. New ones slide in at the top with a lime flash, plus a toast. */
export function LiveSales({ sales, toast }: { sales: Sale[]; toast: Sale | null }) {
  return (
    <Panel id="live-sales" className="flex min-h-0 flex-col p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[14.5px] font-semibold">Live sales</h2>
        <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-lime">
          <motion.i className="size-1.5 rounded-full bg-lime" animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
          Live
        </span>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="absolute -top-4 right-4 z-10 flex items-center gap-2 rounded-full border border-lime/50 bg-graphite/95 px-3.5 py-2 text-[12.5px] font-semibold whitespace-nowrap shadow-[0_14px_30px_-10px_rgba(0,0,0,.9),0_0_24px_-8px_#c6f432]"
            initial={{ opacity: 0, y: 12, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 460, damping: 24 }}
          >
            <i className="size-2 rounded-full bg-lime shadow-[0_0_10px_#c6f432]" />
            New order · <b className="text-lime">${toast.amount}</b>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="mt-3 grid gap-2">
        <AnimatePresence initial={false}>
          {sales.slice(0, 3).map((s, i) => (
            <motion.li
              key={s.id}
              layout
              initial={{ opacity: 0, y: -22, scale: 0.92, backgroundColor: "rgba(198,244,50,.3)" }}
              animate={{ opacity: 1, y: 0, scale: 1, backgroundColor: "rgba(11,11,12,.35)" }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 380, damping: 28, backgroundColor: { duration: 1.5 } }}
              className="flex items-center gap-3 rounded-xl border border-bone/[.08] px-3 py-1.5"
            >
              <span className="grid size-[30px] flex-none place-items-center rounded-full text-[10.5px] font-bold text-white" style={{ background: s.color }}>{s.initials}</span>
              <span className="min-w-0 flex-1 leading-tight">
                <b className="block truncate text-[12.5px] font-semibold">{s.name}</b>
                <small className="block truncate text-[11px] text-smoke">{s.plan}</small>
              </span>
              <span className="text-right leading-tight">
                <b className="block font-mono text-[13px] font-bold text-lime">+${s.amount}</b>
                <small className="text-[10.5px] text-smoke">{i === 0 ? "just now" : `${i * 3 + 1}m ago`}</small>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Panel>
  );
}
