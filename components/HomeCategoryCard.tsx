import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";

type HomeCategoryCardProps = {
  title: string;
  description: string;
  category?: "places" | "food" | "culture" | "events" | "shopping";
  iconName?: keyof typeof Ionicons.glyphMap;
  backgroundColor?: string;
  backgroundImage?: string;
  height: number;
  onPress: () => void;
};

export function HomeCategoryCard({
  title,
  description,
  category,
  iconName,
  backgroundColor,
  backgroundImage,
  height,
  onPress,
}: HomeCategoryCardProps) {
  const { colors } = useTheme();
  const resolvedIcon =
    iconName ??
    (category === "places"
      ? "map-outline"
      : category === "food"
      ? "restaurant-outline"
      : category === "culture"
      ? "color-palette-outline"
      : category === "events"
      ? "calendar-outline"
      : category === "shopping"
      ? "bag-outline"
      : undefined);

  const styles = StyleSheet.create({
    card: {
      height,
      borderRadius: radius.l,
      padding: spacing.m,
      backgroundColor: backgroundColor ?? colors.surfaceAlt,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.08)",
      justifyContent: "center",
      gap: spacing.xs,
    },
    bgImage: {
      position: "absolute",
      right: -20,
      top: -10,
      width: height * 1.2,
      height: height * 1.2,
      opacity: 0.2,
    },
    iconBadge: {
      position: "absolute",
      top: spacing.s,
      right: spacing.s,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "rgba(255,255,255,0.9)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.08)",
    },
    iconColor: {
      color: "#2B1B10",
    },
    title: {
      fontSize: 18,
      fontFamily: typography.bodyBold,
      color: "#2B1B10",
    },
    description: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: typography.bodyMedium,
      color: "#3D2A1B",
    },
  });

  return (
    <Pressable onPress={onPress} style={styles.card}>
      {backgroundImage ? (
        <Image source={{ uri: backgroundImage }} style={styles.bgImage} />
      ) : null}
      {resolvedIcon ? (
        <View style={styles.iconBadge}>
          <Ionicons name={resolvedIcon} size={18} color={styles.iconColor.color} />
        </View>
      ) : null}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.description} numberOfLines={1}>
        {description}
      </Text>
    </Pressable>
  );
}
