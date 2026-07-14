import { sparkline } from "@/lib/mock-data";

type Props = { symbol: string; positive?: boolean; height?: number };

export function PriceChart({ symbol, positive = true, height = 280 }: Props) {
  const data = sparkline(symbol, 90, 200);
  const width = 800;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 20) - 10] as const);
  const line = pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `0,${height} ${line} ${width},${height}`;
  const stroke = positive ? "var(--success)" : "var(--danger)";
  const fill = positive
    ? "color-mix(in oklab, var(--success) 15%, transparent)"
    : "color-mix(in oklab, var(--danger) 15%, transparent)";

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1={0} x2={width} y1={height * t} y2={height * t} stroke="var(--border)" strokeDasharray="4 6" />
        ))}
        <polygon points={area} fill={fill} />
        <polyline points={line} fill="none" stroke={stroke} strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
