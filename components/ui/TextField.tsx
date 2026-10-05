"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  error?: string | null;
  /** Small right-aligned note next to the label. */
  hint?: string;
  /** Slot for an inline action, e.g. the password visibility toggle. */
  trailing?: React.ReactNode;
  className?: string;
}

export default function TextField({
  label,
  icon: Icon,
  error,
  hint,
  trailing,
  className,
  id,
  ...props
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label
          htmlFor={inputId}
          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-muted dark:text-gray-400"
        >
          {label}
        </label>
        {hint ? (
          <span className="text-[11px] text-brand-muted dark:text-gray-500">{hint}</span>
        ) : null}
      </div>

      <div
        className={cn(
          "glass-strong flex items-center gap-2.5 rounded-2xl px-3.5 transition",
          "focus-within:ring-2 focus-within:ring-brand-orange/60",
          error && "ring-2 ring-red-400/70",
        )}
      >
        {Icon ? <Icon size={17} className="shrink-0 text-gray-400" /> : null}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          className="h-12 min-w-0 flex-1 bg-transparent text-sm font-medium text-brand-dark outline-none placeholder:font-normal placeholder:text-gray-400 dark:text-white"
          {...props}
        />
        {trailing}
      </div>

      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
