"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import MealCard from "@/components/home/MealCard";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton, { MealCardSkeleton } from "@/components/ui/Skeleton";
import { CATEGORIES } from "@/lib/mock/data";
import { fetchMeals } from "@/lib/mock/api";
import { cn } from "@/lib/utils";
import type { Meal } from "@/lib/types";

const TRENDING = ["thali", "biryani", "dosa", "paneer", "rajma"];

export default function SearchPage() {
  const [meals, setMeals] = useState<Meal[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    fetchMeals().then((result) => {
      if (alive) setMeals(result);
    });
    return () => {
      alive = false;
    };
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!meals) return [];
    if (!term) return meals;
    return meals.filter((meal) =>
      [meal.name, meal.chefName, meal.category, meal.description, ...meal.tags]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [meals, query]);

  return (
    <div className="flex w-full flex-col">
      <PageHeader title="Search" subtitle="Dishes, chefs and cuisines nearby" />

      <div className="space-y-5 p-4 pb-28">
        <div className="flex items-center gap-2.5 rounded-2xl border border-black/8 bg-white/70 px-3.5 py-3 backdrop-blur-md focus-within:border-brand-orange/60 dark:border-white/10 dark:bg-white/5">
          <Search size={17} className="shrink-0 text-brand-orange" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try rajma, thali or Chef Maya"
            aria-label="Search dishes and chefs"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-sm text-brand-dark outline-none placeholder:text-gray-400 dark:text-white"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="grid size-6 shrink-0 place-items-center rounded-full bg-black/5 text-brand-dark transition active:scale-90 dark:bg-white/10 dark:text-white"
            >
              <X size={13} />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {[...CATEGORIES.slice(1).map((item) => item.name.toLowerCase()), ...TRENDING]
            .filter((term, index, all) => all.indexOf(term) === index)
            .map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className={cn(
                  "rounded-2xl px-3.5 py-2 text-xs font-semibold capitalize transition active:scale-[0.97]",
                  query.toLowerCase() === term
                    ? "bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white shadow-lg shadow-orange-500/25"
                    : "glass-subtle text-brand-dark/80 dark:text-white/80",
                )}
              >
                {term}
              </button>
            ))}
        </div>

        {meals === null ? (
          <div className="space-y-4">
            <MealCardSkeleton />
            <Skeleton className="h-24 w-full rounded-3xl" />
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No meals matched"
            description={`Nothing cooking for “${query}” right now. Try another dish or clear the search.`}
          />
        ) : (
          <div className="space-y-4">
            {results.map((meal, index) => (
              <MealCard key={meal.id} meal={meal} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
