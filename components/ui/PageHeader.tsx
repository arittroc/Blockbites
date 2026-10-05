"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Renders a back button that falls back to `fallbackHref` when there's no history. */
  back?: boolean;
  fallbackHref?: string;
  right?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  back,
  fallbackHref = "/home",
  right,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };

  return (
    <header
      className={cn(
        "glass-strong sticky top-0 z-30 flex items-center gap-3 rounded-none px-4 py-3.5 dark:border-white/10",
        className,
      )}
    >
      {back ? (
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-black/5 text-brand-dark transition active:scale-90 dark:bg-white/10 dark:text-white"
        >
          <ArrowLeft size={19} />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold tracking-tight text-brand-dark dark:text-white">{title}</h1>
        {subtitle ? (
          <p className="truncate text-xs text-brand-muted dark:text-gray-400">{subtitle}</p>
        ) : null}
      </div>
      {right}
    </header>
  );
}
