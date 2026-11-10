export type Pt = { x: number; y: number };

/** Catmull-Rom → cubic Bézier: smooth, and the same commands for any data, so paths can morph. */
export function smoothPath(pts: Pt[]): string {
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${(p1.x + (p2.x - p0.x) / 6).toFixed(1)},${(p1.y + (p2.y - p0.y) / 6).toFixed(1)} ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)},${(p2.y - (p3.y - p1.y) / 6).toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Line + area paths for a sparkline in a 100x30 box. */
export function sparkPaths(values: number[]) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => ({ x: (i / (values.length - 1)) * 100, y: 27 - ((v - min) / (max - min || 1)) * 22 }));
  const line = smoothPath(pts);
  return { line, area: `${line} L100,30 L0,30 Z` };
}
