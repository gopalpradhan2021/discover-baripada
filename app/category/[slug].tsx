import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { CategoryList } from "@/components/CategoryList";
import { Screen } from "@/components/Screen";
import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";
import { categories } from "@/data/categories";
import { useRecents } from "@/hooks/useRecents";

export default function CategoryListScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const category = categories.find((item) => item.slug === slug);
  const { colors } = useTheme();
  const { recordCategory } = useRecents();

  const styles = StyleSheet.create({
    header: {
      padding: spacing.m,
      borderRadius: radius.l,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: spacing.s,
    },
    backText: {
      color: colors.ink,
      fontFamily: typography.bodySemibold,
      fontSize: 13,
    },
    title: {
      fontSize: 24,
      fontFamily: typography.heading,
      color: colors.ink,
    },
    subtitle: {
      marginTop: spacing.s,
      color: colors.inkMuted,
      fontSize: 14,
      lineHeight: 20,
      fontFamily: typography.body,
    },
  });

  useEffect(() => {
    if (category?.slug) {
      recordCategory(category.slug);
    }
  }, [category?.slug, recordCategory]);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={18} color={colors.ink} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{category?.title ?? "Category"}</Text>
        <Text style={styles.subtitle}>{category?.description}</Text>
      </View>
      <CategoryList
        initialCategory={(category?.slug ?? "places") as "places" | "food" | "culture" | "events"}
        onItemPress={(id) => router.push(`/details/${id}`)}
        showHeader={false}
      />
    </Screen>
  );
}
