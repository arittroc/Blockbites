"use client";

import { MessageCircle, Phone, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Rider } from "@/lib/types";

interface RiderCardProps {
  rider: Rider;
  className?: string;
}

export default function RiderCard({ rider, className }: RiderCardProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-orange-soft to-brand-orange-strong text-sm font-bold text-white">
        {rider.initials}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-brand-dark dark:text-white">{rider.name}</p>
        <p className="flex items-center gap-1.5 truncate text-xs text-brand-muted dark:text-gray-400">
          <Star size={11} className="fill-current text-brand-orange" />
          {rider.rating.toFixed(1)}
          {rider.deliveries > 0 ? <span>· {rider.deliveries.toLocaleString("en-IN")} trips</span> : null}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-brand-muted/90 dark:text-gray-500">
          {rider.vehicle}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label={`Message ${rider.name}`}
          className="grid size-10 place-items-center rounded-2xl border border-black/8 bg-white/60 text-brand-dark transition active:scale-90 dark:border-white/10 dark:bg-white/5 dark:text-white"
        >
          <MessageCircle size={17} />
        </button>
        <a
          href={`tel:${rider.phone}`}
          aria-label={`Call ${rider.name}`}
          className="grid size-10 place-items-center rounded-2xl bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white shadow-lg shadow-orange-500/25 transition active:scale-90"
        >
          <Phone size={17} />
        </a>
      </div>
    </div>
  );
}
