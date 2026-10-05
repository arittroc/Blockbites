"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { MEALS } from "@/lib/mock/data";
import { resolvePromo } from "@/lib/mock/api";
import { calculateBill } from "@/lib/order-progress";
import { createId } from "@/lib/utils";
import type { CartLine, Meal, Order, PromoCode } from "@/lib/types";

const STORAGE_KEY = "bb.state.v1";

export type StoredOrder = Order & { completedAt?: number };

interface PersistedState {
  cart: CartLine[];
  orders: StoredOrder[];
  promoCode: string | null;
}

export interface AppSnapshot extends PersistedState {
  /** Flips once the browser store has been read; before that the snapshot is empty. */
  hydrated: boolean;
}

const EMPTY_STATE: PersistedState = { cart: [], orders: [], promoCode: null };
const SERVER_SNAPSHOT: AppSnapshot = { ...EMPTY_STATE, hydrated: false };

/**
 * The basket lives in an external store rather than component state: it is
 * read through `useSyncExternalStore` (so hydration is safe and there are no
 * setState-in-effect cascades) and mirrored to localStorage on every change.
 */
let snapshot: AppSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

type Action =
  | { type: "add"; meal: Meal }
  | { type: "setQuantity"; lineId: string; quantity: number }
  | { type: "remove"; lineId: string }
  | { type: "clearCart" }
  | { type: "setPromoCode"; promoCode: string | null }
  | { type: "placeOrder"; order: StoredOrder }
  | { type: "completeOrder"; orderId: string }
  | { type: "rateOrder"; orderId: string; rating: number }
  | { type: "reorder"; lines: Order["lines"] }
  | { type: "reset" };

function cartLineFor(meal: Meal, quantity: number): CartLine {
  return {
    lineId: createId("line"),
    mealId: meal.id,
    name: meal.name,
    chefName: meal.chefName,
    image: meal.image,
    emoji: meal.emoji,
    price: meal.price,
    quantity,
    portionsLeft: meal.portionsLeft,
  };
}

function reducer(state: PersistedState, action: Action): PersistedState {
  switch (action.type) {
    case "add": {
      const existing = state.cart.find((line) => line.mealId === action.meal.id);
      if (!existing) {
        return { ...state, cart: [...state.cart, cartLineFor(action.meal, 1)] };
      }
      return {
        ...state,
        cart: state.cart.map((line) =>
          line.lineId === existing.lineId
            ? { ...line, quantity: Math.min(line.portionsLeft, line.quantity + 1) }
            : line,
        ),
      };
    }

    case "setQuantity":
      return {
        ...state,
        cart: state.cart.flatMap((line) => {
          if (line.lineId !== action.lineId) return [line];
          const quantity = Math.min(line.portionsLeft, Math.max(0, action.quantity));
          return quantity === 0 ? [] : [{ ...line, quantity }];
        }),
      };

    case "remove":
      return { ...state, cart: state.cart.filter((line) => line.lineId !== action.lineId) };

    case "clearCart":
      return { ...state, cart: [], promoCode: null };

    case "setPromoCode":
      return { ...state, promoCode: action.promoCode };

    case "placeOrder":
      return { cart: [], promoCode: null, orders: [action.order, ...state.orders] };

    case "completeOrder":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.orderId ? { ...order, completedAt: Date.now() } : order,
        ),
      };

    case "rateOrder":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.orderId ? { ...order, rated: action.rating } : order,
        ),
      };

    case "reset":
      return { ...EMPTY_STATE };

    case "reorder":
      return {
        ...state,
        cart: action.lines.map((line) => {
          const meal = MEALS.find((item) => item.id === line.mealId);
          return {
            lineId: createId("line"),
            mealId: line.mealId,
            name: line.name,
            chefName: line.chefName,
            image: line.image,
            emoji: line.emoji,
            price: line.price,
            quantity: line.quantity,
            portionsLeft: meal?.portionsLeft ?? line.quantity,
          };
        }),
      };

    default:
      return state;
  }
}

