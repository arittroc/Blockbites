"use client";

import Link from "next/link";
import { ChevronRight, ReceiptText, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ActiveOrderBanner from "@/components/home/ActiveOrderBanner";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";
import StarRating from "@/components/ui/StarRating";
import { fetchPastOrders } from "@/lib/mock/api";
import { formatDate, formatINR } from "@/lib/format";
import { useAppStore, type StoredOrder } from "@/lib/store/app-store";

export default function TrackingPage() {
  const { activeOrder, pastOrders, hydrated, reorder } = useAppStore();
  const [seedHistory, setSeedHistory] = useState<StoredOrder[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetchPastOrders().then((result) => {
      if (alive) setSeedHistory(result);
    });
    return () => {
      alive = false;
    };
  }, []);

  const history = useMemo(
    () => [...pastOrders, ...(seedHistory ?? [])].sort((a, b) => b.placedAt - a.placedAt),
    [pastOrders, seedHistory],
  );

  const loading = !hydrated || seedHistory === null;

  return (
    <div className="flex w-full flex-col">
      <PageHeader title="Your orders" subtitle="Live tracking and past meals" />

      <div className="space-y-6 p-4 pb-28">
        {activeOrder ? (
          <section>
            <SectionHeader title="On the way" subtitle="Tap to follow your rider" />
            <ActiveOrderBanner />
          </section>
        ) : null}

        <section>
          <SectionHeader title="Order history" subtitle="Delivered meals from your neighbourhood" />

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-3xl" />
              <Skeleton className="h-20 w-full rounded-3xl" />
            </div>
          ) : history.length === 0 ? (
            <EmptyState
              icon={ReceiptText}
              title="No orders yet"
              description="Your first home-cooked meal is a tap away — browse what's cooking nearby."
            />
          ) : (
            <div className="space-y-3">
              {history.map((order) => (
                <GlassCard key={order.id} className="p-3.5">
                  <Link href={`/tracking/${order.id}`} className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-black/5 text-xl dark:bg-white/10">
                      {order.lines[0]?.emoji ?? "🍽️"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-brand-dark dark:text-white">
                          {order.lines.map((line) => line.name).join(", ")}
                        </span>
                        <Badge tone="success">Delivered</Badge>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-brand-muted dark:text-gray-400">
                        {order.code} · {formatDate(order.placedAt)} · {order.lines[0]?.chefName}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-bold tabular-nums text-brand-dark dark:text-white">
                        {formatINR(order.bill.total)}
                      </span>
                      <ChevronRight size={16} className="ml-auto text-gray-400" />
                    </span>
                  </Link>

                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-black/5 pt-3 dark:border-white/10">
                    <StarRating value={order.rated ?? 0} size={16} />
                    <button
                      type="button"
                      onClick={() => reorder(order.lines)}
                      className="flex items-center gap-1.5 rounded-xl bg-black/5 px-3 py-1.5 text-xs font-semibold text-brand-dark transition active:scale-95 dark:bg-white/10 dark:text-white"
                    >
                      <RotateCcw size={13} /> Reorder
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
