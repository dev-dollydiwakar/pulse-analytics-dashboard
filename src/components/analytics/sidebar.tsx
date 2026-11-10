"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Icon, type IconName } from "./icons";
import { ease } from "./panel";

const NAV: { key: IconName; label: string; badge?: number }[] = [
  { key: "overview", label: "Overview" },
  { key: "analytics", label: "Analytics" },
  { key: "customers", label: "Customers" },
  { key: "products", label: "Products" },
  { key: "orders", label: "Orders", badge: 12 },
  { key: "settings", label: "Settings" },
];

export function Sidebar() {
  const [active, setActive] = useState<IconName>("overview");

  return (
    <motion.aside
      initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease }}
      className="hidden w-[232px] flex-none flex-col rounded-[24px] border border-bone/[.09] bg-[linear-gradient(170deg,rgba(255,255,255,.08),rgba(255,255,255,.02))] p-4 backdrop-blur-xl xl:flex"
    >
      <div className="flex items-center gap-2.5 px-2 py-1">
        <span className="grid size-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#c6f432,#7fa81a)] text-[15px] font-black text-graphite shadow-[0_8px_20px_-8px_#c6f432]">P</span>
        <div className="leading-tight">
          <b className="block text-[15px] font-bold">Pulse</b>
          <small className="text-[11.5px] text-smoke">Store analytics</small>
        </div>
      </div>

      <nav className="mt-7 grid gap-1">
        {NAV.map((item, i) => (
          <motion.button
            key={item.key}
            type="button"
            onClick={() => setActive(item.key)}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.25 + i * 0.06 }}
            className={`relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors ${active === item.key ? "text-bone" : "text-smoke hover:text-bone"}`}
          >
            {active === item.key && (
              <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl border border-lime/30 bg-lime/10 shadow-[0_0_24px_-10px_#c6f432]" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
            )}
            <span className={`relative ${active === item.key ? "text-lime" : ""}`}><Icon name={item.key} /></span>
            <span className="relative">{item.label}</span>
            {item.badge && <span className="relative ml-auto rounded-full bg-coral px-1.5 py-px font-mono text-[10.5px] font-bold text-graphite">{item.badge}</span>}
          </motion.button>
        ))}
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.7 }}
        className="mt-auto rounded-2xl border border-lime/20 bg-lime/[.06] p-4"
      >
        <div className="flex items-center gap-2 text-[13px] font-semibold"><span className="text-lime"><Icon name="sparkle" className="size-4" /></span>Pro plan</div>
        <p className="mt-1 text-[11.5px] text-smoke">7,240 / 10,000 events</p>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-bone/10">
          <motion.div className="h-full origin-left rounded-full bg-lime shadow-[0_0_10px_#c6f432]" initial={{ scaleX: 0 }} animate={{ scaleX: 0.72 }} transition={{ duration: 1.2, ease, delay: 0.9 }} />
        </div>
        <button type="button" className="shimmer relative mt-3 w-full cursor-pointer overflow-hidden rounded-xl bg-lime py-2 text-[12.5px] font-bold text-graphite">Upgrade</button>
      </motion.div>
    </motion.aside>
  );
}
