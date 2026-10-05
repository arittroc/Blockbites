"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, ReceiptText, Search, User } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const { activeOrder } = useAppStore();

  const navItems = [
    { label: "Home", href: "/home", icon: House },
    { label: "Search", href: "/search", icon: Search },
    { label: "Orders", href: "/tracking", icon: ReceiptText, live: Boolean(activeOrder) },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="glass-strong absolute inset-x-0 bottom-0 z-40 flex items-stretch justify-around rounded-none pb-safe pt-1.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex w-full flex-col items-center justify-center gap-0.5 py-1.5 transition active:scale-[0.96]",
              isActive ? "text-brand-orange" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
            )}
          >
            <span className="relative">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {item.live ? (
                <span className="absolute -right-1 -top-0.5 flex size-2.5">
                  <span className="absolute inline-flex size-full rounded-full bg-brand-orange opacity-70 animate-ping-soft motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2.5 rounded-full border border-white bg-brand-orange dark:border-gray-900" />
                </span>
              ) : null}
            </span>
            <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
