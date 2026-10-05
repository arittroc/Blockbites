import { FREE_DELIVERY_THRESHOLD } from "@/lib/order-progress";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Bill } from "@/lib/types";

function Row({
  label,
  value,
  hint,
  tone = "default",
  strong = false,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "credit" | "success";
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <div>
        <span className={cn("text-brand-dark/75 dark:text-gray-300", strong && "font-semibold text-brand-dark dark:text-white")}>
          {label}
        </span>
        {hint ? <p className="text-[11px] text-brand-muted dark:text-gray-500">{hint}</p> : null}
      </div>
      <span
        className={cn(
          "shrink-0 font-semibold tabular-nums text-brand-dark dark:text-white",
          tone === "credit" && "text-emerald-600 dark:text-emerald-400",
          tone === "success" && "text-emerald-600 dark:text-emerald-400",
          strong && "text-base",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function BillBreakdown({ bill, className }: { bill: Bill; className?: string }) {
  const freeDelivery = bill.deliveryFee === 0 && bill.itemTotal > 0;

  return (
    <div className={cn("space-y-2.5", className)}>
      <Row label="Item total" value={formatINR(bill.itemTotal)} />
      <Row
        label="Delivery fee"
        value={freeDelivery ? "FREE" : formatINR(bill.deliveryFee)}
        tone={freeDelivery ? "success" : "default"}
        hint={freeDelivery ? `Free over ${formatINR(FREE_DELIVERY_THRESHOLD)}` : undefined}
      />
      <Row label="Platform fee" value={formatINR(bill.platformFee)} />
      <Row label="GST (5%)" value={formatINR(bill.gst)} />
      {bill.tip > 0 ? <Row label="Rider tip" value={formatINR(bill.tip)} /> : null}
      {bill.discount > 0 ? (
        <Row label="Promo discount" value={`−${formatINR(bill.discount)}`} tone="credit" />
      ) : null}

      <div className="border-t border-dashed border-black/10 pt-3 dark:border-white/12">
        <Row label="Total to pay" value={formatINR(bill.total)} strong />
      </div>
    </div>
  );
}
