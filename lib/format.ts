const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹1,240 — the single currency formatter for the whole app. */
export function formatINR(value: number) {
  return inr.format(Math.round(value));
}

/** "8 min" / "45 sec" / "1 hr 5 min" */
export function formatDuration(seconds: number) {
  const safe = Math.max(0, Math.round(seconds));
  if (safe < 60) return `${safe} sec`;
  const minutes = Math.floor(safe / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hr ${minutes % 60} min`;
}

/** "08:32" countdown for the ETA ring. */
export function formatClock(seconds: number) {
  const safe = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

/** "10:42 PM" */
export function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** "12 Sep" — safe to call on the client after hydration. */
export function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/** "2.4 km" */
export function formatDistance(km: number) {
  return `${km.toFixed(1)} km`;
}

/** Order code such as #BB-4821 */
export function createOrderCode() {
  return `#BB-${Math.floor(1000 + Math.random() * 8999)}`;
}
