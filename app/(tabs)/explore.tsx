import { useMemo } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { PlaceCard } from "@/components/PlaceCard";
import { Screen } from "@/components/Screen";
import { useFavorites } from "@/components/FavoritesProvider";
import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";
import { categoryItems } from "@/data/categoryItems";
import { useDistances } from "@/hooks/useDistances";
import { useUserLocation } from "@/hooks/useUserLocation";

export default function ExploreScreen() {
  const router = useRouter();
  const { latitude, longitude, loading, error } = useUserLocation();
  const { colors } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  const nearbyItems = useMemo(() => categoryItems.places.slice(0, 6), []);
  const foodItems = useMemo(() => categoryItems.food.slice(0, 6), []);
  const cultureItems = useMemo(() => categoryItems.culture.slice(0, 6), []);
  const eventItems = useMemo(() => categoryItems.events.slice(0, 6), []);

  const nearbyDistances = useDistances(nearbyItems, latitude, longitude);
  const foodDistances = useDistances(foodItems, latitude, longitude);
  const cultureDistances = useDistances(cultureItems, latitude, longitude);
  const eventDistances = useDistances(eventItems, latitude, longitude);

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
        },
        notice: {
          paddingHorizontal: spacing.s,
        },
        noticeText: {
          color: colors.inkMuted,
          fontSize: 12,
          fontFamily: typography.body,
        },
        kicker: {
          color: colors.accentDeep,
          fontSize: 12,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontFamily: typography.bodySemibold,
        },
        title: {
          marginTop: spacing.s,
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
        section: {
          gap: spacing.s,
        },
        sectionHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: spacing.s,
        },
        sectionTitle: {
          fontSize: 16,
          fontFamily: typography.bodySemibold,
          color: colors.ink,
        },
        sectionHint: {
          fontSize: 12,
          fontFamily: typography.bodyMedium,
          color: colors.inkMuted,
        },
        carousel: {
          paddingHorizontal: spacing.s,
          gap: spacing.m,
        },
        carouselCard: {
          width: 220,
        },
      }),
    [colors]
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Explore Baripada</Text>
          <Text style={styles.title}>Discover what the city feels like today.</Text>
          <Text style={styles.subtitle}>
            Curated picks across places, food, culture, and events.
          </Text>
        </View>

        <View style={styles.notice}>
          {loading && (
            <Text style={styles.noticeText}>Getting your location...</Text>
          )}
          {!!error && (
            <Text style={styles.noticeText}>
              Location permission denied. Distances are hidden.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Places</Text>
            <Text style={styles.sectionHint}>Quick escapes</Text>
          </View>
          <FlatList
            data={nearbyItems}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            renderItem={({ item, index }) => (
              <View style={styles.carouselCard}>
                <PlaceCard
                  place={item}
                  onPress={() => router.push(`/details/${item.id}`)}
                  distanceKm={nearbyDistances[item.id] ?? null}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  animateOnMount
                  animationDelay={index * 60}
                />
              </View>
            )}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Food Spots</Text>
            <Text style={styles.sectionHint}>Local favorites</Text>
          </View>
          <FlatList
            data={foodItems}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            renderItem={({ item, index }) => (
              <View style={styles.carouselCard}>
                <PlaceCard
                  place={item}
                  onPress={() => router.push(`/details/${item.id}`)}
                  distanceKm={foodDistances[item.id] ?? null}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  animateOnMount
                  animationDelay={index * 60}
                />
              </View>
            )}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cultural Highlights</Text>
            <Text style={styles.sectionHint}>Heritage + arts</Text>
          </View>
          <FlatList
            data={cultureItems}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            renderItem={({ item, index }) => (
              <View style={styles.carouselCard}>
                <PlaceCard
                  place={item}
                  onPress={() => router.push(`/details/${item.id}`)}
                  distanceKm={cultureDistances[item.id] ?? null}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  animateOnMount
                  animationDelay={index * 60}
                />
              </View>
            )}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <Text style={styles.sectionHint}>Plan ahead</Text>
          </View>
          <FlatList
            data={eventItems}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            renderItem={({ item, index }) => (
              <View style={styles.carouselCard}>
                <PlaceCard
                  place={item}
                  onPress={() => router.push(`/details/${item.id}`)}
                  distanceKm={eventDistances[item.id] ?? null}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  animateOnMount
                  animationDelay={index * 60}
                />
              </View>
            )}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
