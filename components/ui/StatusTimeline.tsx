import { Check, Circle, CookingPot, Bike, MapPin, ReceiptText, type LucideIcon } from "lucide-react";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

export interface TimelineItem {
  status: OrderStatus;
  label: string;
  description: string;
  reached: boolean;
  current: boolean;
  at: number;
}

const ICONS: Record<OrderStatus, LucideIcon> = {
  placed: ReceiptText,
  accepted: Check,
  cooking: CookingPot,
  picked_up: Bike,
  arriving: MapPin,
  delivered: Check,
};

export default function StatusTimeline({ steps }: { steps: TimelineItem[] }) {
  return (
    <ol className="relative space-y-0">
      {steps.map((step, index) => {
        const Icon = ICONS[step.status];
        const isLast = index === steps.length - 1;
        return (
          <li key={step.status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "relative grid size-9 shrink-0 place-items-center rounded-full border transition-colors",
                  step.reached
                    ? "border-transparent bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white"
                    : "border-black/8 bg-white/60 text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-gray-500",
                )}
              >
                {step.current ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-brand-orange/60 animate-ping-soft motion-reduce:animate-none"
                  />
                ) : null}
                {step.reached ? <Icon size={16} strokeWidth={2.5} /> : <Circle size={10} />}
              </span>
              {!isLast ? (
                <span
                  className={cn(
                    "my-1 w-px flex-1",
                    steps[index + 1].reached ? "bg-brand-orange/60" : "bg-black/10 dark:bg-white/12",
                  )}
                />
              ) : null}
            </div>
            <div className={cn("pb-5", isLast && "pb-0")}>
              <div className="flex items-baseline gap-2">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    step.reached ? "text-brand-dark dark:text-white" : "text-brand-muted dark:text-gray-500",
                  )}
                >
                  {step.label}
                </p>
                {step.reached ? (
                  <span className="text-[11px] font-medium tabular-nums text-brand-muted dark:text-gray-500">
                    {formatTime(step.at)}
                  </span>
                ) : null}
              </div>
              <p
                className={cn(
                  "mt-0.5 text-xs leading-relaxed",
                  step.current ? "text-brand-dark/70 dark:text-white/70" : "text-brand-muted dark:text-gray-500",
                )}
              >
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
