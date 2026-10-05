"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { deriveOrderProgress, ORDER_TOTAL_SECONDS } from "@/lib/order-progress";
import type { Order } from "@/lib/types";

/**
 * Ticks once a second to derive the live status, ETA and map position of an
 * order from its `placedAt` timestamp. No backend required — and because the
 * status is derived rather than stored, a reload mid-journey resumes correctly.
 */
export function useOrderProgress(order: Order | null) {
  const placedAt = order?.placedAt ?? null;

  // Seeded from the order itself so the first render is deterministic (no
  // hydration mismatch), then corrected to "now" before paint on the client.
  const [now, setNow] = useState(placedAt ?? 0);

  useIsoLayoutEffect(() => {
    if (placedAt === null) return;
    setNow(Date.now());
  }, [placedAt]);

  useEffect(() => {
    if (placedAt === null) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [placedAt]);

  if (!order) return null;

  const progress = deriveOrderProgress(order.placedAt, now || order.placedAt);
  return { ...progress, isDelivered: progress.elapsedSeconds >= ORDER_TOTAL_SECONDS };
}

/** `useLayoutEffect` on the client, `useEffect` on the server. */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
