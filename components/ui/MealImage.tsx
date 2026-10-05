"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MealImageProps {
  src: string;
  alt: string;
  emoji: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Rendered inside a `relative` parent, always with `fill`. */
}

export default function MealImage({
  src,
  alt,
  emoji,
  sizes = "(max-width: 448px) 100vw, 448px",
  priority,
  className,
}: MealImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-label={alt}
        role="img"
        className={cn(
          "absolute inset-0 grid place-items-center bg-gradient-to-br from-orange-200 via-amber-100 to-rose-200 dark:from-orange-900/50 dark:via-amber-900/30 dark:to-rose-900/40",
          className,
        )}
      >
        <span className="text-4xl drop-shadow-sm" aria-hidden="true">
          {emoji}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
