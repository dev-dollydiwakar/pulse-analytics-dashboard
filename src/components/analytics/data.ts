export type RangeKey = "7d" | "30d" | "90d";

export interface RangeData {
  label: string;
  /** 12 evenly spaced revenue points. Every range has the same length, so the chart can morph. */
  points: number[];
  /** The same 12 points for the previous period (dashed comparison line). */
  previous: number[];
  /** Multiplier from a point to dollars. */
  scale: number;
  /** Tooltip / axis label for each point. */
  labels: string[];
  revenue: number;
  customers: number;
  conversion: number;
  aov: number;
  deltas: { revenue: number; customers: number; conversion: number; aov: number };
}

const prev = (points: number[]) => points.map((v, i) => Math.round(v * 0.78 + (i % 3) * 3 - 2));

export const RANGES: Record<RangeKey, RangeData> = {
  "7d": {
    label: "7D",
    points: [32, 38, 35, 44, 41, 52, 48, 57, 54, 63, 60, 71],
    previous: prev([32, 38, 35, 44, 41, 52, 48, 57, 54, 63, 60, 71]),
    scale: 100,
    labels: ["Mon", "Mon", "Tue", "Tue", "Wed", "Thu", "Thu", "Fri", "Fri", "Sat", "Sun", "Today"],
    revenue: 48240,
    customers: 8942,
    conversion: 4.7,
    aov: 86.4,
    deltas: { revenue: 12.4, customers: 8.1, conversion: 0.6, aov: 3.2 },
  },
  "30d": {
    label: "30D",
    points: [40, 36, 45, 52, 47, 58, 55, 50, 62, 68, 64, 78],
    previous: prev([40, 36, 45, 52, 47, 58, 55, 50, 62, 68, 64, 78]),
    scale: 260,
    labels: ["Oct 12", "Oct 15", "Oct 18", "Oct 21", "Oct 23", "Oct 26", "Oct 29", "Nov 1", "Nov 3", "Nov 5", "Nov 8", "Today"],
    revenue: 186900,
    customers: 31420,
    conversion: 5.1,
    aov: 91.2,
    deltas: { revenue: 18.2, customers: 11.6, conversion: 0.9, aov: 4.5 },
  },
  "90d": {
    label: "90D",
    points: [28, 34, 31, 42, 48, 45, 57, 63, 59, 70, 76, 88],
    previous: prev([28, 34, 31, 42, 48, 45, 57, 63, 59, 70, 76, 88]),
    scale: 620,
    labels: ["Aug 12", "Aug 20", "Aug 28", "Sep 6", "Sep 14", "Sep 22", "Oct 1", "Oct 9", "Oct 17", "Oct 25", "Nov 2", "Today"],
    revenue: 512300,
    customers: 84210,
    conversion: 5.6,
    aov: 94.8,
    deltas: { revenue: 31.5, customers: 24.8, conversion: 1.4, aov: 7.9 },
  },
};

export interface Source {
  key: "organic" | "social" | "ads";
  label: string;
  value: number;
  color: string;
}

export const SOURCES: Source[] = [
  { key: "organic", label: "Organic search", value: 54, color: "#c6f432" },
  { key: "social", label: "Social", value: 28, color: "#f2f0e9" },
  { key: "ads", label: "Paid ads", value: 18, color: "#ff6b4a" },
];

export interface Sale {
  id: string;
  name: string;
  plan: string;
  amount: number;
  initials: string;
  color: string;
}

export const INITIAL_SALES: Sale[] = [
  { id: "s1", name: "Aarav Mehta", plan: "Pro · yearly", amount: 249, initials: "AM", color: "#7c3aed" },
  { id: "s2", name: "Sara Khan", plan: "Team · monthly", amount: 89, initials: "SK", color: "#0891b2" },
  { id: "s3", name: "Leo Park", plan: "Pro · monthly", amount: 29, initials: "LP", color: "#db2777" },
];

/** Demo "live" orders that arrive one by one. */
export const INCOMING_SALES: Sale[] = [
  { id: "n1", name: "Riya Sharma", plan: "Business · yearly", amount: 499, initials: "RS", color: "#ea580c" },
  { id: "n2", name: "Kabir Rao", plan: "Pro · yearly", amount: 249, initials: "KR", color: "#16a34a" },
  { id: "n3", name: "Mia Chen", plan: "Team · yearly", amount: 890, initials: "MC", color: "#2563eb" },
];

export interface Product {
  name: string;
  category: string;
  units: number;
  revenue: number;
  color: string;
}

export const PRODUCTS: Product[] = [
  { name: "Pro plan · yearly", category: "Subscription", units: 412, revenue: 102588, color: "#c6f432" },
  { name: "Team plan", category: "Subscription", units: 198, revenue: 52272, color: "#f2f0e9" },
  { name: "Glass UI kit", category: "Digital product", units: 640, revenue: 31360, color: "#ff6b4a" },
  { name: "Consulting hour", category: "Service", units: 54, revenue: 8100, color: "#ffb547" },
];

export const GOAL = { current: 36240, target: 50000, thisWeek: 4210 };

export function money(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 10_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

export function compact(v: number): string {
  return v >= 10_000 ? `${(v / 1_000).toFixed(1)}K` : Math.round(v).toLocaleString("en-US");
}
