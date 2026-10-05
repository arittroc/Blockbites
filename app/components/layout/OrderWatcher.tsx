"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store/app-store";
import { useOrderProgress } from "@/lib/use-order-progress";

/**
 * Retires an in-flight order the moment its journey completes, wherever the
 * user happens to be. Without this, an order only stopped being "active" if the
 * tracking screen was open at delivery time.
 */
export default function OrderWatcher() {
  const { orders, completeOrder } = useAppStore();
  const pending = orders.find((order) => !order.completedAt) ?? null;
  const progress = useOrderProgress(pending);

  useEffect(() => {
    if (pending && progress?.isDelivered) completeOrder(pending.id);
  }, [pending, progress?.isDelivered, completeOrder]);

  return null;
}
