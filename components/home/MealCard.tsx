"use client";

import { Clock, Heart, Leaf, Plus, Star } from "lucide-react";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import MealImage from "@/components/ui/MealImage";
import ProgressBar from "@/components/ui/ProgressBar";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useAppStore } from "@/lib/store/app-store";
import { formatDistance, formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Meal } from "@/lib/types";

export default function MealCard({ meal, index = 0 }: { meal: Meal; index?: number }) {
  const { cart, addToCart, setQuantity } = useAppStore();
  const [loved, setLoved] = useState(false);

  const line = cart.find((item) => item.mealId === meal.id);
  const scarce = meal.portionsLeft <= 4;
  const soldRatio = meal.portionsLeft / meal.totalPortions;

  return (
    <article
      className="glass animate-rise overflow-hidden rounded-3xl motion-reduce:animate-none"
      style={{ animationDelay: `${Math.min(index, 6) * 45}ms` }}
    >
      <div className="relative h-44 w-full">
        <MealImage src={meal.image} alt={meal.name} emoji={meal.emoji} />

        {/* Legibility scrim so the badges stay readable over any photo. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/20"
        />

        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          {meal.veg ? (
            <Badge tone="glass" className="backdrop-blur-md">
              <Leaf size={11} /> Veg
            </Badge>
          ) : null}
          <Badge tone="glass" className="backdrop-blur-md">
            {meal.spice}
          </Badge>
        </div>

        <button
          type="button"
          onClick={() => setLoved((value) => !value)}
          aria-label={loved ? `Remove ${meal.name} from favourites` : `Save ${meal.name} to favourites`}
          aria-pressed={loved}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/80 text-brand-dark backdrop-blur-md transition active:scale-90 dark:bg-black/40 dark:text-white"
        >
          <Heart size={17} className={cn(loved && "fill-red-500 text-red-500")} />
        </button>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold text-white">
          <span className="flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 backdrop-blur-md">
            <Clock size={12} /> Ready in {meal.prepMinutes}m
          </span>
          <span className="rounded-full bg-black/35 px-2 py-1 backdrop-blur-md">
            {formatDistance(meal.distanceKm)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-orange/15 text-[10px] font-bold text-brand-orange-strong dark:text-brand-orange">
              {meal.chefName
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <span className="truncate text-xs font-semibold text-brand-dark/80 dark:text-white/80">
              {meal.chefName}
            </span>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            <Star size={11} className="fill-current" /> {meal.chefRating.toFixed(1)}
          </span>
        </div>

        <h3 className="mt-2 text-[17px] font-bold leading-snug tracking-tight text-brand-dark dark:text-white">
          {meal.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brand-muted dark:text-gray-400">
          {meal.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {meal.tags.map((tag) => (
            <Badge key={tag} tone={tag.toLowerCase().includes("left") ? "danger" : "brand"}>
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-3">
          <ProgressBar
            value={soldRatio}
            tone={scarce ? "danger" : "brand"}
            label={`${meal.portionsLeft} of ${meal.totalPortions} portions left`}
          />
          <p
            className={cn(
              "mt-1.5 text-[11px] font-medium",
              scarce ? "text-red-600 dark:text-red-400" : "text-brand-muted dark:text-gray-400",
            )}
          >
            {meal.portionsLeft} of {meal.totalPortions} portions left today
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-black/5 pt-3 dark:border-white/10">
          <div>
            <p className="text-lg font-bold leading-none tracking-tight text-brand-dark dark:text-white">
              {formatINR(meal.price)}
            </p>
            <p className="mt-1 text-[11px] text-brand-muted dark:text-gray-400">{meal.portionLabel}</p>
          </div>

          {line ? (
            <QuantityStepper
              quantity={line.quantity}
              max={meal.portionsLeft}
              onChange={(quantity) => setQuantity(line.lineId, quantity)}
              label={`Quantity for ${meal.name}`}
            />
          ) : (
            <Button size="sm" onClick={() => addToCart(meal)}>
              <Plus size={15} strokeWidth={3} /> Add
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
