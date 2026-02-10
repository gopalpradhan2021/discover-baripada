import { Platform } from "react-native";

export const colors = {
  background: "#F7F1E8",
  surface: "#FFF8EE",
  ink: "#1A1A1A",
  inkMuted: "#5A5A5A",
  accent: "#D98C5F",
  accentDeep: "#B7653E",
  border: "#E7DDCF",
  tabBar: "#141414",
  tabBarActive: "#F7F1E8",
  tabBarInactive: "#8E8E8E",
  ripple: "rgba(0, 0, 0, 0.08)",
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

export const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 3 },
  default: {},
});
