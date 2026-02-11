import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";

import { PlaceCard } from "@/components/PlaceCard";
import { Screen } from "@/components/Screen";
import { useFavorites } from "@/components/FavoritesProvider";
import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";
import { categories } from "@/data/categories";
import { getItemsByIds } from "@/data/items";

export default function FavoritesScreen() {
  const { favorites, isFavorite, toggleFavorite, loading } = useFavorites();
  const items = getItemsByIds(favorites);
  const { colors } = useTheme();
  const grouped = useMemo(() => {
    return categories.map((category) => ({
      category,
      items: items.filter((item) => item.category === category.slug),
    }));
  }, [items]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        content: {
          paddingTop: spacing.l,
          paddingBottom: spacing.xl,
          gap: spacing.m,
        },
        header: {
          padding: spacing.m,
          borderRadius: radius.l,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          gap: spacing.s,
        },
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
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
        headerBadge: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: spacing.s,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: colors.accent,
        },
        headerBadgeText: {
          color: colors.surface,
          fontFamily: typography.bodySemibold,
          fontSize: 12,
        },
        empty: {
          padding: spacing.m,
          borderRadius: radius.l,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          gap: spacing.s,
        },
        emptyIcon: {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.surfaceAlt,
          borderWidth: 1,
          borderColor: colors.border,
        },
        emptyTitle: {
          fontSize: 16,
          fontFamily: typography.bodySemibold,
          color: colors.ink,
        },
        emptySubtitle: {
          marginTop: spacing.s,
          color: colors.inkMuted,
          fontSize: 14,
          lineHeight: 20,
          fontFamily: typography.body,
          textAlign: "center",
        },
        group: {
          gap: spacing.s,
        },
        groupHeader: {
          padding: spacing.m,
          borderRadius: radius.l,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          gap: spacing.s,
        },
        groupTitleRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.s,
        },
        groupIcon: {
          width: 28,
          height: 28,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.surfaceAlt,
          borderWidth: 1,
          borderColor: colors.border,
        },
        groupTitle: {
          fontSize: 18,
          fontFamily: typography.bodySemibold,
          color: colors.ink,
        },
        groupSubtitle: {
          marginTop: spacing.s,
          color: colors.inkMuted,
          fontSize: 13,
          lineHeight: 18,
          fontFamily: typography.body,
        },
        card: {
          marginTop: spacing.s,
        },
      }),
    [colors]
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Favorites</Text>
              <Text style={styles.subtitle}>
                {loading
                  ? "Loading your saved places..."
                  : "Your saved places in one list."}
              </Text>
            </View>
            <View style={styles.headerBadge}>
              <Ionicons name="heart" size={16} color={colors.surface} />
              <Text style={styles.headerBadgeText}>{items.length}</Text>
            </View>
          </View>
        </View>

        {!loading && items.length === 0 && (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="heart-outline" size={26} color={colors.accent} />
            </View>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              No favorites yet. Start exploring!
            </Text>
          </View>
        )}

        {grouped.map(({ category, items: categoryItems }) => {
          if (categoryItems.length === 0) return null;
          return (
            <View key={category.slug} style={styles.group}>
              <View style={styles.groupHeader}>
                <View style={styles.groupTitleRow}>
                  <View style={[styles.groupIcon, styles.groupIconAccent]}>
                    <Ionicons
                      name={
                        category.slug === "places"
                          ? "map"
                          : category.slug === "food"
                          ? "restaurant"
                          : category.slug === "culture"
                          ? "color-palette"
                          : "calendar"
                      }
                      size={16}
                      color={colors.accentDeep}
                    />
                  </View>
                  <Text style={styles.groupTitle}>{category.title}</Text>
                </View>
                <Text style={styles.groupSubtitle}>{category.description}</Text>
              </View>
              {categoryItems.map((item, index) => (
                <View key={item.id} style={styles.card}>
                  <PlaceCard
                    place={item}
                    onPress={() => router.push(`/details/${item.id}`)}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                    animateOnMount
                    animationDelay={index * 50}
                  />
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
