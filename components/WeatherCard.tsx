import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";
import { type WeatherKind } from "@/utils/weather";

type WeatherCardProps = {
  locationName?: string;
  temperatureC?: number | null;
  condition?: WeatherKind | null;
  errorMessage?: string | null;
};

function getIconName(condition: WeatherKind | null | undefined) {
  switch (condition) {
    case "sunny":
      return "sunny";
    case "cloudy":
      return "cloud";
    case "rainy":
      return "rainy";
    case "stormy":
      return "thunderstorm";
    case "foggy":
      return "cloud-outline";
    default:
      return "cloud";
  }
}

export function WeatherCard({
  locationName = "Baripada",
  temperatureC,
  condition,
  errorMessage,
}: WeatherCardProps) {
  const { colors } = useTheme();
  const iconName = getIconName(condition);
  const conditionLabel =
    condition === "sunny"
      ? "Sunny"
      : condition === "rainy"
      ? "Rainy"
      : condition === "cloudy"
      ? "Cloudy"
      : condition === "stormy"
      ? "Thunderstorm"
      : condition === "foggy"
      ? "Foggy"
      : "Cloudy";

  const styles = StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
      borderRadius: radius.l,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      height: 84,
    },
    left: {
      flex: 1,
      justifyContent: "center",
      gap: 4,
    },
    center: {
      width: 86,
      alignItems: "center",
      justifyContent: "center",
    },
    right: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    location: {
      fontSize: 12,
      fontFamily: typography.bodySemibold,
      color: colors.inkMuted,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    condition: {
      fontSize: 13,
      fontFamily: typography.body,
      color: colors.inkMuted,
    },
    temp: {
      fontSize: 24,
      fontFamily: typography.headingAlt,
      color: colors.ink,
    },
    error: {
      fontSize: 12,
      fontFamily: typography.body,
      color: colors.inkMuted,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.location}>{locationName}</Text>
        <Text style={styles.condition}>
          {errorMessage ? errorMessage : conditionLabel}
        </Text>
      </View>
      <View style={styles.center}>
        <Text style={styles.temp}>
          {temperatureC != null ? `${Math.round(temperatureC)}°C` : "--"}
        </Text>
      </View>
      <View style={styles.right}>
        <Ionicons name={iconName} size={50} color={colors.accent} />
      </View>
    </View>
  );
}
