"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type PointerEvent } from "react";
import { useSize } from "@/hooks/use-size";
import { smoothPath } from "./chart-utils";
import type { RangeData } from "./data";
import { ease } from "./panel";

const L = 56; // room for y labels
const R = 10;
const T = 16;
const B = 30; // room for x labels
const X_TICKS = [0, 2, 4, 7, 9, 11];
const spring = { type: "spring", stiffness: 520, damping: 36 } as const;

function niceStep(raw: number): number {
  const p = 10 ** Math.floor(Math.log10(raw));
  const f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
}

function tickLabel(v: number): string {
  if (v >= 1_000_000) return `$${+(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${+(v / 1_000).toFixed(1)}K`;
  return `$${Math.round(v)}`;
}

/** Responsive revenue chart: this period vs previous, morphs between ranges, scrub with the pointer. */
export function RevenueChart({ range }: { range: RangeData }) {
  const [ref, { width, height }] = useSize<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const geo = useMemo(() => {
    if (!width || !height) return null;
    // Round the axis to clean steps ($2K, $4K… / $10K, $15K…) in dollars.
    const all = [...range.points, ...range.previous].map((v) => v * range.scale);
    const step = niceStep((Math.max(...all) - Math.min(...all)) / 3);
    const lo = Math.floor((Math.min(...all) * 0.92) / step) * step;
    const hi = Math.ceil((Math.max(...all) * 1.04) / step) * step;
    const x = (i: number) => L + (i / 11) * (width - L - R);
    const y = (v: number) => T + (1 - (v * range.scale - lo) / (hi - lo)) * (height - T - B);
    const ticks: { y: number; label: string }[] = [];
    for (let v = hi; v >= lo - 1e-6; v -= step) ticks.push({ y: T + (1 - (v - lo) / (hi - lo)) * (height - T - B), label: tickLabel(v) });
    const pts = range.points.map((v, i) => ({ x: x(i), y: y(v) }));
    const prev = range.previous.map((v, i) => ({ x: x(i), y: y(v) }));
    const line = smoothPath(pts);
    return {
      pts,
      line,
      area: `${line} L${x(11).toFixed(1)},${height - B} L${L},${height - B} Z`,
      prev: smoothPath(prev),
      ticks,
    };
  }, [range, width, height]);

  function onMove(e: PointerEvent<SVGSVGElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const f = (e.clientX - box.left - L) / (width - L - R);
    setHover(Math.max(0, Math.min(11, Math.round(f * 11))));
  }

  const h = geo && hover !== null ? geo.pts[hover] : null;
  const value = hover !== null ? range.points[hover] * range.scale : 0;
  const change = hover !== null ? Math.round((range.points[hover] / range.previous[hover] - 1) * 100) : 0;

  return (
    <div ref={ref} className="relative min-h-0 flex-1">
      {geo && (
        <>
          <svg id="chart" width={width} height={height} className="absolute inset-0 cursor-crosshair overflow-visible" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
            <defs>
              <linearGradient id="rev-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#c6f432" stopOpacity="0.32" />
                <stop offset="1" stopColor="#c6f432" stopOpacity="0" />
              </linearGradient>
            </defs>
            {geo.ticks.map((t) => (
              <motion.g key={`${range.label}-${t.label}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <line x1={L} x2={width - R} y1={t.y} y2={t.y} stroke="rgba(242,240,233,.07)" strokeDasharray="4 6" />
                <text x={L - 12} y={t.y + 4} textAnchor="end" className="fill-smoke font-mono text-[11px]">{t.label}</text>
              </motion.g>
            ))}
            <motion.path d={geo.area} fill="url(#rev-area)" initial={{ opacity: 0 }} animate={{ d: geo.area, opacity: 1 }} transition={{ d: { duration: 0.9, ease }, opacity: { duration: 1, delay: 0.9 } }} />
            <motion.path d={geo.prev} fill="none" stroke="rgba(242,240,233,.35)" strokeWidth={2} strokeDasharray="5 6" initial={{ opacity: 0 }} animate={{ d: geo.prev, opacity: 1 }} transition={{ d: { duration: 0.9, ease }, opacity: { duration: 0.8, delay: 1.1 } }} />
            <motion.path
              d={geo.line}
              fill="none"
              stroke="#c6f432"
              strokeWidth={3.5}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 6px 14px rgba(198,244,50,.5))" }}
              initial={{ pathLength: 0 }}
              animate={{ d: geo.line, pathLength: 1 }}
              transition={{ d: { duration: 0.9, ease }, pathLength: { duration: 1.5, delay: 0.5, ease } }}
            />
            <motion.circle r={6} fill="#c6f432" initial={{ opacity: 0, cx: geo.pts[11].x, cy: geo.pts[11].y }} animate={{ opacity: 1, cx: geo.pts[11].x, cy: geo.pts[11].y }} transition={{ opacity: { delay: 1.9 }, cx: { duration: 0.9, ease }, cy: { duration: 0.9, ease } }} />
            <motion.circle r={6} fill="none" stroke="#c6f432" strokeWidth={2} initial={{ cx: geo.pts[11].x, cy: geo.pts[11].y }} animate={{ cx: geo.pts[11].x, cy: geo.pts[11].y, r: [6, 18], opacity: [0.9, 0] }} transition={{ r: { duration: 1.6, repeat: Infinity, delay: 2 }, opacity: { duration: 1.6, repeat: Infinity, delay: 2 }, cx: { duration: 0.9, ease }, cy: { duration: 0.9, ease } }} />
            {X_TICKS.map((i) => (
              <motion.text key={`${range.label}-${i}`} x={geo.pts[i].x} y={height - 8} textAnchor="middle" className="fill-smoke text-[11.5px] font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {range.labels[i]}
              </motion.text>
            ))}
            <AnimatePresence>
              {h && (
                <motion.g key="hover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.line y1={T - 6} y2={height - B} stroke="rgba(198,244,50,.5)" strokeDasharray="3 4" initial={{ x1: h.x, x2: h.x }} animate={{ x1: h.x, x2: h.x }} transition={spring} />
                  <motion.circle r={14} fill="rgba(198,244,50,.18)" initial={{ cx: h.x, cy: h.y }} animate={{ cx: h.x, cy: h.y }} transition={spring} />
                  <motion.circle r={6} fill="#0b0b0c" stroke="#c6f432" strokeWidth={3} initial={{ cx: h.x, cy: h.y }} animate={{ cx: h.x, cy: h.y }} transition={spring} />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>

          <AnimatePresence>
            {h && hover !== null && (
              <motion.div
                className="pointer-events-none absolute top-0 left-0 rounded-xl border border-bone/15 bg-graphite/90 px-3 py-2 shadow-[0_16px_30px_-12px_rgba(0,0,0,.8)] backdrop-blur-md"
                initial={{ opacity: 0, scale: 0.85, x: Math.min(Math.max(h.x - 70, 0), width - 150), y: h.y - 78 }}
                animate={{ opacity: 1, scale: 1, x: Math.min(Math.max(h.x - 70, 0), width - 150), y: Math.max(h.y - 78, -6) }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={spring}
              >
                <p className="text-[11px] font-medium text-smoke">{range.labels[hover]}</p>
                <p className="font-mono text-[16px] font-bold">
                  ${value.toLocaleString("en-US")}
                  <span className={`ml-2 text-[11.5px] ${change >= 0 ? "text-lime" : "text-coral"}`}>{change >= 0 ? "↑" : "↓"} {Math.abs(change)}%</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
