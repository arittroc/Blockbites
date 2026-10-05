import { cn } from "@/lib/utils";

export type BadgeTone = "brand" | "success" | "danger" | "neutral" | "glass";

const TONES: Record<BadgeTone, string> = {
  brand: "bg-brand-orange/12 text-brand-orange-strong dark:text-brand-orange",
  success: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  danger: "bg-red-500/12 text-red-600 dark:text-red-400",
  neutral: "bg-black/5 text-brand-dark/70 dark:bg-white/10 dark:text-white/70",
  glass: "glass-subtle text-brand-dark/80 dark:text-white/80",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: "xs" | "sm";
}

export default function Badge({ tone = "neutral", size = "xs", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold",
        size === "xs"
          ? "px-2 py-0.5 text-[10px] uppercase tracking-wide"
          : "px-2.5 py-1 text-xs",
        TONES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
