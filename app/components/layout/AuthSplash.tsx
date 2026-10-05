import { LoaderCircle } from "lucide-react";

/** Branded hold state while the session is read from localStorage. */
export default function AuthSplash() {
  return (
    <div className="relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-white/55 shadow-2xl shadow-black/10 backdrop-blur-2xl dark:bg-black/45 dark:shadow-black/70">
      <div aria-hidden="true" className="app-backdrop pointer-events-none absolute inset-0" />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4">
        <span className="grid size-16 place-items-center rounded-[1.75rem] bg-gradient-to-br from-brand-orange to-brand-orange-strong text-3xl shadow-xl shadow-orange-500/30">
          🍲
        </span>
        <LoaderCircle size={20} className="animate-spin text-brand-orange" />
      </div>
    </div>
  );
}
