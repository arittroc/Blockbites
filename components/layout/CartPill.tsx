"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import { useState } from "react";
import CartPreviewSheet from "@/components/cart/CartPreviewSheet";
import FloatingBar from "@/components/ui/FloatingBar";
import { formatINR } from "@/lib/format";
import { useAppStore } from "@/lib/store/app-store";

export default function CartPill() {
  const { cart, cartCount, cartSubtotal, cartBill, hydrated } = useAppStore();
  const [open, setOpen] = useState(false);

  if (!hydrated || cart.length === 0) return null;

  return (
    <>
      <FloatingBar>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`View basket, ${cartCount} items, subtotal ${formatINR(cartSubtotal)}`}
          className="glass-strong flex w-full items-center gap-3 rounded-2xl p-2.5 pl-4 text-left shadow-xl transition active:scale-[0.98]"
        >
          <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white">
            <ShoppingBag size={18} />
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full border-2 border-white bg-brand-dark text-[10px] font-bold text-white dark:border-gray-900">
              {cartCount}
            </span>
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold leading-tight text-brand-dark dark:text-white">
              {cartCount} item{cartCount === 1 ? "" : "s"}
            </span>
            <span className="block truncate text-xs text-brand-muted dark:text-gray-400">
              {cartBill.freeDeliveryGap > 0
                ? `Add ${formatINR(cartBill.freeDeliveryGap)} for free delivery`
                : "Free delivery unlocked"}
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-xl bg-black/5 px-3 py-2 text-sm font-bold text-brand-dark dark:bg-white/10 dark:text-white">
            View cart <ArrowRight size={15} />
          </span>
        </button>
      </FloatingBar>
      <CartPreviewSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
