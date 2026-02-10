import { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import CategoryCard from "@/components/CategoryCard";
import { Screen } from "@/components/Screen";
import { colors, radius, spacing } from "@/constants/theme";

const categories = [
  {
    id: "food",
    title: "Food Trails",
    subtitle: "Local favorites",
    icon: "restaurant",
    color: "#FCE8D5",
  },
  {
    id: "culture",
    title: "Culture",
    subtitle: "Crafts and heritage",
    icon: "color-palette",
    color: "#F6E6F0",
  },
  {
    id: "nature",
    title: "Nature",
    subtitle: "Parks and rivers",
    icon: "leaf",
    color: "#E3F3E4",
  },
  {
    id: "events",
    title: "Events",
    subtitle: "Tonight and weekend",
    icon: "calendar",
    color: "#E6F0FA",
  },
];

export default function HomeScreen() {
  const handlePress = useCallback((id: string) => {
    // TODO: Hook up navigation when routes are ready.
    console.log("Category pressed:", id);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: (typeof categories)[number] }) => (
      <CategoryCard
        title={item.title}
        subtitle={item.subtitle}
        icon={item.icon}
        color={item.color}
        onPress={() => handlePress(item.id)}
      />
    ),
    [handlePress]
  );

  return (
    <Screen>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>Discover Baripada</Text>
            <Text style={styles.title}>Plan a day that feels local.</Text>
            <Text style={styles.subtitle}>
              Curated routes, food spots, and culture highlights near you.
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  },
  kicker: {
    color: colors.accentDeep,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  title: {
    marginTop: spacing.s,
    fontSize: 26,
    fontWeight: "800",
    color: colors.ink,
  },
  subtitle: {
    marginTop: spacing.s,
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  row: {
    gap: spacing.m,
  },
  separator: {
    height: spacing.m,
  },
});
