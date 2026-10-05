"use client";

import Link from "next/link";
import { ArrowRight, Plus, ShoppingBag, Sparkles, Tag, UtensilsCrossed, X } from "lucide-react";
import { useState } from "react";
import BillBreakdown from "@/components/cart/BillBreakdown";
import CartLineRow from "@/components/cart/CartLineRow";
import Badge from "@/components/ui/Badge";
import Button, { buttonClass } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import FloatingBar from "@/components/ui/FloatingBar";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import SectionHeader from "@/components/ui/SectionHeader";
import { MEALS } from "@/lib/mock/data";
import { resolvePromo } from "@/lib/mock/api";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/order-progress";
import { formatINR } from "@/lib/format";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartBill,
    promo,
    setQuantity,
    removeLine,
    setPromoCode,
    addToCart,
    hydrated,
  } = useAppStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);

  const applyPromo = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    const found = resolvePromo(trimmed);
    if (!found) {
      setPromoError("That code isn't valid. Try FIRST50.");
      return;
    }
    if (cartSubtotal < found.minOrder) {
      setPromoError(`Add ${formatINR(found.minOrder - cartSubtotal)} more to use this code.`);
      return;
    }
    setPromoError(null);
    setPromoInput("");
    setPromoCode(trimmed);
  };

  const similarMeals = MEALS.filter(
    (meal) => !cart.some((line) => line.mealId === meal.id) && meal.portionsLeft > 0,
  ).slice(0, 3);

  const freeDeliveryPercent = Math.min(1, cartSubtotal / FREE_DELIVERY_THRESHOLD);

  if (hydrated && cart.length === 0) {
    return (
      <div className="flex w-full flex-col">
        <PageHeader title="My cart" back />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Home chefs near you are cooking in small batches right now. Grab a portion before it's gone."
          action={
            <Link href="/home" className={buttonClass({ size: "lg", fullWidth: true })}>
              Browse home chefs <ArrowRight size={17} />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        title="My cart"
        subtitle={`${cartCount} item${cartCount === 1 ? "" : "s"} from ${new Set(cart.map((line) => line.chefName)).size} kitchen${
          new Set(cart.map((line) => line.chefName)).size === 1 ? "" : "s"
        }`}
        back
      />

      <div className="space-y-6 p-4 pb-44">
        <section className="space-y-3">
          {cart.map((line) => (
            <CartLineRow
              key={line.lineId}
              line={line}
              onQuantityChange={(quantity) => setQuantity(line.lineId, quantity)}
              onRemove={() => removeLine(line.lineId)}
            />
          ))}
        </section>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-brand-orange" />
            <p className="text-sm font-semibold text-brand-dark dark:text-white">
              {cartBill.freeDeliveryGap > 0
                ? `Add ${formatINR(cartBill.freeDeliveryGap)} more for free delivery`
                : "Free delivery unlocked"}
            </p>
          </div>
          <ProgressBar
            className="mt-2.5"
            size="sm"
            value={freeDeliveryPercent}
            tone={cartBill.freeDeliveryGap === 0 ? "success" : "brand"}
            label="Progress towards free delivery"
          />
          <p className="mt-2 text-[11px] text-brand-muted dark:text-gray-400">
            Free delivery on orders over {formatINR(FREE_DELIVERY_THRESHOLD)}
          </p>
        </GlassCard>

        <section>
          <SectionHeader title="Goes well with" subtitle="Add another portion from a nearby chef" />
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
            {similarMeals.map((meal) => (
              <div key={meal.id} className="glass w-44 shrink-0 rounded-3xl p-3">
                <p className="text-3xl" aria-hidden="true">
                  {meal.emoji}
                </p>
                <p className="mt-1.5 line-clamp-2 text-xs font-bold leading-snug text-brand-dark dark:text-white">
                  {meal.name}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-brand-muted dark:text-gray-400">
                  {meal.chefName}
                </p>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-dark dark:text-white">
                    {formatINR(meal.price)}
                  </span>
                  <Button size="sm" variant="secondary" onClick={() => addToCart(meal)} aria-label={`Add ${meal.name}`}>
                    <Plus size={14} strokeWidth={3} /> Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <GlassCard className="p-4">
          <SectionHeader title="Apply a promo code" className="mb-2" />
          {promo ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-500/10 px-3.5 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                <Tag size={15} /> {promo.code} applied
              </span>
              <button
                type="button"
                onClick={() => setPromoCode(null)}
                aria-label={`Remove promo code ${promo.code}`}
                className="grid size-7 place-items-center rounded-full bg-black/5 text-brand-dark transition active:scale-90 dark:bg-white/10 dark:text-white"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(event) => {
                    setPromoInput(event.target.value);
                    setPromoError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") applyPromo(promoInput);
                  }}
                  placeholder="Enter code"
                  aria-label="Promo code"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-11 min-w-0 flex-1 rounded-2xl border border-black/8 bg-white/60 px-3.5 text-sm font-semibold uppercase tracking-wide text-brand-dark outline-none placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400 focus:border-brand-orange/60 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                <Button variant="secondary" onClick={() => applyPromo(promoInput)} disabled={!promoInput.trim()}>
                  Apply
                </Button>
              </div>
              {promoError ? (
                <p role="alert" className="mt-2 text-[11px] font-medium text-red-600 dark:text-red-400">
                  {promoError}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => applyPromo("FIRST50")}
                  className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-brand-orange-strong dark:text-brand-orange"
                >
                  <Badge tone="brand">FIRST50</Badge> ₹50 off your first order · tap to apply
                </button>
              )}
            </>
          )}
        </GlassCard>

        <GlassCard className="p-4">
          <SectionHeader title="Bill details" className="mb-3" />
          <BillBreakdown bill={cartBill} />
        </GlassCard>

        <p className="flex items-center justify-center gap-2 text-center text-[11px] text-brand-muted dark:text-gray-400">
          <UtensilsCrossed size={13} /> Cooked to order by verified home chefs
        </p>
      </div>

      <FloatingBar>
        <Link
          href="/checkout"
          className={cn(buttonClass({ size: "lg", fullWidth: true }), "justify-between px-5")}
        >
          <span>Proceed to checkout</span>
          <span className="tabular-nums">{formatINR(cartBill.total)}</span>
        </Link>
      </FloatingBar>
    </div>
  );
}
