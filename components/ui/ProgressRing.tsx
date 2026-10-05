import { clamp, cn } from "@/lib/utils";

interface ProgressRingProps {
  /** 0 → 1, where 1 is "complete". */
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  trackClassName?: string;
  children?: React.ReactNode;
}

export default function ProgressRing({
  value,
  size = 88,
  stroke = 7,
  className,
  trackClassName,
  children,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamp(value, 0, 1));

  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={cn("stroke-black/8 dark:stroke-white/12", trackClassName)}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-brand-orange transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}
