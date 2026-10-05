"use client";

import Link from "next/link";
import { ChevronDown, Moon, Search, ShoppingBag, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ActiveOrderBanner from "@/components/home/ActiveOrderBanner";
import MealCard from "@/components/home/MealCard";
import CartPill from "@/components/layout/CartPill";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";
import Skeleton, { MealCardSkeleton } from "@/components/ui/Skeleton";
import { ADDRESSES, CATEGORIES } from "@/lib/mock/data";
import { fetchMeals } from "@/lib/mock/api";
import { useAppStore } from "@/lib/store/app-store";
import { useTheme } from "@/app/components/layout/ThemeProvider";
import { cn } from "@/lib/utils";
import type { CategoryId, Meal } from "@/lib/types";

export default function HomePage() {
  const { cartCount, hydrated } = useAppStore();
  const { isDark, cycleTheme } = useTheme();
  const [meals, setMeals] = useState<Meal[] | null>(null);
  const [category, setCategory] = useState<CategoryId>("all");

  const address = ADDRESSES[0];

  useEffect(() => {
    let alive = true;
    fetchMeals().then((result) => {
      if (alive) setMeals(result);
    });
    return () => {
      alive = false;
    };
  }, []);

  const visibleMeals = useMemo(() => {
    if (!meals) return [];
    if (category === "all") return meals;
    return meals.filter((meal) => meal.category === category);
  }, [meals, category]);

  return (
    <div className="flex w-full flex-col">
      <header className="glass-strong sticky top-0 z-30 flex items-center gap-3 rounded-none px-4 py-3">
        <Link href="/profile" className="min-w-0 flex-1 rounded-2xl focus-visible:outline-none">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-muted dark:text-gray-400">
            Delivering to
          </span>
          <span className="flex items-center gap-1">
            <span className="truncate text-sm font-bold text-brand-dark dark:text-white">
              {address.label} · {address.line1}
            </span>
            <ChevronDown size={15} className="shrink-0 text-gray-400" />
          </span>
        </Link>

        <button
          type="button"
          onClick={cycleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-black/5 text-brand-dark transition active:scale-90 dark:bg-white/10 dark:text-white"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link
          href="/cart"
          aria-label={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
          className="relative grid size-10 shrink-0 place-items-center rounded-full bg-black/5 text-brand-dark transition active:scale-90 dark:bg-white/10 dark:text-white"
        >
          <ShoppingBag size={18} />
          {hydrated && cartCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
              {cartCount}
            </span>
          ) : null}
        </Link>
      </header>

      <div className="space-y-6 p-4 pb-40">
        <ActiveOrderBanner />

        <Link
          href="/search"
          className="glass flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm text-brand-muted transition active:scale-[0.99] dark:text-gray-400"
        >
          <Search size={17} className="text-brand-orange" />
          Search dishes, chefs or cuisines
        </Link>

        <section>
          <SectionHeader
            title="Tonight's home kitchens"
            subtitle="Cooked in small batches, gone by dinner"
          />
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide">
            {CATEGORIES.map((item) => {
              const active = item.id === category;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition active:scale-[0.97]",
                    active
                      ? "bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white shadow-lg shadow-orange-500/25"
                      : "glass-subtle text-brand-dark/80 dark:text-white/80",
                  )}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.name}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Available right now"
            subtitle={
              meals
                ? `${visibleMeals.length} meal${visibleMeals.length === 1 ? "" : "s"} near ${address.area}`
                : "Finding kitchens near you…"
            }
            action={<Badge tone="glass">Live</Badge>}
          />

          {meals === null ? (
            <div className="space-y-4">
              <MealCardSkeleton />
              <MealCardSkeleton />
              <Skeleton className="h-24 w-full rounded-3xl" />
            </div>
          ) : visibleMeals.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nothing here yet"
              description="No chef is cooking this category right now. Try another craving or check back in a bit."
            />
          ) : (
            <div className="space-y-4">
              {visibleMeals.map((meal, index) => (
                <MealCard key={meal.id} meal={meal} index={index} />
              ))}
            </div>
          )}
        </section>
      </div>

      <CartPill />
    </div>
  );
}
