import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, shadow, spacing } from "@/constants/theme";

interface PlaceCardProps {
  name: string;
  type: string;
  distanceKm: number;
  tag: string;
  onPress: () => void;
}

const PlaceCard = memo(function PlaceCard({
  name,
  type,
  distanceKm,
  tag,
  onPress,
}: PlaceCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      android_ripple={{ color: colors.ripple }}
      accessibilityRole="button"
      accessibilityLabel={`${name}. ${type}. ${distanceKm} kilometers away.`}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{tag}</Text>
        </View>
      </View>
      <Text style={styles.meta}>
        {type} · {distanceKm.toFixed(1)} km away
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: spacing.m,
    borderRadius: radius.m,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  pressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: { fontSize: 16, fontWeight: "700", color: colors.ink },
  badge: {
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    backgroundColor: colors.accent,
    borderRadius: radius.s,
  },
  badgeText: { color: colors.surface, fontSize: 12, fontWeight: "600" },
  meta: { marginTop: 6, color: colors.inkMuted, fontSize: 13 },
});

export default PlaceCard;
