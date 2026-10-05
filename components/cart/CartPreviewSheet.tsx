"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import CartLineRow from "@/components/cart/CartLineRow";
import { formatINR } from "@/lib/format";
import { useAppStore } from "@/lib/store/app-store";

export default function CartPreviewSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, cartCount, cartSubtotal, setQuantity, removeLine } = useAppStore();

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Your basket · ${cartCount} item${cartCount === 1 ? "" : "s"}`}
      description="Checkout takes about 30 seconds"
      footer={
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted dark:text-gray-400">Subtotal</span>
            <span className="font-bold tabular-nums text-brand-dark dark:text-white">
              {formatINR(cartSubtotal)}
            </span>
          </div>
          <Link href="/checkout" className={buttonClass({ size: "lg", fullWidth: true })} onClick={onClose}>
            Go to checkout <ArrowRight size={17} />
          </Link>
          <Link href="/cart" className={buttonClass({ variant: "ghost", size: "md", fullWidth: true })} onClick={onClose}>
            View full cart
          </Link>
        </div>
      }
    >
      {cart.length === 0 ? (
        <p className="py-6 text-center text-sm text-brand-muted dark:text-gray-400">
          Your basket is empty.
        </p>
      ) : (
        <div className="space-y-3">
          {cart.map((line) => (
            <CartLineRow
              key={line.lineId}
              line={line}
              onQuantityChange={(quantity) => setQuantity(line.lineId, quantity)}
              onRemove={() => removeLine(line.lineId)}
            />
          ))}
          <p className="flex items-center justify-center gap-2 pt-1 text-xs text-brand-muted dark:text-gray-400">
            <ShoppingBag size={13} /> Portions are cooked to order and held for 30 minutes
          </p>
        </div>
      )}
    </Sheet>
  );
}
