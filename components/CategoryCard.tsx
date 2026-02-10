import React, { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, shadow, spacing } from "@/constants/theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface CategoryCardProps {
  title: string;
  subtitle?: string;
  icon: IconName;
  color: string;
  onPress: () => void;
}

const CategoryCard = memo(function CategoryCard({
  title,
  subtitle,
  icon,
  color,
  onPress,
}: CategoryCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: color },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      android_ripple={{ color: colors.ripple }}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
    >
      <View style={styles.inner}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={20} color={colors.accentDeep} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.m,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  inner: { flexDirection: "row", alignItems: "center" },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textWrap: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700", color: colors.ink },
  subtitle: { marginTop: 2, color: colors.inkMuted, fontSize: 12 },
});

export default CategoryCard;
