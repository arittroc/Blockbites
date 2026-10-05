import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <div>
        <h2 className="text-base font-bold tracking-tight text-brand-dark dark:text-white">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-brand-muted dark:text-gray-400">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("h-px w-full bg-black/8 dark:bg-white/10", className)} />;
}
