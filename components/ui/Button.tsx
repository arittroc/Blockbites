"use client";

import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white shadow-lg shadow-orange-500/25 hover:brightness-[1.06]",
  secondary:
    "glass-strong text-brand-dark dark:text-white hover:brightness-[1.03]",
  ghost:
    "text-brand-dark/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10",
  danger:
    "bg-red-500/90 text-white shadow-lg shadow-red-500/20 hover:bg-red-500",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5 rounded-xl",
  md: "h-11 px-5 text-sm gap-2 rounded-2xl",
  lg: "h-14 px-6 text-[15px] gap-2.5 rounded-2xl",
};

export function buttonClass(options?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  const { variant = "primary", size = "md", fullWidth, className } = options ?? {};
  return cn(
    "inline-flex select-none items-center justify-center font-semibold tracking-tight",
    "transition-[transform,filter,background-color] duration-150 ease-out",
    "active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full",
    className,
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClass({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle size={size === "sm" ? 15 : 17} className="animate-spin" /> : null}
      {children}
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle size={18} className={cn("animate-spin", className)} />;
}
