import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useLayoutEffect, useEffect, useSyncExternalStore } from "react";

/** Merge conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * `useLayoutEffect` on the client, `useEffect` on the server — lets us correct
 * time-derived values before paint without tripping the SSR warning.
 */
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const noopSubscribe = () => () => {};

/** True once the component has mounted on the client (hydration guard). */
export function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Deterministic clamp helper. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Stable-ish id generator that never runs during render. */
export function createId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${random}`;
}
