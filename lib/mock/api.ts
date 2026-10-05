import { ADDRESSES, MEALS, PROMO_CODES, RIDERS } from "@/lib/mock/data";
import { createOrderCode } from "@/lib/format";
import type {
  Address,
  Bill,
  Meal,
  Order,
  OrderLine,
  PaymentIntent,
  PaymentMethodId,
  PromoCode,
} from "@/lib/types";

/**
 * Mock backend. Every function here is shaped like the Supabase call it will
 * eventually be replaced with (see the Postgres schema notes in the plan), so
 * swapping the implementation is a one-file change.
 */

export const MOCK_PAYMENT_FAILURE = false;

/** Stand-in for network latency so loading states are visible while mocked. */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchMeals(): Promise<Meal[]> {
  await delay(320);
  return MEALS;
}

export async function fetchAddresses(): Promise<Address[]> {
  await delay(240);
  return ADDRESSES;
}

export function resolvePromo(code: string): PromoCode | null {
  return PROMO_CODES.find((promo) => promo.code === code.trim().toUpperCase()) ?? null;
}

export async function createPaymentIntent(input: {
  amount: number;
  method: PaymentMethodId;
}): Promise<PaymentIntent> {
  await delay(1100);
  if (MOCK_PAYMENT_FAILURE) {
    throw new Error("Your bank declined this payment. Try another method.");
  }
  const id = `pi_mock_${Math.random().toString(36).slice(2, 10)}`;
  return {
    id,
    clientSecret: `${id}_secret_${Math.random().toString(36).slice(2, 8)}`,
    amount: input.amount,
    method: input.method,
    status: "succeeded",
  };
}

export async function createOrder(input: {
  lines: OrderLine[];
  bill: Bill;
  address: Address;
  paymentMethod: PaymentMethodId;
  etaMinutes: number;
}): Promise<Order> {
  await delay(460);
  const rider = RIDERS[Math.floor(Math.random() * RIDERS.length)];
  return {
    id: `order_${Math.random().toString(36).slice(2, 10)}`,
    code: createOrderCode(),
    placedAt: Date.now(),
    lines: input.lines,
    bill: input.bill,
    address: input.address,
    paymentMethod: input.paymentMethod,
    rider,
    etaMinutes: input.etaMinutes,
  };
}

/** Past orders for the history list — generated relative to "now" so it never
 *  leaks a server/client timestamp mismatch. */
export async function fetchPastOrders(): Promise<Order[]> {
  await delay(380);
  const day = 24 * 60 * 60 * 1000;
  const recipes: Array<{ mealId: string; quantity: number; daysAgo: number; rated: number }> = [
    { mealId: "meal_thali", quantity: 2, daysAgo: 3, rated: 5 },
    { mealId: "meal_biryani", quantity: 1, daysAgo: 9, rated: 4 },
    { mealId: "meal_dosa", quantity: 2, daysAgo: 16, rated: 5 },
  ];

  return recipes.map((entry, index) => {
    const meal = MEALS.find((item) => item.id === entry.mealId) ?? MEALS[0];
    const itemTotal = meal.price * entry.quantity;
    const placedAt = Date.now() - entry.daysAgo * day;
    const bill: Bill = {
      itemTotal,
      deliveryFee: itemTotal >= 299 ? 0 : 29,
      platformFee: 10,
      gst: Math.round(itemTotal * 0.05),
      tip: 20,
      discount: 0,
      total: itemTotal + 10 + Math.round(itemTotal * 0.05) + 20,
      freeDeliveryGap: Math.max(0, 299 - itemTotal),
    };
    return {
      id: `order_past_${index}`,
      code: `#BB-${4820 - index * 137}`,
      placedAt,
      lines: [
        {
          mealId: meal.id,
          name: meal.name,
          chefName: meal.chefName,
          image: meal.image,
          emoji: meal.emoji,
          price: meal.price,
          quantity: entry.quantity,
        },
      ],
      bill,
      address: ADDRESSES[0],
      paymentMethod: "upi" as PaymentMethodId,
      rider: RIDERS[index % RIDERS.length],
      etaMinutes: meal.prepMinutes + 10,
      rated: entry.rated,
    };
  });
}
