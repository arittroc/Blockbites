import { cn } from "@/lib/utils";

interface FloatingBarProps {
  children: React.ReactNode;
  /** "nav" sits above the tab bar, "none" hugs the bottom of the frame. */
  offset?: "nav" | "none";
  className?: string;
}

/**
 * `fixed` + `inset-x-0` + `mx-auto max-w-md` lands in the same place whether the
 * containing block is the viewport or the (blurred) app shell, so the bar is
 * always pinned inside the phone frame.
 */
export default function FloatingBar({ children, offset = "nav", className }: FloatingBarProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-30 mx-auto w-full max-w-md px-4",
        offset === "nav"
          ? "bottom-[calc(4.75rem+env(safe-area-inset-bottom))]"
          : "bottom-0 pb-safe",
        className,
      )}
    >
      <div className="pointer-events-auto animate-rise motion-reduce:animate-none">{children}</div>
    </div>
  );
}
