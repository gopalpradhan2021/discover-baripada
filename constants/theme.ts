import { Platform } from "react-native";

export const lightColors = {
  background: "#F7F1E8",
  surface: "#FFF8EE",
  surfaceAlt: "#FFFFFF",
  ink: "#1A1A1A",
  inkMuted: "#5A5A5A",
  accent: "#D98C5F",
  accentDeep: "#B7653E",
  border: "#E7DDCF",
  tabBar: "#141414",
  tabBarActive: "#F7F1E8",
  tabBarInactive: "#8E8E8E",
  ripple: "rgba(0, 0, 0, 0.08)",
  overlay: "rgba(0, 0, 0, 0.55)",
  link: "#0A7AFF",
};

export const darkColors = {
  background: "#0F1216",
  surface: "#151A21",
  surfaceAlt: "#1B2230",
  ink: "#F3F4F6",
  inkMuted: "#A7B0BD",
  accent: "#E6A57A",
  accentDeep: "#D28A60",
  border: "#283041",
  tabBar: "#0F1216",
  tabBarActive: "#F3F4F6",
  tabBarInactive: "#8B93A1",
  ripple: "rgba(255, 255, 255, 0.08)",
  overlay: "rgba(15, 18, 22, 0.72)",
  link: "#8CC0FF",
};

export const colors = lightColors;

export const typography = {
  heading: "PlayfairDisplay_600SemiBold",
  headingAlt: "PlayfairDisplay_700Bold",
  body: "Manrope_400Regular",
  bodyMedium: "Manrope_500Medium",
  bodySemibold: "Manrope_600SemiBold",
  bodyBold: "Manrope_700Bold",
};

export const spacing = {
  xs: 6,
  s: 10,
  m: 16,
  l: 24,
  xl: 32,
};

export const radius = {
  s: 10,
  m: 14,
  l: 18,
};

export function getShadow(isDark: boolean) {
  return Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: isDark ? 0.3 : 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    android: { elevation: isDark ? 4 : 3 },
    default: {},
  });
}

export function getTheme(scheme: "light" | "dark" | null | undefined) {
  const isDark = scheme === "dark";
  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
    shadow: getShadow(isDark),
  };
}
