"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
  label?: string;
}

export default function QuantityStepper({
  quantity,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
  label = "Quantity",
}: QuantityStepperProps) {
  const atMin = quantity <= min;
  const atMax = quantity >= max;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-1 rounded-full border border-black/5 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/5",
        size === "md" ? "h-9 min-w-[104px] px-1" : "h-8 min-w-[92px] px-1",
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        disabled={atMin}
        aria-label="Decrease quantity"
        className={cn(
          "grid place-items-center rounded-full text-brand-orange-strong transition active:scale-90 disabled:text-gray-400 dark:disabled:text-gray-600",
          size === "md" ? "size-7" : "size-6",
        )}
      >
        <Minus size={size === "md" ? 15 : 13} strokeWidth={2.75} />
      </button>
      <span
        className={cn(
          "min-w-4 text-center font-bold tabular-nums text-brand-dark dark:text-white",
          size === "md" ? "text-sm" : "text-[13px]",
        )}
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={atMax}
        aria-label="Increase quantity"
        className={cn(
          "grid place-items-center rounded-full text-brand-orange-strong transition active:scale-90 disabled:text-gray-400 dark:disabled:text-gray-600",
          size === "md" ? "size-7" : "size-6",
        )}
      >
        <Plus size={size === "md" ? 15 : 13} strokeWidth={2.75} />
      </button>
    </div>
  );
}