function readPersisted(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      promoCode: typeof parsed.promoCode === "string" ? parsed.promoCode : null,
    };
  } catch {
    // A corrupt or blocked blob shouldn't take the app down.
    return EMPTY_STATE;
  }
}

function commit(next: PersistedState) {
  snapshot = { ...next, hydrated: true };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode / quota — the in-memory basket still works.
  }
  for (const listener of listeners) listener();
}

function dispatch(action: Action) {
  commit(reducer(snapshot, action));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!snapshot.hydrated) {
    // React re-reads the snapshot right after subscribing, so adopting the
    // persisted basket here is enough to trigger the post-hydration render.
    snapshot = { ...readPersisted(), hydrated: true };
  }
  return () => {
    listeners.delete(listener);
  };
}

interface AppStoreValue {
  hydrated: boolean;
  cart: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  cartBill: ReturnType<typeof calculateBill>;
  promo: PromoCode | null;
  promoCode: string | null;
  orders: StoredOrder[];
  pastOrders: StoredOrder[];
  activeOrder: StoredOrder | null;
  addToCart: (meal: Meal) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  setPromoCode: (promoCode: string | null) => void;
  /** Takes the order returned by the mock API and clears the basket. */
  placeOrder: (order: Order) => void;
  completeOrder: (orderId: string) => void;
  rateOrder: (orderId: string, rating: number) => void;
  reorder: (lines: Order["lines"]) => void;
  /** Wipes the basket, order history and promo — handy between demos. */
  resetDemo: () => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, () => snapshot, () => SERVER_SNAPSHOT);

  const addToCart = useCallback((meal: Meal) => dispatch({ type: "add", meal }), []);
  const setQuantity = useCallback(
    (lineId: string, quantity: number) => dispatch({ type: "setQuantity", lineId, quantity }),
    [],
  );
  const removeLine = useCallback((lineId: string) => dispatch({ type: "remove", lineId }), []);
  const clearCart = useCallback(() => dispatch({ type: "clearCart" }), []);
  const setPromoCode = useCallback((promoCode: string | null) => dispatch({ type: "setPromoCode", promoCode }), []);
  const placeOrder = useCallback((order: Order) => dispatch({ type: "placeOrder", order }), []);
  const completeOrder = useCallback((orderId: string) => dispatch({ type: "completeOrder", orderId }), []);
  const rateOrder = useCallback(
    (orderId: string, rating: number) => dispatch({ type: "rateOrder", orderId, rating }),
    [],
  );
  const reorder = useCallback((lines: Order["lines"]) => dispatch({ type: "reorder", lines }), []);
  const resetDemo = useCallback(() => dispatch({ type: "reset" }), []);

  const value = useMemo<AppStoreValue>(() => {
    const cartSubtotal = state.cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const promo = state.promoCode ? resolvePromo(state.promoCode) : null;
    return {
      hydrated: state.hydrated,
      cart: state.cart,
      cartCount: state.cart.reduce((sum, line) => sum + line.quantity, 0),
      cartSubtotal,
      cartBill: calculateBill({ itemTotal: cartSubtotal, promo }),
      promo,
      promoCode: state.promoCode,
      orders: state.orders,
      pastOrders: state.orders.filter((order) => order.completedAt),
      activeOrder: state.orders.find((order) => !order.completedAt) ?? null,
      addToCart,
      setQuantity,
      removeLine,
      clearCart,
      setPromoCode,
      placeOrder,
      completeOrder,
      rateOrder,
      reorder,
      resetDemo,
    };
  }, [
    state,
    addToCart,
    setQuantity,
    removeLine,
    clearCart,
    setPromoCode,
    placeOrder,
    completeOrder,
    rateOrder,
    reorder,
    resetDemo,
  ]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) throw new Error("useAppStore must be used inside <AppStoreProvider>");
  return context;
}
