"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  LogOut,
  Monitor,
  Moon,
  MapPin,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Sun,
  Tag,
  Wallet,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import { ADDRESSES, PROMO_CODES } from "@/lib/mock/data";
import { formatINR } from "@/lib/format";
import { useAppStore } from "@/lib/store/app-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { useTheme, type ThemeChoice } from "@/app/components/layout/ThemeProvider";
import { cn } from "@/lib/utils";

const THEME_OPTIONS: Array<{ id: ThemeChoice; label: string; icon: typeof Sun }> = [
  { id: "system", label: "System", icon: Monitor },
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
];

export default function ProfilePage() {
  const router = useRouter();
  const { orders, cartCount, resetDemo } = useAppStore();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuthStore();

  // The auth gate above guarantees a user; this only narrows the type.
  if (!user) return null;

  return (
    <div className="flex w-full flex-col">
      <PageHeader title="Profile" subtitle="Account, theme and saved addresses" />

      <div className="space-y-4 p-4 pb-28">
        <GlassCard className="flex items-center gap-4 p-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-brand-orange-soft to-brand-orange-strong text-lg font-bold text-white">
            {user.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold tracking-tight text-brand-dark dark:text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-brand-muted dark:text-gray-400">
              @{user.username} · {user.phone}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge tone="success">
                <ShieldCheck size={11} /> Verified
              </Badge>
              {cartCount > 0 ? <Badge tone="brand">{cartCount} in cart</Badge> : null}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <SectionHeader title="Appearance" subtitle="Glass theme follows your device by default" />
          <div className="flex gap-2">
            {THEME_OPTIONS.map((option) => {
              const Icon = option.icon;
              const active = theme === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTheme(option.id)}
                  className={cn(
                    "flex h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl text-xs font-semibold transition active:scale-[0.97]",
                    active
                      ? "bg-gradient-to-b from-brand-orange to-brand-orange-strong text-white shadow-lg shadow-orange-500/25"
                      : "border border-black/8 bg-white/50 text-brand-dark dark:border-white/10 dark:bg-white/5 dark:text-white",
                  )}
                >
                  <Icon size={15} /> {option.label}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-3 p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-black/5 text-brand-orange dark:bg-white/10">
            <Wallet size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-brand-dark dark:text-white">BlockBites wallet</p>
            <p className="truncate text-xs text-brand-muted dark:text-gray-400">
              Balance {formatINR(1240)} · refunds land here instantly
            </p>
          </div>
          <Badge tone="glass">Mock</Badge>
        </GlassCard>

        <div>
          <SectionHeader title="Saved addresses" subtitle="Tap an address at checkout to switch" />
          <GlassCard className="divide-y divide-black/5 dark:divide-white/10">
            {ADDRESSES.map((address) => (
              <div key={address.id} className="flex items-center gap-3 p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-black/5 text-gray-500 dark:bg-white/10 dark:text-gray-400">
                  <MapPin size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-dark dark:text-white">{address.label}</p>
                  <p className="truncate text-xs text-brand-muted dark:text-gray-400">
                    {address.line1}, {address.area}
                  </p>
                </div>
                <Badge tone="neutral">{address.distanceKm.toFixed(1)} km</Badge>
              </div>
            ))}
          </GlassCard>
        </div>

        <div>
          <SectionHeader title="Offers for you" subtitle="Apply these in the cart" />
          <GlassCard className="divide-y divide-black/5 dark:divide-white/10">
            {PROMO_CODES.map((promo) => (
              <div key={promo.code} className="flex items-center gap-3 p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-orange/12 text-brand-orange">
                  <Tag size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-dark dark:text-white">{promo.code}</p>
                  <p className="truncate text-xs text-brand-muted dark:text-gray-400">{promo.label}</p>
                </div>
                <Badge tone="brand">Min {formatINR(promo.minOrder)}</Badge>
              </div>
            ))}
          </GlassCard>
        </div>

        <Link
          href="/tracking"
          className="glass flex items-center gap-3 rounded-3xl p-4 transition active:scale-[0.99]"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-black/5 text-brand-orange dark:bg-white/10">
            <ReceiptText size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-brand-dark dark:text-white">Your orders</span>
            <span className="block truncate text-xs text-brand-muted dark:text-gray-400">
              {orders.length > 0 ? `${orders.length} order${orders.length === 1 ? "" : "s"} on this device` : "Track live and past orders"}
            </span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-gray-400" />
        </Link>

        <Button
          variant="secondary"
          fullWidth
          className="gap-2"
          onClick={() => {
            resetDemo();
            router.push("/home");
          }}
        >
          <RotateCcw size={16} /> Reset demo data
        </Button>

        {/* No redirect here — the auth gate sends signed-out visitors to /login. */}
        <Button variant="danger" fullWidth className="gap-2" onClick={signOut}>
          <LogOut size={16} /> Sign out
        </Button>

        <p className="pb-2 text-center text-[11px] text-brand-muted dark:text-gray-400">
          Signed in as @{user.username} · Supabase auth and Postgres not connected yet
        </p>
      </div>
    </div>
  );
}
