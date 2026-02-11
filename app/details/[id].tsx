import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { Screen } from "@/components/Screen";
import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";
import { getItemById, items } from "@/data/items";
import { useFavorites } from "@/components/FavoritesProvider";
import { useUserLocation } from "@/hooks/useUserLocation";
import { haversineKm } from "@/hooks/useDistances";
import { useRecents } from "@/hooks/useRecents";
import { PlaceCard } from "@/components/PlaceCard";
import { useRatings } from "@/hooks/useRatings";
import { DetailSectionCard } from "@/components/DetailSectionCard";


export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getItemById(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { colors, isDark } = useTheme();
  const { width, height } = useWindowDimensions();
  const { latitude, longitude, loading, error } = useUserLocation();
  const { recordItem } = useRecents();
  const [expanded, setExpanded] = useState(false);
  const mountAnim = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const favorite = item ? isFavorite(item.id) : false;
  const { average, userRating, loading: ratingLoading, rate } = useRatings(item?.id);
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const thanksAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(mountAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mountAnim]);

  useEffect(() => {
    if (item?.id) {
      recordItem(item.id);
    }
  }, [item?.id, recordItem]);

  useEffect(() => {
    setShowRatingPrompt(false);
    setShowThanks(false);
    setSelectedRating(null);
  }, [item?.id]);

  useEffect(() => {
    if (!item?.id || ratingLoading || userRating) return;
    const timer = setTimeout(() => setShowRatingPrompt(true), 9000);
    return () => clearTimeout(timer);
  }, [item?.id, ratingLoading, userRating]);

  useEffect(() => {
    if (!showThanks) return;
    thanksAnim.setValue(1);
    const animation = Animated.sequence([
      Animated.delay(2000),
      Animated.timing(thanksAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]);
    animation.start(() => setShowThanks(false));
  }, [showThanks, thanksAnim]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.15,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [favorite, heartScale]);

  const distanceKm =
    latitude != null &&
    longitude != null &&
    item?.latitude != null &&
    item?.longitude != null
      ? haversineKm(latitude, longitude, item.latitude, item.longitude)
      : null;

  const categoryLabel = item?.category
    ? item.category[0].toUpperCase() + item.category.slice(1)
    : "Place";

  const heroHeight = Math.round(
    Math.max(240, Math.min(height * 0.45, width * 0.6)) * 1.3
  );

  const eventMeta = useMemo(() => {
    if (!item?.date) return null;
    const eventDate = new Date(item.date);
    if (Number.isNaN(eventDate.getTime())) return null;
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfEvent = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );
    const diffMs = startOfEvent.getTime() - startOfToday.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const label =
      daysLeft >= 0 ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left` : "Event ended";
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return { label, formattedDate };
  }, [item?.date]);

  const formattedHours = item?.openHours
    ? `${item.openHours.openTime} - ${item.openHours.closeTime}`
    : "Hours N/A";


  const related = useMemo(() => {
    if (!item) return [];
    return items
      .filter((candidate) => candidate.category === item.category && candidate.id !== item.id)
      .slice(0, 3);
  }, [item]);

  const openInMaps = () => {
    router.push({
      pathname: "/(tabs)/map",
      params: item?.id ? { placeId: item.id } : {},
    });
  };

  const openDirections = () => {
    const query =
      item?.latitude != null && item?.longitude != null
        ? `${item.latitude},${item.longitude}`
        : encodeURIComponent(`${item?.name ?? "Baripada"}`);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    Linking.openURL(url);
  };

  const styles = StyleSheet.create({
    container: {
      paddingBottom: 120,
      gap: spacing.m,
    },
    hero: {
      borderRadius: radius.l,
      overflow: "hidden",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      height: heroHeight,
    },
    heroImage: {
      width,
      height: heroHeight,
      backgroundColor: colors.surfaceAlt,
    },
    heroOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "60%",
    },
    heroContent: {
      position: "absolute",
      left: spacing.m,
      right: spacing.m,
      top: spacing.m,
      bottom: spacing.m,
      justifyContent: "space-between",
    },
    heroTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    heroBottom: {
      gap: spacing.s,
    },
    badge: {
      alignSelf: "flex-start",
      paddingHorizontal: spacing.s,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.18)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.35)",
      marginBottom: spacing.s,
    },
    badgeText: {
      fontSize: 11,
      fontFamily: typography.bodySemibold,
      color: isDark ? "#F3F4F6" : "#FFF8EE",
    },
    heroTitle: {
      fontSize: 26,
      fontFamily: typography.headingAlt,
      color: isDark ? "#F3F4F6" : "#FFF8EE",
    },
    metaRow: {
      flexDirection: "row",
      gap: spacing.s,
      marginTop: spacing.s,
      alignItems: "center",
    },
    metaChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: spacing.s,
      paddingVertical: 6,
      borderRadius: radius.s,
      backgroundColor: "rgba(0,0,0,0.35)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
    metaText: {
      fontSize: 12,
      fontFamily: typography.bodySemibold,
      color: isDark ? "#F3F4F6" : "#FFF8EE",
    },
    ratingCard: {
      padding: spacing.m,
      borderRadius: radius.l,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.s,
    },
    ratingTitle: {
      fontSize: 15,
      fontFamily: typography.bodySemibold,
      color: colors.ink,
    },
    ratingSubtitle: {
      fontSize: 13,
      fontFamily: typography.body,
      color: colors.inkMuted,
    },
    ratingLabel: {
      fontSize: 13,
      fontFamily: typography.bodySemibold,
      color: colors.ink,
    },
    starRow: {
      flexDirection: "row",
      gap: 6,
      marginTop: 6,
    },
    thankYou: {
      fontSize: 12,
      fontFamily: typography.bodySemibold,
      color: colors.accentDeep,
    },
    favoriteChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: spacing.s,
      paddingVertical: 6,
      borderRadius: radius.s,
      backgroundColor: colors.accent,
    },
    favoriteText: {
      color: colors.surface,
      fontFamily: typography.bodySemibold,
      fontSize: 12,
    },
    favoriteButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: "rgba(0,0,0,0.45)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.35)",
    },
    section: {
      padding: spacing.m,
      borderRadius: radius.l,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.s,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: typography.bodySemibold,
      color: colors.ink,
    },
    sectionText: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: typography.body,
      color: colors.inkMuted,
    },
    readMore: {
      color: colors.link,
      fontFamily: typography.bodySemibold,
      fontSize: 12,
    },
    galleryRow: {
      flexDirection: "row",
      gap: spacing.s,
    },
    galleryImage: {
      width: 120,
      height: 90,
      borderRadius: radius.s,
      backgroundColor: colors.surfaceAlt,
    },
    relatedRow: {
      flexDirection: "row",
      gap: spacing.s,
    },
    relatedCard: {
      width: 200,
    },
    actionBar: {
      position: "absolute",
      left: spacing.l,
      right: spacing.l,
      bottom: spacing.l,
      flexDirection: "row",
      gap: spacing.s,
      padding: spacing.s,
      borderRadius: radius.l,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 10,
      borderRadius: radius.s,
    },
    actionText: {
      fontFamily: typography.bodySemibold,
      fontSize: 12,
    },
    actionPressed: {
      transform: [{ scale: 0.96 }],
    },
  });

  if (!item) {
    return (
      <Screen>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item not found</Text>
          <Text style={styles.sectionText}>Please go back and try again.</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.readMore}>Go back</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Animated.View
        style={{
          opacity: mountAnim,
          transform: [{ translateY: mountAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
        }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Image source={{ uri: item.image }} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient
              colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.55)"]}
              style={styles.heroOverlay}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroTopRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{categoryLabel}</Text>
                </View>
                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggleFavorite(item.id);
                  }}
                  style={({ pressed }) => [
                    styles.favoriteButton,
                    pressed && styles.actionPressed,
                  ]}
                  accessibilityLabel={
                    isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                    <Ionicons
                      name={favorite ? "heart" : "heart-outline"}
                      size={16}
                      color="#FFF"
                    />
                  </Animated.View>
                </Pressable>
              </View>
              <View style={styles.heroBottom}>
                <Text style={styles.heroTitle} numberOfLines={2}>
                  {item.name}
                </Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaChip}>
                    <Ionicons
                      name="navigate"
                      size={14}
                      color={isDark ? "#F3F4F6" : "#FFF8EE"}
                    />
                    <Text style={styles.metaText}>
                      {loading
                        ? "Getting location..."
                        : error
                        ? "Location off"
                        : distanceKm != null
                        ? `${distanceKm.toFixed(1)} km away`
                        : "Distance unknown"}
                    </Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Ionicons name="star" size={14} color={colors.accentDeep} />
                    <Text style={styles.metaText}>
                      {average != null ? `${average} ★` : "Popular"}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      Haptics.selectionAsync();
                      toggleFavorite(item.id);
                    }}
                    style={({ pressed }) => [
                      styles.favoriteChip,
                      pressed && styles.actionPressed,
                    ]}
                  >
                    <Text style={styles.favoriteText}>
                      {favorite ? "Saved" : "Save"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.sectionText} numberOfLines={expanded ? 0 : 3}>
              {item.description}
            </Text>
            <Pressable onPress={() => setExpanded((prev) => !prev)}>
              <Text style={styles.readMore}>{expanded ? "Show less" : "Read more"}</Text>
            </Pressable>
          </View>

          {item.category === "events" && eventMeta && (
            <DetailSectionCard
              title="Event Details"
              items={[
                {
                  icon: "calendar-outline",
                  label: "Date",
                  value: eventMeta.formattedDate,
                },
                {
                  icon: "time-outline",
                  label: "Countdown",
                  value: eventMeta.label,
                },
                {
                  icon: "location-outline",
                  label: "Venue",
                  value: item.venue ?? "Baripada",
                },
                {
                  icon: "time-outline",
                  label: "Time",
                  value: item.time ?? "TBA",
                },
              ]}
            />
          )}

          {item.category === "food" && (
            <DetailSectionCard
              title="Food Details"
              items={[
                {
                  icon: "restaurant-outline",
                  label: "Cuisine Type",
                  value: item.cuisineType ?? "Local",
                },
                {
                  icon: "cash-outline",
                  label: "Price Range",
                  value: item.priceRange ?? "₹₹",
                },
                {
                  icon: "time-outline",
                  label: "Opening Hours",
                  value: formattedHours,
                },
                {
                  icon: "call-outline",
                  label: "Contact Number",
                  value: item.contactNumber ?? "Not available",
                },
              ]}
            />
          )}

          {item.category === "places" && (
            <DetailSectionCard
              title="Place Details"
              items={[
                {
                  icon: "navigate-outline",
                  label: "Distance",
                  value:
                    distanceKm != null ? `${distanceKm.toFixed(1)} km away` : "Distance unknown",
                },
                {
                  icon: "time-outline",
                  label: "Opening Hours",
                  value: formattedHours,
                },
                {
                  icon: "ticket-outline",
                  label: "Entry Fee",
                  value: item.entryFee ?? "Free",
                },
                {
                  icon: "sunny-outline",
                  label: "Best Time",
                  value: item.bestTime ?? "Morning",
                },
              ]}
            />
          )}

          {item.category === "culture" && (
            <DetailSectionCard
              title="Cultural Details"
              items={[
                {
                  icon: "navigate-outline",
                  label: "Distance",
                  value:
                    distanceKm != null ? `${distanceKm.toFixed(1)} km away` : "Distance unknown",
                },
                {
                  icon: "time-outline",
                  label: "Opening Hours",
                  value: formattedHours,
                },
                {
                  icon: "ticket-outline",
                  label: "Entry Fee / Participation Fee",
                  value: item.entryFee ?? "Free",
                },
                {
                  icon: "sunny-outline",
                  label: "Best Time to Experience",
                  value: item.bestTime ?? "Evening",
                },
              ]}
            />
          )}

          {item.category === "shopping" && (
            <DetailSectionCard
              title="Shopping Details"
              items={[
                {
                  icon: "navigate-outline",
                  label: "Distance",
                  value:
                    distanceKm != null ? `${distanceKm.toFixed(1)} km away` : "Distance unknown",
                },
                {
                  icon: "pricetag-outline",
                  label: "Average Item Price",
                  value: item.priceRange ?? "₹₹",
                },
                {
                  icon: "time-outline",
                  label: "Opening Hours",
                  value: formattedHours,
                },
                {
                  icon: "call-outline",
                  label: "Contact Number",
                  value: item.contactNumber ?? "Not available",
                },
              ]}
            />
          )}

          {showRatingPrompt && !userRating && (
            <View style={styles.ratingCard}>
              <Text style={styles.ratingTitle}>⭐ Enjoyed this place?</Text>
              <Text style={styles.ratingSubtitle}>
                Rate it to help people nearby
              </Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Pressable
                    key={value}
                    onPress={async () => {
                      setSelectedRating(value);
                      await rate(value);
                      setShowRatingPrompt(false);
                      setShowThanks(true);
                    }}
                  >
                    <Ionicons
                      name={
                        value <= (selectedRating ?? userRating ?? 0)
                          ? "star"
                          : "star-outline"
                      }
                      size={20}
                      color={
                        value <= (selectedRating ?? userRating ?? 0)
                          ? colors.accent
                          : colors.inkMuted
                      }
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          {!showRatingPrompt && userRating != null && (
            <View style={styles.ratingCard}>
              <Text style={styles.ratingLabel}>Your rating</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Pressable
                    key={value}
                    onPress={async () => {
                      setSelectedRating(value);
                      await rate(value);
                      setShowThanks(true);
                    }}
                  >
                    <Ionicons
                      name={
                        value <= (selectedRating ?? userRating ?? 0)
                          ? "star"
                          : "star-outline"
                      }
                      size={20}
                      color={
                        value <= (selectedRating ?? userRating ?? 0)
                          ? colors.accent
                          : colors.inkMuted
                      }
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          {!showRatingPrompt && showThanks && (
            <Animated.View style={[styles.ratingCard, { opacity: thanksAnim }]}>
              <Text style={styles.thankYou}>Thanks for rating!</Text>
            </Animated.View>
          )}


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.galleryRow}>
                {[item.image, item.image, item.image].map((img, index) => (
                  <Image key={`${img}-${index}`} source={{ uri: img }} style={styles.galleryImage} />
                ))}
              </View>
            </ScrollView>
          </View>

          {related.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Related places</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.relatedRow}>
                  {related.map((relatedItem) => (
                    <View key={relatedItem.id} style={styles.relatedCard}>
                      <PlaceCard
                        place={relatedItem}
                        onPress={() => router.push(`/details/${relatedItem.id}`)}
                        isFavorite={isFavorite(relatedItem.id)}
                        onToggleFavorite={() => toggleFavorite(relatedItem.id)}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </ScrollView>

        <View style={styles.actionBar}>
          <Pressable
            onPress={openInMaps}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.accent },
              pressed && styles.actionPressed,
            ]}
            accessibilityRole="button"
          >
            <Ionicons name="map" size={16} color={colors.surface} />
            <Text style={[styles.actionText, { color: colors.surface }]}>Maps</Text>
          </Pressable>
          <Pressable
            onPress={openDirections}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.accent },
              pressed && styles.actionPressed,
            ]}
            accessibilityRole="button"
          >
            <Ionicons name="navigate" size={16} color={colors.surface} />
            <Text style={[styles.actionText, { color: colors.surface }]}>Directions</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Screen>
  );
}
