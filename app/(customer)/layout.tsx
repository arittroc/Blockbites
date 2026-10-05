import AppShell from "@/app/components/layout/AppShell";
import AuthGate from "@/app/components/layout/AuthGate";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
