import type { Bill, OrderStatus, PromoCode } from "@/lib/types";

export const DELIVERY_FEE = 29;
export const FREE_DELIVERY_THRESHOLD = 299;
export const PLATFORM_FEE = 10;
export const GST_RATE = 0.05;

export function discountFor(promo: PromoCode | null, itemTotal: number) {
  if (!promo || itemTotal < promo.minOrder) return 0;
  if (promo.flat) return Math.min(promo.flat, itemTotal);
  if (promo.percent) {
    const raw = Math.round(itemTotal * promo.percent);
    return Math.min(raw, promo.maxDiscount ?? raw);
  }
  return 0;
}

export function calculateBill(input: {
  itemTotal: number;
  tip?: number;
  promo?: PromoCode | null;
}): Bill {
  const { itemTotal, tip = 0, promo = null } = input;
  const deliveryFee = itemTotal >= FREE_DELIVERY_THRESHOLD || itemTotal === 0 ? 0 : DELIVERY_FEE;
  const gst = Math.round(itemTotal * GST_RATE);
  const discount = discountFor(promo, itemTotal);

  return {
    itemTotal,
    deliveryFee,
    platformFee: itemTotal === 0 ? 0 : PLATFORM_FEE,
    gst,
    tip,
    discount,
    total: Math.max(0, itemTotal + deliveryFee + PLATFORM_FEE - discount) + gst + tip,
    freeDeliveryGap: Math.max(0, FREE_DELIVERY_THRESHOLD - itemTotal),
  };
}

export interface TimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  atSeconds: number;
}

/**
 * The journey a mock order walks through. Timings are compressed so the whole
 * flow is demoable in ~100 seconds without a backend.
 */
export const ORDER_STEPS: TimelineStep[] = [
  {
    status: "placed",
    label: "Order placed",
    description: "Payment confirmed and the chef has been notified",
    atSeconds: 0,
  },
  {
    status: "accepted",
    label: "Chef accepted",
    description: "Your meal is in the kitchen queue",
    atSeconds: 6,
  },
  {
    status: "cooking",
    label: "Cooking now",
    description: "Relax — it's being cooked fresh right now",
    atSeconds: 24,
  },
  {
    status: "picked_up",
    label: "Picked up",
    description: "The rider collected your order",
    atSeconds: 52,
  },
  {
    status: "arriving",
    label: "Arriving soon",
    description: "The rider is on your street",
    atSeconds: 74,
  },
  {
    status: "delivered",
    label: "Delivered",
    description: "Enjoy your home-cooked meal",
    atSeconds: 96,
  },
];

export const ORDER_TOTAL_SECONDS = ORDER_STEPS[ORDER_STEPS.length - 1].atSeconds;

export interface OrderProgress {
  status: OrderStatus;
  stepIndex: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  /** 0 → 1 across the whole journey, drives the ETA ring. */
  progress: number;
  /** 0 → 1 between rider pickup and delivery, drives the map marker. */
  mapProgress: number;
  steps: Array<TimelineStep & { reached: boolean; current: boolean; at: number }>;
}

export function deriveOrderProgress(placedAt: number, now: number): OrderProgress {
  const elapsedSeconds = Math.max(0, (now - placedAt) / 1000);
  let stepIndex = 0;
  for (let i = 0; i < ORDER_STEPS.length; i += 1) {
    if (elapsedSeconds >= ORDER_STEPS[i].atSeconds) stepIndex = i;
  }

  const isDelivered = elapsedSeconds >= ORDER_TOTAL_SECONDS;
  const pickupAt = ORDER_STEPS.find((step) => step.status === "picked_up")?.atSeconds ?? 52;
  const mapSpan = Math.max(1, ORDER_TOTAL_SECONDS - pickupAt);

  return {
    status: ORDER_STEPS[stepIndex].status,
    stepIndex,
    elapsedSeconds,
    remainingSeconds: isDelivered ? 0 : ORDER_TOTAL_SECONDS - elapsedSeconds,
    progress: Math.min(1, elapsedSeconds / ORDER_TOTAL_SECONDS),
    mapProgress: Math.min(1, Math.max(0, (elapsedSeconds - pickupAt * 0.35) / mapSpan)),
    steps: ORDER_STEPS.map((step, index) => ({
      ...step,
      reached: index <= stepIndex,
      current: index === stepIndex,
      at: placedAt + step.atSeconds * 1000,
    })),
  };
}
