export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-white/55 shadow-2xl shadow-black/10 backdrop-blur-2xl dark:bg-black/45 dark:shadow-black/70">
      <div aria-hidden="true" className="app-backdrop pointer-events-none absolute inset-0" />
      <main
        data-app-scroll
        className="relative z-10 flex flex-1 flex-col overflow-y-auto overscroll-contain scrollbar-hide"
      >
        {children}
      </main>
    </div>
  );
}
