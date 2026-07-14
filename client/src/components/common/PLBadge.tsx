import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { fmtPct } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function PLBadge({ value, className }: { value: number; className?: string }) {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums",
        positive
          ? "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-success"
          : "bg-[color-mix(in_oklab,var(--danger)_15%,transparent)] text-danger",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {fmtPct(value)}
    </span>
  );
}
