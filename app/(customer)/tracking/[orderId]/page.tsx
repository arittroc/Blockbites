"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronDown,
  MapPin,
  MessageSquareWarning,
  PartyPopper,
  Phone,
  ReceiptText,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import RiderCard from "@/components/tracking/RiderCard";
import LiveMapMock from "@/components/tracking/LiveMapMock";
import Badge from "@/components/ui/Badge";
import Button, { buttonClass } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import ProgressRing from "@/components/ui/ProgressRing";
import SectionHeader from "@/components/ui/SectionHeader";
import Sheet from "@/components/ui/Sheet";
import Skeleton from "@/components/ui/Skeleton";
import StarRating from "@/components/ui/StarRating";
import StatusTimeline from "@/components/ui/StatusTimeline";
import { fetchPastOrders } from "@/lib/mock/api";
import { formatINR, formatTime } from "@/lib/format";
import { ORDER_STEPS } from "@/lib/order-progress";
import { useAppStore, type StoredOrder } from "@/lib/store/app-store";
import { useOrderProgress } from "@/lib/use-order-progress";
import { cn } from "@/lib/utils";

const ISSUE_REASONS = [
  "Order is running late",
  "Something is missing",
  "Wrong delivery address",
  "Payment or billing issue",
];

export default function OrderTrackingPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = Array.isArray(params?.orderId) ? params.orderId[0] : params?.orderId;

  const { orders, hydrated, rateOrder, reorder } = useAppStore();
  const [seed, setSeed] = useState<StoredOrder[] | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [issueSent, setIssueSent] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchPastOrders().then((result) => {
      if (alive) setSeed(result);
    });
    return () => {
      alive = false;
    };
  }, []);

  const order = orders.find((item) => item.id === orderId) ?? seed?.find((item) => item.id === orderId) ?? null;
  const progress = useOrderProgress(order);
  const delivered = progress?.isDelivered ?? false;

  if (!order || !progress) {
    if (!hydrated || (!order && seed === null)) {
      return (
        <div className="flex w-full flex-col">
          <PageHeader title="Tracking order" back fallbackHref="/tracking" />
          <div className="space-y-4 p-4">
            <Skeleton className="aspect-[17/12] w-full rounded-3xl" />
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-40 w-full rounded-3xl" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex w-full flex-col">
        <PageHeader title="Tracking order" back fallbackHref="/tracking" />
        <EmptyState
          icon={ReceiptText}
          title="Order not found"
          description="We could not find that order on this device. It may have been placed in another browser."
          action={
            <Link href="/tracking" className={buttonClass({ size: "lg", fullWidth: true })}>
              See all orders
            </Link>
          }
        />
      </div>
    );
  }

  const step = ORDER_STEPS[progress.stepIndex];
  const chefLabel =
    order.lines.length > 1
      ? `${order.lines[0].chefName} + ${order.lines.length - 1} more`
      : order.lines[0].chefName;
  const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  const minutesLeft = Math.max(1, Math.ceil(progress.remainingSeconds / 60));

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        title={order.code}
        subtitle={`${itemCount} item${itemCount === 1 ? "" : "s"} · ${chefLabel}`}
        back
        fallbackHref="/tracking"
        right={<Badge tone={delivered ? "success" : "brand"}>{delivered ? "Delivered" : "Live"}</Badge>}
      />

      <div className="space-y-4 p-4 pb-12">
        <LiveMapMock
          progress={progress.mapProgress}
          live={!delivered}
          chefName={order.lines[0].chefName}
          area={order.address.area}
          distanceKm={order.address.distanceKm}
          etaLabel={
            delivered
              ? `Delivered at ${formatTime(order.placedAt + ORDER_STEPS[ORDER_STEPS.length - 1].atSeconds * 1000)}`
              : `Arriving in about ${minutesLeft} min`
          }
        />

        <GlassCard className="p-4">
          <div className="flex items-center gap-4">
            {delivered ? (
              <span className="grid size-[88px] shrink-0 place-items-center rounded-full bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white">
                <PartyPopper size={30} />
              </span>
            ) : (
              <ProgressRing value={progress.progress} className="shrink-0">
                <span className="text-center">
                  <span className="block text-xl font-bold leading-none tabular-nums text-brand-dark dark:text-white">
                    {minutesLeft}
                  </span>
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-brand-muted dark:text-gray-400">
                    min
                  </span>
                </span>
              </ProgressRing>
            )}

            <div className="min-w-0 flex-1" aria-live="polite">
              <p className="text-base font-bold tracking-tight text-brand-dark dark:text-white">
                {delivered ? "Delivered to your door" : step.label}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-brand-muted dark:text-gray-400">
                {delivered ? "Thanks for supporting a home chef tonight." : step.description}
              </p>
              <p className="mt-1.5 text-[11px] text-brand-muted dark:text-gray-500">
                Order placed at {formatTime(order.placedAt)}
              </p>
            </div>
          </div>

          {delivered ? (
            <div className="mt-4 border-t border-black/5 pt-4 dark:border-white/10">
              <p className="text-sm font-semibold text-brand-dark dark:text-white">
                How was the food from {order.lines[0].chefName}?
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <StarRating value={order.rated ?? 0} onChange={(rating) => rateOrder(order.id, rating)} />
                {order.rated ? (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Thanks for rating
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </GlassCard>

        <GlassCard className="p-4">
          <SectionHeader title="Your rider" subtitle="Verified partner by BlockBites" />
          <RiderCard rider={order.rider} />
        </GlassCard>

        <GlassCard className="p-4">
          <SectionHeader title="Order progress" subtitle="Updates every second while mocked" />
          <StatusTimeline steps={progress.steps} />
        </GlassCard>

        <GlassCard className="p-4">
          <button
            type="button"
            onClick={() => setSummaryOpen((open) => !open)}
            aria-expanded={summaryOpen}
            className="flex w-full items-center justify-between gap-2 text-left"
          >
            <span>
              <span className="block text-base font-bold tracking-tight text-brand-dark dark:text-white">
                Order summary
              </span>
              <span className="block text-xs text-brand-muted dark:text-gray-400">
                {itemCount} item{itemCount === 1 ? "" : "s"} · {formatINR(order.bill.total)}
              </span>
            </span>
            <ChevronDown
              size={18}
              className={cn("shrink-0 text-gray-400 transition-transform", summaryOpen && "rotate-180")}
            />
          </button>

          {summaryOpen ? (
            <div className="mt-3 space-y-3 border-t border-black/5 pt-3 dark:border-white/10">
              {order.lines.map((line) => (
                <div key={line.mealId} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-black/5 text-base dark:bg-white/10">
                    {line.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-brand-dark dark:text-white">
                      {line.name}
                    </span>
                    <span className="block truncate text-[11px] text-brand-muted dark:text-gray-400">
                      {line.chefName} · qty {line.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-brand-dark dark:text-white">
                    {formatINR(line.price * line.quantity)}
                  </span>
                </div>
              ))}

              <div className="space-y-1.5 border-t border-dashed border-black/10 pt-3 text-xs dark:border-white/12">
                <div className="flex justify-between text-brand-muted dark:text-gray-400">
                  <span>Delivery fee</span>
                  <span>{order.bill.deliveryFee === 0 ? "FREE" : formatINR(order.bill.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-brand-muted dark:text-gray-400">
                  <span>Platform fee + GST</span>
                  <span>{formatINR(order.bill.platformFee + order.bill.gst)}</span>
                </div>
                {order.bill.tip > 0 ? (
                  <div className="flex justify-between text-brand-muted dark:text-gray-400">
                    <span>Rider tip</span>
                    <span>{formatINR(order.bill.tip)}</span>
                  </div>
                ) : null}
                {order.bill.discount > 0 ? (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Promo discount</span>
                    <span>−{formatINR(order.bill.discount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between pt-1 text-sm font-bold text-brand-dark dark:text-white">
                  <span>Total paid</span>
                  <span className="tabular-nums">{formatINR(order.bill.total)}</span>
                </div>
              </div>
            </div>
          ) : null}
        </GlassCard>

        <GlassCard className="flex items-start gap-3 p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-black/5 text-brand-orange dark:bg-white/10">
            <MapPin size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-brand-dark dark:text-white">
              {order.address.label} · {order.address.area}
            </p>
            <p className="mt-0.5 text-xs text-brand-muted dark:text-gray-400">{order.address.line1}</p>
            {order.address.instructions ? (
              <p className="mt-1 text-[11px] italic text-brand-muted/90 dark:text-gray-500">
                {order.address.instructions}
              </p>
            ) : null}
          </div>
        </GlassCard>

        {issueSent ? (
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/8 p-4 text-sm text-emerald-700 dark:text-emerald-400">
            <p className="font-semibold">Support ticket opened</p>
            <p className="mt-0.5 text-xs opacity-90">
              We logged “{issueSent}” — a BlockBites agent will reach out on the app shortly.
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-2.5 pt-1">
          <div className="flex gap-2.5">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIssueOpen(true)}
              className="gap-2"
            >
              <MessageSquareWarning size={16} /> Report an issue
            </Button>
            <a
              href={`tel:${order.rider.phone}`}
              className={cn(buttonClass({ variant: "secondary", fullWidth: true }), "gap-2")}
            >
              <Phone size={16} /> Call rider
            </a>
          </div>

          {delivered ? (
            <Button
              fullWidth
              size="lg"
              className="gap-2"
              onClick={() => reorder(order.lines)}
            >
              <RotateCcw size={17} /> Reorder these meals
            </Button>
          ) : (
            <Link href="/home" className={buttonClass({ variant: "ghost", fullWidth: true, size: "md" })}>
              Browse more home chefs
            </Link>
          )}
        </div>
      </div>

      <Sheet
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
        title="What went wrong?"
        description="We'll pass this to the BlockBites support team."
      >
        <div className="space-y-2.5">
          {ISSUE_REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => {
                setIssueSent(reason);
                setIssueOpen(false);
              }}
              className="w-full rounded-2xl border border-black/8 bg-white/50 p-3.5 text-left text-sm font-semibold text-brand-dark transition active:scale-[0.99] dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              {reason}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}
