"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { cn, useMounted } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Hide the drag handle + header for fully custom sheets. */
  bare?: boolean;
}

export default function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  bare = false,
}: SheetProps) {
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const scrollArea = document.querySelector<HTMLElement>("[data-app-scroll]");
    const previousOverflow = scrollArea?.style.overflow;
    if (scrollArea) scrollArea.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (scrollArea) scrollArea.style.overflow = previousOverflow ?? "";
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[2px] animate-fade motion-reduce:animate-none"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          "relative mx-auto w-full max-w-md outline-none",
          "animate-sheet motion-reduce:animate-none",
        )}
      >
        <div className="glass-strong mx-2 mb-2 rounded-[28px] pb-safe">
          {bare ? null : (
            <div className="flex items-start justify-between gap-4 px-5 pt-5">
              <div>
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-black/10 dark:bg-white/20" />
                {title ? (
                  <h2 id={titleId} className="text-lg font-bold tracking-tight text-brand-dark dark:text-white">
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p className="mt-0.5 text-sm text-brand-muted dark:text-gray-400">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-black/5 text-brand-dark transition active:scale-90 dark:bg-white/10 dark:text-white"
              >
                <X size={17} />
              </button>
            </div>
          )}
          <div className="max-h-[65vh] overflow-y-auto px-5 py-4 scrollbar-hide">{children}</div>
          {footer ? <div className="px-5 pb-4 pt-1">{footer}</div> : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
