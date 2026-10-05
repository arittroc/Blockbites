"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

export type ThemeChoice = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "bb.theme";
const THEME_EVENT = "bb:theme-change";

/**
 * Inlined at the top of <body> so the theme class is stamped before anything
 * paints. Keep this string in sync with `applyTheme` below.
 */
export const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=s?s==="dark":m;var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

function applyTheme(choice: ThemeChoice) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = choice === "dark" || (choice === "system" && prefersDark);
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
  return isDark;
}

/** The DOM owns the resolved theme, so observation beats duplicated state. */
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

function readChoice(): ThemeChoice {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

function readIsDark() {
  return document.documentElement.classList.contains("dark");
}

interface ThemeValue {
  theme: ThemeChoice;
  isDark: boolean;
  setTheme: (theme: ThemeChoice) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeToTheme, readChoice, () => "system" as ThemeChoice);
  const isDark = useSyncExternalStore(subscribeToTheme, readIsDark, () => false);

  // While the choice is "system", follow OS changes by updating the DOM only —
  // the observers above pick the change up and re-render.
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: ThemeChoice) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const cycleTheme = useCallback(() => {
    setTheme(theme === "system" ? "dark" : theme === "dark" ? "light" : "system");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, isDark, setTheme, cycleTheme }),
    [theme, isDark, setTheme, cycleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}
