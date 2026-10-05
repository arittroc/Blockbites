"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/app/components/layout/BottomNav";
import OrderWatcher from "@/app/components/layout/OrderWatcher";
import { cn } from "@/lib/utils";

/** Full-screen flows that own the whole viewport — the tab bar would only get in the way. */
const NAVLESS_ROUTES = [/^\/checkout/, /^\/tracking\/.+/];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const showNav = !NAVLESS_ROUTES.some((route) => route.test(pathname));

  return (
    <div className="relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-white/55 shadow-2xl shadow-black/10 backdrop-blur-2xl dark:bg-black/45 dark:shadow-black/70">
      <OrderWatcher />
      <div aria-hidden="true" className="app-backdrop pointer-events-none absolute inset-0" />
      <main
        data-app-scroll
        className={cn(
          "relative z-10 flex-1 overflow-y-auto overscroll-contain scrollbar-hide",
          showNav ? "pb-[calc(4.75rem+env(safe-area-inset-bottom))]" : "pb-0",
        )}
      >
        {children}
      </main>
      {showNav ? <BottomNav /> : null}
    </div>
  );
}
