import React, { createContext, useContext, useMemo } from "react";

import { getTheme } from "@/constants/theme";

type Theme = ReturnType<typeof getTheme>;

const ThemeContext = createContext<Theme | null>(null);

type ThemeProviderProps = {
  scheme: "light" | "dark" | null | undefined;
  children: React.ReactNode;
};

export function ThemeProvider({ scheme, children }: ThemeProviderProps) {
  const value = useMemo(() => getTheme(scheme), [scheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
