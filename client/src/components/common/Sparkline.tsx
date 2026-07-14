import { sparkline } from "@/lib/mock-data";

type Props = {
  symbol: string;
  positive?: boolean;
  width?: number;
  height?: number;
  className?: string;
};

export function Sparkline({ symbol, positive = true, width = 120, height = 36, className }: Props) {
  const data = sparkline(symbol, 40, 100);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => `${(i * step).toFixed(2)},${(height - ((v - min) / range) * height).toFixed(2)}`)
    .join(" ");
  const stroke = positive ? "var(--success)" : "var(--danger)";
  const fill = positive
    ? "color-mix(in oklab, var(--success) 18%, transparent)"
    : "color-mix(in oklab, var(--danger) 18%, transparent)";
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={className}>
      <polygon points={areaPoints} fill={fill} />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
