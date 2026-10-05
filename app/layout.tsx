import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, THEME_SCRIPT } from "@/app/components/layout/ThemeProvider";
import { AppStoreProvider } from "@/lib/store/app-store";
import { AuthStoreProvider } from "@/lib/store/auth-store";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "BlockBites · Home-chef meals near you",
  description: "Order fresh home-cooked meals from chefs in your neighbourhood.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f5" },
    { media: "(prefers-color-scheme: dark)", color: "#08090c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans text-brand-dark antialiased dark:text-gray-100">
        {/* Stamps the theme class before anything paints, so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <ThemeProvider>
          <AppStoreProvider>
            <AuthStoreProvider>{children}</AuthStoreProvider>
          </AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
