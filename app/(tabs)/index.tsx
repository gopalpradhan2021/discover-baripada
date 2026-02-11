import { useCallback, useMemo, useEffect, useRef, useState } from "react";
import { Animated, FlatList, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { HomeCategoryCard } from "@/components/HomeCategoryCard";
import { HeroCard, type HeroSlide } from "@/components/HeroCard";
import { WeatherCard } from "@/components/WeatherCard";
import { PlaceCard } from "@/components/PlaceCard";
import { Screen } from "@/components/Screen";
import { useFavorites } from "@/components/FavoritesProvider";
import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";
import { categories } from "@/data/categories";
import { categoryItems } from "@/data/categoryItems";
import { getItemById, getItemsByIds } from "@/data/items";
import { useDistances } from "@/hooks/useDistances";
import { useSortedItems } from "@/hooks/useSortedItems";
import { useUserLocation } from "@/hooks/useUserLocation";
import {
  getTodayEvents,
  getUpcomingEvents,
  getWeekendEvents,
  sortByDateAsc,
} from "@/utils/eventDates";
import { useRecents } from "@/hooks/useRecents";
import { mapWeatherCode, weatherLabel, type WeatherKind } from "@/utils/weather";

export default function HomeScreen() {
  const router = useRouter();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { latitude, longitude, loading, error } = useUserLocation();
  const { colors } = useTheme();
  const { latest } = useRecents();
  const { width } = useWindowDimensions();
  const heroSlides = useMemo<HeroSlide[]>(
    () => [
      {
        id: "slide-1",
        kicker: "Discover Baripada",
        title: "Explore culture & heritage",
        subtitle: "Start with a category or browse highlights curated for today.",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1600",
        route: "/category/places",
      },
      {
        id: "slide-2",
        kicker: "Local Favorites",
        title: "Markets, temples, and parks",
        subtitle: "Handpicked picks for slow mornings and sunset walks.",
        image:
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1600",
        route: "/category/food",
      },
      {
        id: "slide-3",
        kicker: "Culture & Events",
        title: "Celebrate living traditions",
        subtitle: "Plan your weekend with Baripada’s festivals and heritage.",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1600",
        route: "/category/events",
      },
    ],
    []
  );
  const [weather, setWeather] = useState<{
    kind: WeatherKind | null;
    tempC: number | null;
    error: string | null;
  }>({ kind: null, tempC: null, error: null });
  const sectionAnims = useRef(
    Array.from({ length: 9 }, () => ({
      opacity: new Animated.Value(0),
      translate: new Animated.Value(8),
    }))
  ).current;
  

  const handlePress = useCallback(
    (slug: (typeof categories)[number]["slug"]) => {
      router.push(`/category/${slug}`);
    },
    [router]
  );

  const highlights = useMemo(
    () => [
      ...categoryItems.places.slice(0, 2),
      ...categoryItems.food.slice(0, 2),
      ...categoryItems.culture.slice(0, 2),
      ...categoryItems.events.slice(0, 2),
    ],
    []
  );

  const highlightDistances = useDistances(highlights, latitude, longitude);
  const suggestedItems = useMemo(() => {
    if (weather.kind === "rainy") {
      return [
        ...categoryItems.food.slice(0, 3),
        ...categoryItems.culture.slice(0, 2),
      ];
    }
    return categoryItems.places.slice(0, 5);
  }, [weather.kind]);
  const suggestedDistances = useDistances(suggestedItems, latitude, longitude);
  const nearYouSorted = useSortedItems(
    categoryItems.places,
    "nearest",
    useDistances(categoryItems.places, latitude, longitude),
    !loading && !error
  );
  const nearYou = useMemo(() => nearYouSorted.slice(0, 5), [nearYouSorted]);
  const nearYouDistances = useDistances(nearYou, latitude, longitude);

  const sortedEvents = useMemo(
    () => sortByDateAsc(categoryItems.events),
    []
  );
  const todayEvents = useMemo(() => getTodayEvents(sortedEvents), [sortedEvents]);
  const weekendEvents = useMemo(
    () => getWeekendEvents(sortedEvents),
    [sortedEvents]
  );
  const upcomingFallback = useMemo(
    () => getUpcomingEvents(sortedEvents).slice(0, 5),
    [sortedEvents]
  );
  const todayList = todayEvents.length > 0 ? todayEvents : upcomingFallback;

  const continueItems = useMemo(
    () =>
      latest
        .map((entry) => {
          if (entry.type === "item") {
            const item = getItemById(entry.id);
            return item ? { type: "item" as const, item } : null;
          }
          const category = categories.find((c) => c.slug === entry.id);
          return category ? { type: "category" as const, category } : null;
        })
        .filter(
          (
            entry
          ): entry is
            | { type: "item"; item: ReturnType<typeof getItemById> }
            | { type: "category"; category: (typeof categories)[number] } =>
            entry !== null
        )
        .slice(0, 3),
    [latest]
  );

  const favoritesList = useMemo(
    () => getItemsByIds(favorites).slice(0, 4),
    [favorites]
  );

  useEffect(() => {
    if (latitude == null || longitude == null) return;
    const controller = new AbortController();
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
      `&longitude=${longitude}&current=temperature_2m,precipitation,weather_code&timezone=auto`;
    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const code = data?.current?.weather_code;
        const temp = data?.current?.temperature_2m;
        if (typeof code !== "number") {
          setWeather({ kind: null, tempC: null, error: "Weather unavailable" });
          return;
        }
        setWeather({
          kind: mapWeatherCode(code),
          tempC: typeof temp === "number" ? temp : null,
          error: null,
        });
      })
      .catch(() => {
        setWeather({ kind: null, tempC: null, error: "Weather unavailable" });
      });
    return () => controller.abort();
  }, [latitude, longitude]);

  const cardGap = spacing.m;
  const sectionGap = spacing.m;
  const horizontalPadding = spacing.l;
  const cardWidth = Math.floor((width - horizontalPadding * 2 - cardGap) / 2);
  const cardHeight = 94;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        content: {
          paddingTop: spacing.l,
          paddingBottom: spacing.xl,
          gap: sectionGap,
        },
        notice: {
          paddingHorizontal: spacing.s,
        },
        noticeText: {
          color: colors.inkMuted,
          fontSize: 12,
          fontFamily: typography.body,
        },
        grid: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: sectionGap,
          justifyContent: "flex-start",
        },
        gridItem: {
          width: cardWidth,
          height: cardHeight,
        },
        section: {
          gap: sectionGap,
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
          gap: sectionGap,
        },
        carouselCard: {
          width: 220,
        },
        emptyFavorites: {
          padding: spacing.m,
          borderRadius: radius.l,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          gap: spacing.s,
        },
        emptyFavoritesTitle: {
          fontSize: 16,
          fontFamily: typography.bodySemibold,
          color: colors.ink,
        },
        emptyFavoritesSubtitle: {
          color: colors.inkMuted,
          fontSize: 13,
          fontFamily: typography.body,
        },
        emptyFavoritesCta: {
          marginTop: spacing.s,
          paddingVertical: 10,
          borderRadius: radius.s,
          backgroundColor: colors.accent,
          alignItems: "center",
        },
        emptyFavoritesCtaText: {
          color: colors.surface,
          fontFamily: typography.bodySemibold,
        },
      }),
    [colors, cardGap, cardWidth, cardHeight]
  );

  useEffect(() => {
    const animations = sectionAnims.flatMap((anim) => [
      Animated.timing(anim.opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(anim.translate, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]);
    Animated.stagger(80, animations).start();
  }, [sectionAnims]);

  

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: sectionAnims[0].opacity,
            transform: [{ translateY: sectionAnims[0].translate }],
          }}
        >
          <View style={styles.section}>
            <HeroCard slides={heroSlides} />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: sectionAnims[1].opacity,
            transform: [{ translateY: sectionAnims[1].translate }],
          }}
        >
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
        </Animated.View>

        <Animated.View
          style={{
            opacity: sectionAnims[2].opacity,
            transform: [{ translateY: sectionAnims[2].translate }],
          }}
        >
          <View style={styles.section}>
            <WeatherCard
              locationName="Baripada"
              temperatureC={weather.tempC}
              condition={weather.kind}
              errorMessage={
                error
                  ? "Enable location to see local weather."
                  : weather.error
                  ? "Weather unavailable."
                  : null
              }
            />
            <HomeCategoryCard
              title="Baripada Stories"
              description="History, culture & untold facts"
              iconName="book-outline"
              backgroundColor="#F5A15B"
              backgroundImage="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200"
              height={cardHeight}
              onPress={() => router.push("/stories")}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: sectionAnims[3].opacity,
            transform: [{ translateY: sectionAnims[3].translate }],
          }}
        >
          <View style={styles.grid}>
            {categories.map((item) => (
              <View key={item.slug} style={styles.gridItem}>
                <HomeCategoryCard
                  title={item.title}
                  description={item.description}
                  category={item.slug}
                  backgroundColor={item.color}
                  height={cardHeight}
                  onPress={() => handlePress(item.slug)}
                />
              </View>
            ))}
            <View key="essentials" style={styles.gridItem}>
              <HomeCategoryCard
                title="Essentials"
                description="Services, transport, and helpers."
                iconName="grid-outline"
                backgroundColor="#E6F1F4"
                height={cardHeight}
                onPress={() => router.push("/essentials")}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: sectionAnims[4].opacity,
            transform: [{ translateY: sectionAnims[4].translate }],
          }}
        >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {weather.kind ? `Because it's ${weatherLabel(weather.kind)}` : "Popular in Baripada"}
            </Text>
            <Text style={styles.sectionHint}>Nearby highlights</Text>
          </View>
          <FlatList
            data={weather.kind ? suggestedItems : highlights}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            renderItem={({ item, index }) => (
              <View style={styles.carouselCard}>
                <PlaceCard
                  place={item}
                  onPress={() => router.push(`/details/${item.id}`)}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  distanceKm={
                    weather.kind
                      ? suggestedDistances[item.id] ?? null
                      : highlightDistances[item.id] ?? null
                  }
                  animateOnMount
                  animationDelay={index * 60}
                />
              </View>
            )}
          />
        </View>
        </Animated.View>

        {continueItems.length > 0 && (
          <Animated.View
            style={{
              opacity: sectionAnims[4].opacity,
              transform: [{ translateY: sectionAnims[4].translate }],
            }}
          >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Continue Exploring</Text>
              <Text style={styles.sectionHint}>Recently viewed</Text>
            </View>
            <FlatList
              data={continueItems}
              horizontal
              keyExtractor={(entry) =>
                entry.type === "item" ? entry.item.id : entry.category.slug
              }
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
              renderItem={({ item: entry }) => (
                <View style={styles.carouselCard}>
                  {entry.type === "item" ? (
                    <PlaceCard
                      place={entry.item}
                      onPress={() => router.push(`/details/${entry.item.id}`)}
                      isFavorite={isFavorite(entry.item.id)}
                      onToggleFavorite={() => toggleFavorite(entry.item.id)}
                    />
                  ) : (
                    <HomeCategoryCard
                      title={entry.category.title}
                      description={entry.category.description}
                      category={entry.category.slug}
                      backgroundColor={entry.category.color}
                      height={cardHeight}
                      onPress={() => handlePress(entry.category.slug)}
                    />
                  )}
                </View>
              )}
            />
          </View>
          </Animated.View>
        )}

          <Animated.View
            style={{
              opacity: sectionAnims[5].opacity,
              transform: [{ translateY: sectionAnims[5].translate }],
            }}
          >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Favorites</Text>
            <Text style={styles.sectionHint}>Saved picks</Text>
          </View>
          {favoritesList.length === 0 ? (
            <View style={styles.emptyFavorites}>
              <Text style={styles.emptyFavoritesTitle}>No favorites yet</Text>
              <Text style={styles.emptyFavoritesSubtitle}>
                Tap the heart on any place to save it here.
              </Text>
              <Pressable
                onPress={() => handlePress("places")}
                style={styles.emptyFavoritesCta}
              >
                <Text style={styles.emptyFavoritesCtaText}>Explore places</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={favoritesList}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
              renderItem={({ item }) => (
                <View style={styles.carouselCard}>
                  <PlaceCard
                    place={item}
                    onPress={() => router.push(`/details/${item.id}`)}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                  />
                </View>
              )}
            />
          )}
        </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: sectionAnims[6].opacity,
            transform: [{ translateY: sectionAnims[6].translate }],
          }}
        >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Near You</Text>
            <Text style={styles.sectionHint}>Closest places</Text>
          </View>
          {loading && (
            <Text style={styles.noticeText}>Getting your location...</Text>
          )}
          {!!error && (
            <Text style={styles.noticeText}>
              Location permission denied. Turn it on to see nearby places.
            </Text>
          )}
          {!loading && !error && (
            <FlatList
              data={nearYou}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
              renderItem={({ item }) => (
                <View style={styles.carouselCard}>
                  <PlaceCard
                    place={item}
                    onPress={() => router.push(`/details/${item.id}`)}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                    distanceKm={nearYouDistances[item.id] ?? null}
                  />
                </View>
              )}
            />
          )}
        </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: sectionAnims[7].opacity,
            transform: [{ translateY: sectionAnims[7].translate }],
          }}
        >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Highlights</Text>
            <Text style={styles.sectionHint}>
              {todayEvents.length > 0 ? "Happening today" : "Upcoming events"}
            </Text>
          </View>
          <FlatList
            data={todayList}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            renderItem={({ item }) => (
              <View style={styles.carouselCard}>
                <PlaceCard
                  place={item}
                  onPress={() => router.push(`/details/${item.id}`)}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                />
              </View>
            )}
          />
        </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: sectionAnims[8].opacity,
            transform: [{ translateY: sectionAnims[8].translate }],
          }}
        >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Weekend</Text>
            <Text style={styles.sectionHint}>Plan ahead</Text>
          </View>
          {weekendEvents.length === 0 ? (
            <Text style={styles.noticeText}>No events scheduled this weekend.</Text>
          ) : (
            <FlatList
              data={weekendEvents}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
              renderItem={({ item }) => (
                <View style={styles.carouselCard}>
                  <PlaceCard
                    place={item}
                    onPress={() => router.push(`/details/${item.id}`)}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                  />
                </View>
              )}
            />
          )}
        </View>
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}
