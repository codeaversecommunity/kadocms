"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";

const COOKIE_NAME = "active_theme";
const DEFAULT_THEME = "default";

function setThemeCookie(theme: string) {
  if (typeof window === "undefined") return;

  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`;
}

type ThemeContextType = {
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within a ThemeProvider");
  }
  return context;
}

export default function ThemeProvider({
  children,
  initialTheme,
  ...props
}: ThemeProviderProps & {
  initialTheme?: string;
}) {
  const [activeTheme, setActiveTheme] = useState<string>(
    () => initialTheme || DEFAULT_THEME
  );

  useEffect(() => {
    setThemeCookie(activeTheme);

    Array.from(document.body.classList)
      .filter((className) => className.startsWith("theme-"))
      .forEach((className) => {
        document.body.classList.remove(className);
      });
    document.body.classList.add(`theme-${activeTheme}`);
    if (activeTheme.endsWith("-scaled")) {
      document.body.classList.add("theme-scaled");
    }
  }, [activeTheme]);

  return (
    <NextThemesProvider {...props}>
      <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}
