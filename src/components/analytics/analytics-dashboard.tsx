"use client";

import { MotionConfig, motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { GoalCard, TopProducts } from "./bottom-row";
import { CommandPalette, type Command } from "./command-palette";
import { compact, INCOMING_SALES, INITIAL_SALES, money, RANGES, type RangeData, type RangeKey, type Sale } from "./data";
import { KpiCard } from "./kpi-card";
import { LiveSales } from "./live-sales";
import { Panel } from "./panel";
import { RevenueChart } from "./revenue-chart";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { TrafficCard } from "./traffic-card";
import { useCountUp } from "@/hooks/use-count-up";

const stagger: Variants = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } } };

type AnalyticsDashboardProps = {
  name?: string;
  /** Demo realtime feed: first sale after `liveAfter` ms, then every `liveEvery` ms. Set liveAfter to 0 to turn it off. */
  liveAfter?: number;
  liveEvery?: number;
};

/** Downloads the chart data of a range as CSV. */
function exportCsv(range: RangeData) {
  const rows = [["Period", "Revenue", "Previous"], ...range.labels.map((label, i) => [label, Math.round(range.points[i] * range.scale), Math.round(range.previous[i] * range.scale)])];
  const url = URL.createObjectURL(new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: `revenue-${range.label.toLowerCase()}.csv` });
  link.click();
  URL.revokeObjectURL(url);
}

/** Desktop analytics dashboard: sidebar, global date range, KPIs, revenue chart, traffic, live sales, products and goal. */
export function AnalyticsDashboard({ name = "Dolly", liveAfter = 4000, liveEvery = 7000 }: AnalyticsDashboardProps) {
  const [range, setRange] = useState<RangeKey>("7d");
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [extra, setExtra] = useState(0);
  const [toast, setToast] = useState<Sale | null>(null);
  const [pulse, setPulse] = useState(0);
  const [live, setLive] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const data = RANGES[range];
  const online = useCountUp(1284 + pulse * 23, 0.8);
  const revenueShown = useCountUp(data.revenue + extra, 0.9);

  useEffect(() => {
    if (!liveAfter || !live) return;
    let n = 0;
    let every: ReturnType<typeof setInterval> | undefined;
    const land = () => {
      const sale = { ...INCOMING_SALES[n % INCOMING_SALES.length], id: `live-${n}` };
      n += 1;
      setSales((s) => [sale, ...s].slice(0, 6));
      setExtra((e) => e + sale.amount);
      setToast(sale);
      setPulse((p) => p + 1);
      setTimeout(() => setToast(null), 2600);
    };
    const first = setTimeout(() => {
      land();
      every = setInterval(land, liveEvery);
    }, liveAfter);
    return () => {
      clearTimeout(first);
      clearInterval(every);
    };
  }, [liveAfter, liveEvery, live]);

  // Ctrl / ⌘ + K toggles the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const commands: Command[] = [
    ...(Object.keys(RANGES) as RangeKey[]).map((key) => ({
      id: `range-${key}`,
      group: "Date range",
      icon: "calendar" as const,
      label: `Show last ${parseInt(key)} days`,
      keywords: `${key} range period`,
      hint: key === range ? "Current" : undefined,
      run: () => setRange(key),
    })),
    { id: "export", group: "Actions", icon: "download", label: "Export revenue as CSV", keywords: "download report data", run: () => exportCsv(data) },
    { id: "live", group: "Actions", icon: live ? "pause" : "bolt", label: live ? "Pause live feed" : "Resume live feed", keywords: "realtime sales orders", run: () => setLive((v) => !v) },
    { id: "copy", group: "Actions", icon: "link", label: "Copy dashboard link", keywords: "share url", run: () => void navigator.clipboard?.writeText(window.location.href) },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative z-10 flex min-h-screen gap-5 p-5 xl:h-screen">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col gap-5">
          <Topbar name={name} range={range} onRange={setRange} online={online} alerts={3 + pulse} onSearch={() => setPaletteOpen(true)} />

          <motion.div variants={stagger} initial="hidden" animate="show" className="flex min-h-0 flex-1 flex-col gap-5">
            <div id="kpis" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <KpiCard icon="revenue" label="Total revenue" value={data.revenue + extra} delta={data.deltas.revenue} format={money} spark={data.points} sparkKey={range} pulse={pulse} />
              <KpiCard icon="customers" label="Customers" value={data.customers + pulse} delta={data.deltas.customers} format={compact} spark={[...data.points].reverse().map((v, i) => v + (i % 3) * 6)} sparkKey={range} />
              <KpiCard icon="target" label="Conversion" value={data.conversion} delta={data.deltas.conversion} format={(v) => `${v.toFixed(1)}%`} spark={data.points.map((v, i) => v + Math.sin(i) * 9)} sparkKey={range} />
              <KpiCard icon="cart" label="Avg. order" value={data.aov} delta={data.deltas.aov} format={(v) => `$${v.toFixed(2)}`} spark={data.previous} sparkKey={range} />
            </div>

            <div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[1fr_350px]">
              <Panel id="revenue-card" className="flex min-h-[300px] flex-col p-5">
                <div className="mb-2 flex flex-wrap items-end gap-x-4 gap-y-1">
                  <div>
                    <h2 className="text-[14.5px] font-semibold text-smoke">Revenue</h2>
                    <p className="mt-1 font-mono text-[30px] leading-none font-bold tracking-tight">{money(revenueShown)}</p>
                  </div>
                  <span className="mb-0.5 rounded-full bg-lime/12 px-2.5 py-1 font-mono text-[12px] font-semibold text-lime">↑ {data.deltas.revenue}% vs previous</span>
                  <div className="ml-auto flex items-center gap-4 text-[12px] text-smoke">
                    <span className="flex items-center gap-1.5"><i className="h-[3px] w-4 rounded-full bg-lime" />This period</span>
                    <span className="flex items-center gap-1.5"><i className="h-0 w-4 border-t-2 border-dashed border-bone/40" />Previous</span>
                  </div>
                </div>
                <RevenueChart range={data} />
              </Panel>

              <div className="grid min-h-0 grid-rows-[auto_1fr] gap-5">
                <TrafficCard />
                <LiveSales sales={sales} toast={toast} />
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1fr_350px]">
              <TopProducts />
              <GoalCard />
            </div>
          </motion.div>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
    </MotionConfig>
  );
}
