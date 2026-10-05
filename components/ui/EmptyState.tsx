import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      <span className="glass-subtle grid size-16 place-items-center rounded-3xl text-brand-orange">
        <Icon size={28} strokeWidth={1.8} />
      </span>
      <h2 className="mt-4 text-lg font-bold tracking-tight text-brand-dark dark:text-white">{title}</h2>
      <p className="mt-1 max-w-xs text-sm leading-relaxed text-brand-muted dark:text-gray-400">
        {description}
      </p>
      {action ? <div className="mt-5 w-full max-w-xs">{action}</div> : null}
    </div>
  );
}
