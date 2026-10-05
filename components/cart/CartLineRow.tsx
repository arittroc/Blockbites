"use client";

import { Trash2 } from "lucide-react";
import MealImage from "@/components/ui/MealImage";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { formatINR } from "@/lib/format";
import type { CartLine } from "@/lib/types";

interface CartLineRowProps {
  line: CartLine;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartLineRow({ line, onQuantityChange, onRemove }: CartLineRowProps) {
  return (
    <div className="glass flex gap-3 rounded-3xl p-3">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
        <MealImage src={line.image} alt={line.name} emoji={line.emoji} sizes="80px" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-brand-dark dark:text-white">{line.name}</h3>
            <p className="truncate text-xs text-brand-muted dark:text-gray-400">by {line.chefName}</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${line.name} from cart`}
            className="grid size-8 shrink-0 place-items-center rounded-full text-gray-400 transition hover:bg-red-500/10 hover:text-red-500 active:scale-90"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-bold tabular-nums text-brand-dark dark:text-white">
            {formatINR(line.price * line.quantity)}
          </span>
          <QuantityStepper
            size="sm"
            quantity={line.quantity}
            max={line.portionsLeft}
            onChange={onQuantityChange}
            label={`Quantity for ${line.name}`}
          />
        </div>
      </div>
    </div>
  );
}
