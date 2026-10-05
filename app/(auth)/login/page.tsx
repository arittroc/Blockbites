"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, LogIn, User, UtensilsCrossed } from "lucide-react";
import AuthSplash from "@/app/components/layout/AuthSplash";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import TextField from "@/components/ui/TextField";
import { MOCK_ACCOUNTS } from "@/lib/mock/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { useIsoLayoutEffect } from "@/lib/utils";

/** Only same-origin paths are honoured, so ?next= can't be used as an open redirect. */
function safeNextPath() {
  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/home";
  return next;
}

export default function LoginPage() {
  const router = useRouter();
  const { hydrated, user, signIn } = useAuthStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Someone with a live session has no business on the login screen.
  useIsoLayoutEffect(() => {
    if (hydrated && user) router.replace(safeNextPath());
  }, [hydrated, user, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (!identifier.trim() || !password) {
      setError("Enter your username and password to continue.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signIn(identifier, password);
      router.replace(safeNextPath());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign you in. Please try again.");
      setSubmitting(false);
    }
  };

  // Hold the splash until the stored session is known, so a signed-in reload
  // never flashes the form before redirecting.
  if (!hydrated || user) return <AuthSplash />;

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-[1.75rem] bg-gradient-to-br from-brand-orange to-brand-orange-strong text-white shadow-xl shadow-orange-500/30">
          <UtensilsCrossed size={28} />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-brand-dark dark:text-white">
          Welcome back
        </h1>
        <p className="mt-1 max-w-[17rem] text-sm text-brand-muted dark:text-gray-400">
          Sign in to order fresh home-cooked meals from chefs near you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400"
          >
            {error}
          </div>
        ) : null}

        <TextField
          label="Username"
          icon={User}
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="arittroc"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
        />

        <TextField
          label="Password"
          icon={Lock}
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="grid size-8 shrink-0 place-items-center rounded-xl text-gray-400 transition hover:text-gray-600 active:scale-90 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
        />

        <Button type="submit" size="lg" fullWidth loading={submitting} className="gap-2">
          <LogIn size={17} /> Sign in
        </Button>
      </form>

      <GlassCard className="mt-6 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-muted dark:text-gray-400">
          Demo accounts · tap to fill
        </p>
        <div className="mt-3 space-y-2">
          {MOCK_ACCOUNTS.map((account) => (
            <button
              key={account.username}
              type="button"
              onClick={() => {
                setIdentifier(account.username);
                setPassword(account.password);
                setError(null);
              }}
              className="flex w-full items-center gap-3 rounded-2xl border border-black/8 bg-white/50 px-3 py-2.5 text-left transition active:scale-[0.98] dark:border-white/10 dark:bg-white/5"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-orange-soft to-brand-orange-strong text-[11px] font-bold text-white">
                {account.user.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-brand-dark dark:text-white">
                  {account.username}
                </span>
                <span className="block text-[11px] text-brand-muted dark:text-gray-400">
                  password · {account.password}
                </span>
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-brand-muted dark:text-gray-400">
        Sign-up is coming soon. Auth is mocked for now — Supabase plugs in behind this screen.
      </p>
    </div>
  );
}
