"use client";

import { HandCoins } from "lucide-react";
import { useState } from "react";
import { TIP_PRESETS } from "@/lib/mock/data";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface TipSelectorProps {
  tip: number;
  onChange: (tip: number) => void;
}

export default function TipSelector({ tip, onChange }: TipSelectorProps) {
  const [custom, setCustom] = useState("");
  const isCustomValue = tip > 0 && !TIP_PRESETS.includes(tip);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TIP_PRESETS.map((amount) => {
          const selected = tip === amount;
          return (
            <button
              key={amount}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setCustom("");
                onChange(amount);
              }}
              className={cn(
                "h-10 min-w-16 rounded-2xl px-3 text-sm font-semibold transition active:scale-[0.97]",
                selected
                  ? "bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white shadow-lg shadow-orange-500/25"
                  : "border border-black/8 bg-white/50 text-brand-dark dark:border-white/10 dark:bg-white/5 dark:text-white",
              )}
            >
              {amount === 0 ? "No tip" : formatINR(amount)}
            </button>
          );
        })}

        <div
          className={cn(
            "flex h-10 items-center gap-1.5 rounded-2xl border px-3",
            isCustomValue
              ? "border-brand-orange/60 bg-brand-orange/8"
              : "border-black/8 bg-white/50 dark:border-white/10 dark:bg-white/5",
          )}
        >
          <HandCoins size={14} className="text-brand-orange" />
          <input
            value={custom}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "").slice(0, 3);
              setCustom(digits);
              onChange(digits ? Number(digits) : 0);
            }}
            inputMode="numeric"
            placeholder="Custom"
            aria-label="Custom tip amount in rupees"
            className="w-20 bg-transparent text-sm font-semibold text-brand-dark outline-none placeholder:font-normal placeholder:text-gray-400 dark:text-white"
          />
        </div>
      </div>

      <p className="mt-2 text-[11px] text-brand-muted dark:text-gray-400">
        100% of the tip goes to {tip > 0 ? "your rider" : "the rider"} — chefs are paid separately.
      </p>
    </div>
  );
}
