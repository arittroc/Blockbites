import { clamp, cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0 → 1 */
  value: number;
  tone?: "brand" | "success" | "danger";
  size?: "xs" | "sm";
  className?: string;
  label?: string;
}

const TONES = {
  brand: "bg-gradient-to-r from-brand-orange-soft to-brand-orange",
  success: "bg-gradient-to-r from-emerald-400 to-emerald-600",
  danger: "bg-gradient-to-r from-red-400 to-red-600",
} as const;

export default function ProgressBar({
  value,
  tone = "brand",
  size = "xs",
  className,
  label,
}: ProgressBarProps) {
  const percent = clamp(value, 0, 1) * 100;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      aria-label={label}
      className={cn(
        "w-full overflow-hidden rounded-full bg-black/8 dark:bg-white/10",
        size === "xs" ? "h-1.5" : "h-2",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full origin-left animate-bar motion-reduce:animate-none", TONES[tone])}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
