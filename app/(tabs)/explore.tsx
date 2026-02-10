import { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import PlaceCard from "@/components/PlaceCard";
import { Screen } from "@/components/Screen";
import { colors, radius, spacing } from "@/constants/theme";

const picks = [
  {
    id: "morning",
    name: "Sahu Park",
    type: "Park",
    distanceKm: 1.2,
    tag: "Morning walk",
  },
  {
    id: "market",
    name: "Baripada Bazaar",
    type: "Market",
    distanceKm: 0.8,
    tag: "Local finds",
  },
  {
    id: "temple",
    name: "Jagannath Temple",
    type: "Heritage",
    distanceKm: 2.4,
    tag: "Quiet hour",
  },
];

export default function ExploreScreen() {
  const handlePress = useCallback((id: string) => {
    // TODO: Hook up navigation when routes are ready.
    console.log("Explore pressed:", id);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: (typeof picks)[number] }) => (
      <PlaceCard
        name={item.name}
        type={item.type}
        distanceKm={item.distanceKm}
        tag={item.tag}
        onPress={() => handlePress(item.id)}
      />
    ),
    [handlePress]
  );

  return (
    <Screen>
      <FlatList
        data={picks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>Explore</Text>
            <Text style={styles.title}>What is close and worth it?</Text>
            <Text style={styles.subtitle}>
              A short list of places to step into without planning.
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Themes nearby</Text>
            <View style={styles.tagRow}>
              {["Food", "Culture", "Nature", "Shopping"].map((label) => (
                <View key={label} style={styles.tag}>
                  <Text style={styles.tagText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        }
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
    fontSize: 24,
    fontWeight: "800",
    color: colors.ink,
  },
  subtitle: {
    marginTop: spacing.s,
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  separator: {
    height: spacing.m,
  },
  footer: {
    padding: spacing.m,
    borderRadius: radius.l,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.s,
    marginTop: spacing.s,
  },
  tag: {
    paddingHorizontal: spacing.s,
    paddingVertical: 6,
    borderRadius: radius.s,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FBF4EA",
  },
  tagText: {
    color: colors.inkMuted,
    fontSize: 12,
    fontWeight: "600",
  },
});
