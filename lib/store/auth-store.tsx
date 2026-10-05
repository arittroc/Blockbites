"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { signIn as mockSignIn } from "@/lib/mock/auth";
import type { AuthUser } from "@/lib/types";

const STORAGE_KEY = "bb.session.v1";

interface PersistedSession {
  accessToken: string;
  expiresAt: number;
  user: AuthUser;
}

interface AuthSnapshot {
  /** Flips once localStorage has been read; before that nobody is signed in. */
  hydrated: boolean;
  user: AuthUser | null;
}

const SERVER_SNAPSHOT: AuthSnapshot = { hydrated: false, user: null };

/**
 * Same external-store pattern as the cart: reading the session through
 * `useSyncExternalStore` keeps SSR and the first client render identical while
 * still letting the persisted session win before paint. Replacing this module
 * with `supabase.auth.getSession()` / `onAuthStateChange` is the whole
 * migration when the backend is connected.
 */
let snapshot: AuthSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function readPersisted(): PersistedSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedSession>;
    if (!parsed.user || typeof parsed.user.id !== "string") return null;
    // An expired session counts as signed out.
    if (typeof parsed.expiresAt === "number" && parsed.expiresAt <= Date.now()) return null;
    return {
      accessToken: typeof parsed.accessToken === "string" ? parsed.accessToken : "",
      expiresAt: typeof parsed.expiresAt === "number" ? parsed.expiresAt : 0,
      user: parsed.user,
    };
  } catch {
    // A corrupt or blocked blob means "signed out", never a crash.
    return null;
  }
}

function commit(session: PersistedSession | null) {
  snapshot = { hydrated: true, user: session?.user ?? null };
  try {
    if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode / quota — the in-memory session still works.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!snapshot.hydrated) {
    // React re-reads the snapshot right after subscribing, so adopting the
    // persisted session here is enough to trigger the post-hydration render.
    const persisted = readPersisted();
    snapshot = { hydrated: true, user: persisted?.user ?? null };
  }
  return () => {
    listeners.delete(listener);
  };
}

interface AuthStoreValue {
  hydrated: boolean;
  user: AuthUser | null;
  /** Resolves with the signed-in user, or rejects with a user-facing message. */
  signIn: (identifier: string, password: string) => Promise<AuthUser>;
  signOut: () => void;
}

const AuthStoreContext = createContext<AuthStoreValue | null>(null);

export function AuthStoreProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, () => snapshot, () => SERVER_SNAPSHOT);

  const signIn = useCallback(async (identifier: string, password: string) => {
    const session = await mockSignIn(identifier, password);
    commit(session);
    return session.user;
  }, []);

  const signOut = useCallback(() => commit(null), []);

  const value = useMemo<AuthStoreValue>(
    () => ({ hydrated: state.hydrated, user: state.user, signIn, signOut }),
    [state, signIn, signOut],
  );

  return <AuthStoreContext.Provider value={value}>{children}</AuthStoreContext.Provider>;
}

export function useAuthStore() {
  const context = useContext(AuthStoreContext);
  if (!context) throw new Error("useAuthStore must be used inside <AuthStoreProvider>");
  return context;
}
