"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
  label?: string;
}

export default function StarRating({
  value,
  onChange,
  size = 24,
  className,
  label = "Rate your order",
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = typeof onChange === "function";
  const shown = hovered ?? value;

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? label : `${value} out of 5 stars`}
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= shown;
        const content = (
          <Star
            size={size}
            strokeWidth={1.6}
            className={cn(
              "transition-colors",
              filled ? "fill-brand-orange text-brand-orange" : "text-gray-300 dark:text-gray-600",
            )}
          />
        );

        if (!interactive) return <span key={star}>{content}</span>;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHovered(star)}
            className="transition active:scale-90"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
