"use client";

import Link from "next/link";
import { Bike, ChevronRight } from "lucide-react";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatDuration } from "@/lib/format";
import { ORDER_STEPS } from "@/lib/order-progress";
import { useAppStore } from "@/lib/store/app-store";
import { useOrderProgress } from "@/lib/use-order-progress";

export default function ActiveOrderBanner() {
  const { activeOrder } = useAppStore();
  const progress = useOrderProgress(activeOrder);

  if (!activeOrder || !progress) return null;

  const step = ORDER_STEPS[progress.stepIndex];
  const delivered = progress.status === "delivered";

  return (
    <Link
      href={`/tracking/${activeOrder.id}`}
      className="glass animate-rise block rounded-3xl p-4 transition active:scale-[0.98] motion-reduce:animate-none"
      aria-label={delivered ? "Order delivered, open details" : `Order ${step.label}, track it`}
    >
      <div className="flex items-center gap-3">
        <span className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white">
          <Bike size={20} />
          {!delivered ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl bg-brand-orange/50 animate-ping-soft motion-reduce:animate-none"
            />
          ) : null}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-brand-dark dark:text-white">
            {delivered ? "Order delivered" : step.label}
          </p>
          <p className="truncate text-xs text-brand-muted dark:text-gray-400">
            {delivered
              ? "Tap to rate your chef"
              : `Arriving in about ${formatDuration(progress.remainingSeconds)} · ${activeOrder.code}`}
          </p>
        </div>

        <ChevronRight size={18} className="shrink-0 text-gray-400" />
      </div>

      {!delivered ? (
        <ProgressBar
          className="mt-3"
          size="sm"
          value={progress.progress}
          label="Order progress"
        />
      ) : null}
    </Link>
  );
}
