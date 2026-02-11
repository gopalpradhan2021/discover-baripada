import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { UniversalCategoryCard } from "@/components/UniversalCategoryCard";
import { ExpandableSearch } from "@/components/ExpandableSearch";
import { useFavorites } from "@/components/FavoritesProvider";
import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";
import { categories } from "@/data/categories";
import { categoryItems } from "@/data/categoryItems";
import { useDistances } from "@/hooks/useDistances";
import { sortEventsByDate } from "@/hooks/useEventSorting";
import { useUserLocation } from "@/hooks/useUserLocation";
import { sortOptions, useSortedItems } from "@/hooks/useSortedItems";

type CategorySlug = (typeof categories)[number]["slug"];

type CategoryListProps = {
  initialCategory?: CategorySlug;
  onItemPress?: (id: string) => void;
  titleOverride?: string;
  subtitleOverride?: string;
  showHeader?: boolean;
};

export function CategoryList({
  initialCategory = "places",
  onItemPress,
  titleOverride,
  subtitleOverride,
  showHeader = true,
}: CategoryListProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { colors } = useTheme();
  const { latitude, longitude, loading, error } = useUserLocation();
  const [activeCategory, setActiveCategory] =
    useState<CategorySlug>(initialCategory);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<(typeof sortOptions)[number]["key"]>(
    "az"
  );

  useEffect(() => {
    if (activeCategory === "events") {
      setSortKey("default");
    } else if (sortKey === "default") {
      setSortKey("az");
    }
  }, [activeCategory, sortKey]);

  const category = useMemo(
    () => categories.find((item) => item.slug === activeCategory),
    [activeCategory]
  );

  const items = useMemo(() => {
    const list = categoryItems[activeCategory] ?? [];
    const ordered =
      activeCategory === "events" ? sortEventsByDate(list) : list;
    if (!query.trim()) return ordered;
    const needle = query.trim().toLowerCase();
    return ordered.filter((item) => item.name.toLowerCase().includes(needle));
  }, [activeCategory, query]);

  const distances = useDistances(items, latitude, longitude);
  const sortedItems = useSortedItems(
    items,
    sortKey,
    distances,
    !loading && !error
  );

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
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: spacing.s,
        },
        searchWrap: {
          alignItems: "flex-end",
          width: 170,
        },
        title: {
          fontSize: 24,
          fontFamily: typography.heading,
          color: colors.ink,
        },
        subtitle: {
          color: colors.inkMuted,
          fontSize: 14,
          lineHeight: 20,
          fontFamily: typography.body,
        },
        helperText: {
          marginTop: spacing.s,
          color: colors.inkMuted,
          fontSize: 12,
          fontFamily: typography.body,
        },
        sortRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing.s,
        },
        filterChip: {
          paddingHorizontal: spacing.s,
          paddingVertical: 8,
          borderRadius: radius.s,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
        filterChipActive: {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        },
        filterChipDisabled: {
          opacity: 0.5,
        },
        filterText: {
          fontSize: 12,
          fontFamily: typography.bodySemibold,
          color: colors.inkMuted,
        },
        filterTextActive: {
          color: colors.surface,
        },
        filterTextDisabled: {
          color: colors.inkMuted,
        },
        card: {
          marginTop: spacing.m,
        },
      }),
    [colors]
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {showHeader && (
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{titleOverride ?? category?.title}</Text>
              <Text style={styles.subtitle}>
                {subtitleOverride ?? category?.description}
              </Text>
            </View>
            <View style={styles.searchWrap}>
              <ExpandableSearch value={query} onChange={setQuery} placeholder="Search..." />
            </View>
          </View>
        </View>
      )}
      {loading && (
        <Text style={styles.helperText}>Getting your location...</Text>
      )}
      {!!error && (
        <Text style={styles.helperText}>
          Location permission denied. Distances are hidden.
        </Text>
      )}

      <View style={styles.sortRow}>
        {sortOptions.map((option) => {
          const active = option.key === sortKey;
          const disabled = option.key === "nearest" && (!!error || loading);
          return (
            <Pressable
              key={option.key}
              onPress={() => setSortKey(option.key)}
              disabled={disabled}
              style={[
                styles.filterChip,
                active && styles.filterChipActive,
                disabled && styles.filterChipDisabled,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  active && styles.filterTextActive,
                  disabled && styles.filterTextDisabled,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {sortedItems.map((item) => (
        <View key={item.id} style={styles.card}>
          <UniversalCategoryCard
            id={item.id}
            category={activeCategory}
            title={item.name}
            image={item.image}
            description={item.description}
            rating={undefined}
            locationCoords={
              item.latitude != null && item.longitude != null
                ? { latitude: item.latitude, longitude: item.longitude }
                : undefined
            }
            openHours={item.openHours}
            foodType={item.foodType}
            eventDate={item.date}
            venue={item.venue}
            isBookmarked={isFavorite(item.id)}
          />
        </View>
      ))}
    </ScrollView>
  );
}
