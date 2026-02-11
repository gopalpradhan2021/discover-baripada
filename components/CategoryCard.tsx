import React, { memo, useEffect, useMemo, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";

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
  const { colors, shadow, isDark } = useTheme();
  const textOnPastel = isDark ? "#0E0E0E" : colors.ink;
  const textMutedOnPastel = isDark ? "#2F2F2F" : colors.inkMuted;
  const mountAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(8)).current;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          flex: 1,
          paddingHorizontal: spacing.s,
          paddingVertical: spacing.s,
          minHeight: 72,
          borderRadius: radius.m,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadow,
        },
        pressed: {
          opacity: 0.9,
          transform: [{ scale: 0.96 }],
          borderColor: colors.accent,
        },
        inner: { flexDirection: "row", alignItems: "center" },
        iconWrap: {
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.surfaceAlt,
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.s,
          borderWidth: 1,
          borderColor: colors.border,
        },
        textWrap: { flex: 1 },
        title: {
          fontSize: 15,
          fontFamily: typography.bodySemibold,
          color: textOnPastel,
        },
        subtitle: {
          marginTop: 0,
          color: textMutedOnPastel,
          fontSize: 10,
          fontFamily: typography.body,
        },
      }),
    [colors, shadow, textOnPastel, textMutedOnPastel]
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(mountAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mountAnim, translateAnim]);

  return (
    <Animated.View
      style={{
        opacity: mountAnim,
        transform: [{ translateY: translateAnim }],
      }}
    >
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: color },
          pressed && styles.pressed,
        ]}
        onPress={() => {
          Haptics.selectionAsync();
          onPress();
        }}
        android_ripple={{ color: colors.ripple }}
        accessibilityRole="button"
        accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      >
        <View style={styles.inner}>
          <View style={styles.iconWrap}>
            <Ionicons
              name={icon}
              size={16}
              color={isDark ? "#FFFFFF" : colors.accentDeep}
            />
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
    </Animated.View>
  );
});

export default CategoryCard;
