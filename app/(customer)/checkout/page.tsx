"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bike,
  ChevronRight,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Timer,
  TriangleAlert,
  X,
} from "lucide-react";
import { useState } from "react";
import AddressPicker from "@/components/checkout/AddressPicker";
import PaymentMethodPicker, { PAYMENT_METHODS } from "@/components/checkout/PaymentMethodPicker";
import TipSelector from "@/components/checkout/TipSelector";
import BillBreakdown from "@/components/cart/BillBreakdown";
import Button, { buttonClass } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import FloatingBar from "@/components/ui/FloatingBar";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Button";
import { ADDRESSES, MEALS } from "@/lib/mock/data";
import { createOrder, createPaymentIntent } from "@/lib/mock/api";
import { calculateBill } from "@/lib/order-progress";
import { formatINR } from "@/lib/format";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";
import type { PaymentMethodId } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, promo, promoCode, setPromoCode, placeOrder, hydrated } = useAppStore();

  const [addressId, setAddressId] = useState(ADDRESSES[0].id);
  const [method, setMethod] = useState<PaymentMethodId>("upi");
  const [tip, setTip] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const address = ADDRESSES.find((item) => item.id === addressId) ?? ADDRESSES[0];
  const selectedMethod = PAYMENT_METHODS.find((item) => item.id === method) ?? PAYMENT_METHODS[0];
  const bill = calculateBill({ itemTotal: cartSubtotal, tip, promo });

  // Prep time of the slowest portion in the basket plus travel time.
  const slowestPrep = cart.reduce((longest, line) => {
    const meal = MEALS.find((item) => item.id === line.mealId);
    return Math.max(longest, meal?.prepMinutes ?? 20);
  }, 0);
  const etaMinutes = Math.max(18, slowestPrep + 12);

  const submit = async () => {
    if (cart.length === 0) return;
    setStatus("processing");
    setError(null);

    try {
      // Cash on delivery skips the intent, everything else "authorises" first.
      if (selectedMethod.requiresIntent) {
        await createPaymentIntent({ amount: bill.total, method });
      }

      const order = await createOrder({
        lines: cart.map((line) => ({
          mealId: line.mealId,
          name: line.name,
          chefName: line.chefName,
          image: line.image,
          emoji: line.emoji,
          price: line.price,
          quantity: line.quantity,
        })),
        bill,
        address,
        paymentMethod: method,
        etaMinutes,
      });

      placeOrder(order);
      router.push(`/tracking/${order.id}`);
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Payment could not be completed.");
    }
  };

  if (hydrated && cart.length === 0 && status === "idle") {
    return (
      <div className="flex w-full flex-col">
        <PageHeader title="Checkout" back fallbackHref="/cart" />
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          description="Add a portion from a home chef first — then come back here to pay."
          action={
            <Link href="/home" className={buttonClass({ size: "lg", fullWidth: true })}>
              Browse home chefs
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <PageHeader title="Checkout" subtitle="Step 2 of 2 · secure payment" back fallbackHref="/cart" />

      <div className="space-y-4 p-4 pb-40">
        <GlassCard className="p-4">
          <SectionHeader
            title="Deliver to"
            subtitle={address.area}
            action={
              <Link href="/profile" className="text-xs font-semibold text-brand-orange">
                Manage
              </Link>
            }
          />
          <AddressPicker addresses={ADDRESSES} selectedId={addressId} onSelect={setAddressId} />
        </GlassCard>

        <GlassCard className="flex items-center gap-3 p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-black/5 text-brand-orange dark:bg-white/10">
            <Timer size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-brand-dark dark:text-white">
              Arriving in about {etaMinutes} min
            </p>
            <p className="truncate text-xs text-brand-muted dark:text-gray-400">
              {cart.length} portion{cart.length === 1 ? "" : "s"} cooked fresh after you pay
            </p>
          </div>
          <Bike size={18} className="shrink-0 text-gray-400" />
        </GlassCard>

        <GlassCard className="p-4">
          <SectionHeader title="Payment method" subtitle="Mocked in this build — no money moves" />
          <PaymentMethodPicker selectedId={method} onSelect={setMethod} />
        </GlassCard>

        <GlassCard className="p-4">
          <SectionHeader title="Tip your rider" subtitle="Optional, and always appreciated" />
          <TipSelector tip={tip} onChange={setTip} />
        </GlassCard>

        <GlassCard className="p-4">
          <SectionHeader title="Bill details" className="mb-3" />

          {promo ? (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-emerald-500/10 px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Tag size={14} /> {promo.code} · {promo.label}
              </span>
              <button
                type="button"
                onClick={() => setPromoCode(null)}
                aria-label={`Remove promo code ${promo.code}`}
                className="grid size-6 place-items-center rounded-full bg-black/5 text-brand-dark transition active:scale-90 dark:bg-white/10 dark:text-white"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <Link
              href="/cart"
              className="mb-3 flex items-center justify-between gap-2 rounded-2xl bg-black/4 px-3.5 py-2.5 text-xs font-semibold text-brand-dark/80 transition active:scale-[0.99] dark:bg-white/5 dark:text-white/80"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-brand-orange" /> Have a promo code?
              </span>
              <ChevronRight size={14} />
            </Link>
          )}

          <BillBreakdown bill={bill} />
          {promoCode === null && bill.itemTotal >= 149 ? (
            <p className="mt-3 text-[11px] text-brand-muted dark:text-gray-400">
              Tip: code FIRST50 takes ₹50 off this order.
            </p>
          ) : null}
        </GlassCard>

        {status === "error" && error ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-3xl border border-red-500/30 bg-red-500/8 p-4"
          >
            <TriangleAlert size={18} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-red-700 dark:text-red-400">Payment failed</p>
              <p className="mt-0.5 text-xs text-red-700/80 dark:text-red-400/80">{error}</p>
              <p className="mt-1.5 text-[11px] text-red-700/70 dark:text-red-400/70">
                Your basket is untouched — try again or pick another method.
              </p>
            </div>
          </div>
        ) : null}

        <p className="flex items-center justify-center gap-2 text-center text-[11px] text-brand-muted dark:text-gray-400">
          <ShieldCheck size={13} /> Demo checkout · payments are simulated locally
        </p>
      </div>

      <FloatingBar offset="none">
        <Button
          size="lg"
          fullWidth
          loading={status === "processing"}
          onClick={submit}
          className="justify-between px-5"
        >
          <span className="flex items-center gap-2">
            {status === "processing" ? (
              "Processing…"
            ) : (
              <>
                <Lock size={15} />
                {selectedMethod.requiresIntent ? "Pay" : "Place order"} {formatINR(bill.total)}
              </>
            )}
          </span>
          <span className="text-xs font-semibold opacity-80">{selectedMethod.label}</span>
        </Button>
      </FloatingBar>

      {status === "processing" ? (
        <div
          className={cn(
            "fixed inset-0 z-[70] mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4 bg-black/45 backdrop-blur-md",
          )}
          role="status"
          aria-live="assertive"
        >
          <span className="glass-strong grid size-20 place-items-center rounded-3xl">
            <Spinner className="text-brand-orange" />
          </span>
          <div className="text-center">
            <p className="text-sm font-bold text-white">Authorising payment</p>
            <p className="mt-1 text-xs text-white/70">{formatINR(bill.total)} · do not close the app</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
