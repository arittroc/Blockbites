"use client";

import { Banknote, CreditCard, ScanQrCode, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { PaymentMethod, PaymentMethodId } from "@/lib/types";

export const PAYMENT_METHODS: Array<PaymentMethod & { icon: LucideIcon }> = [
  {
    id: "upi",
    label: "UPI",
    description: "Pay instantly with any UPI app",
    badge: "Fastest",
    requiresIntent: true,
    icon: ScanQrCode,
  },
  {
    id: "card",
    label: "Card",
    description: "Visa, Mastercard, RuPay",
    requiresIntent: true,
    icon: CreditCard,
  },
  {
    id: "wallet",
    label: "BlockBites wallet",
    description: "Balance ₹1,240",
    requiresIntent: true,
    icon: Wallet,
  },
  {
    id: "cod",
    label: "Cash on delivery",
    description: "Pay the rider when it arrives",
    requiresIntent: false,
    icon: Banknote,
  },
];

interface PaymentMethodPickerProps {
  selectedId: PaymentMethodId;
  onSelect: (id: PaymentMethodId) => void;
}

export default function PaymentMethodPicker({ selectedId, onSelect }: PaymentMethodPickerProps) {
  return (
    <div role="radiogroup" aria-label="Payment method" className="space-y-2.5">
      {PAYMENT_METHODS.map((method) => {
        const selected = method.id === selectedId;
        const Icon = method.icon;
        return (
          <button
            key={method.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(method.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.99]",
              selected
                ? "border-brand-orange/60 bg-brand-orange/8"
                : "border-black/8 bg-white/50 dark:border-white/10 dark:bg-white/5",
            )}
          >
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-xl",
                selected
                  ? "bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white"
                  : "bg-black/5 text-gray-500 dark:bg-white/10 dark:text-gray-400",
              )}
            >
              <Icon size={17} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-sm font-bold text-brand-dark dark:text-white">{method.label}</span>
                {method.badge ? <Badge tone="success">{method.badge}</Badge> : null}
              </span>
              <span className="mt-0.5 block truncate text-xs text-brand-muted dark:text-gray-400">
                {method.description}
              </span>
            </span>

            <span
              aria-hidden="true"
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full border-2",
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
