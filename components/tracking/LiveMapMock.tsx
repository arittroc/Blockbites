"use client";

import { Bike, ChefHat, House, Navigation, Signal } from "lucide-react";
import { useEffect, useRef } from "react";
import Badge from "@/components/ui/Badge";
import { clamp, cn } from "@/lib/utils";

const VIEW = { width: 340, height: 240 };
// Kept clear of the info chips at the top and bottom of the frame.
const START = { x: 38, y: 168 };
const END = { x: 298, y: 40 };
const ROUTE = "M 38 168 C 86 152 96 126 134 116 S 192 96 210 70 S 264 52 298 40";

const toPercent = (point: { x: number; y: number }) => ({
  left: `${(point.x / VIEW.width) * 100}%`,
  top: `${(point.y / VIEW.height) * 100}%`,
});

interface LiveMapMockProps {
  /** 0 → 1 along the delivery route. */
  progress: number;
  chefName: string;
  area: string;
  distanceKm: number;
  etaLabel: string;
  /** False once the journey is over — swaps the live chip for a completed one. */
  live?: boolean;
}

/**
 * A stylised map built from gradients, CSS blocks and one SVG route. The rider
 * marker is positioned imperatively from the path geometry so the 1s tick never
 * triggers a React re-render.
 */
export default function LiveMapMock({
  progress,
  chefName,
  area,
  distanceKm,
  etaLabel,
  live = true,
}: LiveMapMockProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const traveledRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    if (traveledRef.current) {
      traveledRef.current.style.strokeDasharray = `${length}`;
      traveledRef.current.style.strokeDashoffset = `${length * (1 - clamp(progress, 0, 1))}`;
    }

    const point = path.getPointAtLength(clamp(progress, 0, 1) * length);
    if (markerRef.current) {
      markerRef.current.style.left = `${(point.x / VIEW.width) * 100}%`;
      markerRef.current.style.top = `${(point.y / VIEW.height) * 100}%`;
    }
  }, [progress]);

  return (
    <div className="relative aspect-[17/12] w-full overflow-hidden rounded-3xl border border-white/40 bg-[#e9ebef] dark:border-white/10 dark:bg-[#11151b]">
      {/* Street grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(120,132,148,0.35) 0 1px, transparent 1px 26px), repeating-linear-gradient(90deg, rgba(120,132,148,0.35) 0 1px, transparent 1px 26px)",
        }}
      />
      {/* Avenues */}
      <div aria-hidden="true" className="absolute inset-x-0 top-[46%] h-6 bg-white/70 dark:bg-white/8" />
      <div aria-hidden="true" className="absolute inset-y-0 left-[38%] w-5 bg-white/70 dark:bg-white/8" />

      {/* City blocks */}
      <div aria-hidden="true" className="absolute left-[6%] top-[10%] size-[22%] rounded-xl bg-white/55 dark:bg-white/5" />
      <div aria-hidden="true" className="absolute right-[8%] top-[58%] h-[26%] w-[30%] rounded-xl bg-emerald-400/25" />
      <div aria-hidden="true" className="absolute left-[10%] bottom-[8%] h-[16%] w-[24%] rounded-xl bg-white/45 dark:bg-white/5" />
      <div aria-hidden="true" className="absolute right-[10%] top-[12%] size-[16%] rounded-xl bg-white/50 dark:bg-white/5" />

      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* The full route, as a faint road. */}
        <path
          ref={pathRef}
          d={ROUTE}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          className="stroke-black/10 dark:stroke-white/12"
        />
        {/* Distance already covered. */}
        <path
          ref={traveledRef}
          d={ROUTE}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray="0 9999"
          className="stroke-brand-orange transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
        />
        {/* Centre line so the road reads like a map, not a progress bar. */}
        <path
          d={ROUTE}
          fill="none"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="2 12"
          className="stroke-white/70 animate-route motion-reduce:animate-none"
        />
      </svg>

      {/* Chef pin */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={toPercent(START)}>
        <span className="glass-strong grid size-9 place-items-center rounded-full text-brand-dark shadow-lg dark:text-white">
          <ChefHat size={17} />
        </span>
      </div>

      {/* Home pin */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={toPercent(END)}>
        <span className="grid size-9 place-items-center rounded-full bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white shadow-lg shadow-orange-500/30">
          <House size={17} />
        </span>
        <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          {area}
        </span>
      </div>

      {/* Rider */}
      <div
        ref={markerRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-1000 ease-linear motion-reduce:transition-none"
        style={toPercent(START)}
      >
        <span
          className={cn(
            "relative grid size-10 place-items-center rounded-full bg-brand-dark text-white shadow-xl ring-2 ring-white transition-opacity duration-500 dark:bg-white dark:text-brand-dark dark:ring-gray-900",
            // At the destination the rider sits on the home pin — let the pin win.
            progress > 0.99 ? "opacity-0" : "opacity-100",
          )}
        >
          <Bike size={18} />
          {live ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-brand-orange/60 animate-ping-soft motion-reduce:animate-none"
            />
          ) : null}
        </span>
      </div>

      {/* Status chips */}
      <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
        <Badge tone="glass" className="backdrop-blur-md">
          {live ? (
            <>
              <Signal size={11} className="text-brand-orange" /> Live
            </>
          ) : (
            <>
              <ChefHat size={11} className="text-brand-orange" /> Completed
            </>
          )}
        </Badge>
        <Badge tone="glass" className="backdrop-blur-md">
          {distanceKm.toFixed(1)} km
        </Badge>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
        <span className="glass-strong flex min-w-0 flex-1 items-center gap-2 rounded-2xl px-3 py-2">
          <Navigation size={14} className="shrink-0 text-brand-orange" />
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-semibold text-brand-dark dark:text-white">
              {chefName} → {area}
            </span>
            <span className="block truncate text-[10px] text-brand-muted dark:text-gray-400">
              {etaLabel}
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
