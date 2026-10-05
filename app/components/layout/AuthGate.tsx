"use client";

import { usePathname, useRouter } from "next/navigation";
import AuthSplash from "@/app/components/layout/AuthSplash";
import { useAuthStore } from "@/lib/store/auth-store";
import { useIsoLayoutEffect } from "@/lib/utils";

/**
 * Client-side route guard. The session lives in localStorage (until Supabase
 * issues real cookies), so the check runs after hydration — the gate shows the
 * branded splash meanwhile, which also keeps protected UI from flashing.
 * When Supabase lands, pair this with an optimistic cookie check in `proxy.ts`.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { hydrated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname() ?? "/home";

  useIsoLayoutEffect(() => {
    if (hydrated && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, user, pathname, router]);

  if (!hydrated || !user) return <AuthSplash />;

  return <>{children}</>;
}
