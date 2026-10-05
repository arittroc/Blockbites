import { cn } from "@/lib/utils";

type GlassTone = "glass" | "glass-strong" | "glass-subtle";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: GlassTone;
  /** Retune the frosted opacity without fighting utility specificity. */
  alpha?: number;
}

export default function GlassCard({
  tone = "glass",
  alpha,
  className,
  style,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(tone, "rounded-3xl", className)}
      style={alpha === undefined ? style : ({ ...style, "--glass-alpha": alpha } as React.CSSProperties)}
      {...props}
    >
      {children}
    </div>
  );
}
