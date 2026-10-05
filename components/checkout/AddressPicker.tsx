"use client";

import { MapPin } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatDistance } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Address } from "@/lib/types";

interface AddressPickerProps {
  addresses: Address[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function AddressPicker({ addresses, selectedId, onSelect }: AddressPickerProps) {
  return (
    <div role="radiogroup" aria-label="Delivery address" className="space-y-2.5">
      {addresses.map((address) => {
        const selected = address.id === selectedId;
        return (
          <button
            key={address.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(address.id)}
            className={cn(
              "flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.99]",
              selected
                ? "border-brand-orange/60 bg-brand-orange/8"
                : "border-black/8 bg-white/50 dark:border-white/10 dark:bg-white/5",
            )}
          >
            <span
              className={cn(
                "mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl",
                selected
                  ? "bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white"
                  : "bg-black/5 text-gray-500 dark:bg-white/10 dark:text-gray-400",
              )}
            >
              <MapPin size={16} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-sm font-bold text-brand-dark dark:text-white">{address.label}</span>
                <Badge tone="neutral">{formatDistance(address.distanceKm)}</Badge>
              </span>
              <span className="mt-0.5 block text-xs text-brand-muted dark:text-gray-400">
                {address.line1}, {address.area}
              </span>
              {address.instructions ? (
                <span className="mt-1 block text-[11px] italic text-brand-muted/90 dark:text-gray-500">
                  “{address.instructions}”
                </span>
              ) : null}
            </span>

            <span
              aria-hidden="true"
              className={cn(
                "mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2",
                selected ? "border-brand-orange" : "border-black/15 dark:border-white/20",
              )}
            >
              {selected ? <span className="size-2.5 rounded-full bg-brand-orange" /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
