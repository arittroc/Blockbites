import { cn } from "@/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-shimmer rounded-2xl bg-[linear-gradient(90deg,rgba(120,120,120,0.10),rgba(120,120,120,0.22),rgba(120,120,120,0.10))] bg-[length:200%_100%] motion-reduce:animate-none",
        className,
      )}
    />
  );
}

export function MealCardSkeleton() {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-1/2 rounded-full" />
        <Skeleton className="h-3 w-3/4 rounded-full" />
        <Skeleton className="h-3 w-1/3 rounded-full" />
      </div>
    </div>
  );
}
