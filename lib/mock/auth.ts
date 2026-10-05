import type { AuthSession, AuthUser } from "@/lib/types";

/**
 * Mock auth backend. The exported surface mirrors the Supabase calls it will
 * become — `signIn` maps to `supabase.auth.signInWithPassword()` — so swapping
 * the implementation is a one-file change. Note that Supabase's password grant
 * keys off an email address: when the backend lands, either relabel the login
 * field to email or resolve username → email through a `profiles` table lookup.
 */

export interface MockAccount {
  username: string;
  password: string;
  user: AuthUser;
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    username: "arittroc",
    password: "1234",
    user: {
      id: "user_arittroc",
      username: "arittroc",
      name: "Arittroc",
      phone: "+91 98000 11111",
      initials: "AR",
    },
  },
  {
    username: "sourav",
    password: "5678",
    user: {
      id: "user_sourav",
      username: "sourav",
      name: "Sourav",
      phone: "+91 98000 22222",
      initials: "SO",
    },
  },
];

/** Sessions are client-side only until Supabase issues real JWTs. */
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Stand-in for network latency so the submit spinner is visible while mocked. */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function signIn(identifier: string, password: string): Promise<AuthSession> {
  await delay(700);
  const username = identifier.trim().toLowerCase();
  const account = MOCK_ACCOUNTS.find((entry) => entry.username === username);
  if (!account || account.password !== password) {
    // Deliberately vague, the way Supabase reports bad credentials.
    throw new Error("Incorrect username or password. Please try again.");
  }
  return {
    accessToken: `mock_${Math.random().toString(36).slice(2, 12)}`,
    expiresAt: Date.now() + SESSION_TTL_MS,
    user: account.user,
  };
}
