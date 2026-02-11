import { Animated, Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";
import { useRatings } from "@/hooks/useRatings";
type Props = {
  place: {
    id: string;
    name: string;
    description: string;
    image: string;
    date?: string;
    latitude?: number;
    longitude?: number;
  };
  onPress?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  distanceKm?: number | null;
  animateOnMount?: boolean;
  animationDelay?: number;
};

export function PlaceCard({
  place,
  onPress,
  isFavorite,
  onToggleFavorite,
  distanceKm,
  animateOnMount,
  animationDelay,
}: Props) {
  const { colors, shadow } = useTheme();
  const { average } = useRatings(place.id);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const mountAnim = useRef(new Animated.Value(animateOnMount ? 0 : 1)).current;
  const translateAnim = useRef(new Animated.Value(animateOnMount ? 8 : 0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFavorite, scaleAnim]);

  useEffect(() => {
    if (!animateOnMount) return;
    Animated.parallel([
      Animated.timing(mountAnim, {
        toValue: 1,
        duration: 220,
        delay: animationDelay ?? 0,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 220,
        delay: animationDelay ?? 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animateOnMount, animationDelay, mountAnim, translateAnim]);
  const openInMaps = () => {
    const query =
      place.latitude != null && place.longitude != null
        ? `${place.latitude},${place.longitude}`
        : encodeURIComponent(`${place.name}, Baripada`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  const styles = StyleSheet.create({
    card: {
      marginBottom: 16,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow,
    },
    pressed: {
      transform: [{ scale: 0.96 }],
      borderColor: colors.accent,
    },
    image: {
      height: 150,
      width: "100%",
      backgroundColor: colors.surfaceAlt,
    },
    badge: {
      position: "absolute",
      right: 10,
      top: 10,
      backgroundColor: colors.overlay,
      padding: 6,
      borderRadius: 16,
    },
    ratingBadge: {
      position: "absolute",
      left: 10,
      top: 10,
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      ...shadow,
    },
    ratingText: {
      fontSize: 11,
      fontFamily: typography.bodySemibold,
      color: colors.ink,
    },
    body: { padding: 10, gap: 4 },
    title: { fontSize: 15, fontFamily: typography.bodySemibold, color: colors.ink },
    subtitle: {
      fontSize: 12,
      fontFamily: typography.body,
      color: colors.inkMuted,
    },
    meta: { color: colors.inkMuted, fontSize: 12, fontFamily: typography.body },
    link: { color: colors.link, fontFamily: typography.bodySemibold },
  });

  return (
    <Animated.View
      style={{
        opacity: mountAnim,
        transform: [{ translateY: translateAnim }],
      }}
    >
      <Pressable
        onPress={() => {
          if (!onPress) return;
          Haptics.selectionAsync();
          onPress();
        }}
        disabled={!onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
      <View>
        <Image source={{ uri: place.image }} style={styles.image} />
        {average != null && (
          <Pressable
            onPress={() => router.push(`/details/${place.id}`)}
            style={styles.ratingBadge}
            accessibilityLabel="View and change rating"
          >
            <Ionicons name="star" size={12} color={colors.accent} />
            <Text style={styles.ratingText}>{average}</Text>
          </Pressable>
        )}
        {(isFavorite || onToggleFavorite) && (
          <Pressable
            onPress={() => {
              if (!onToggleFavorite) return;
              Haptics.selectionAsync();
              onToggleFavorite();
            }}
            disabled={!onToggleFavorite}
            style={styles.badge}
            accessibilityLabel={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={18}
                color="#fff"
              />
            </Animated.View>
          </Pressable>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {place.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {place.description}
        </Text>
        {!!place.date && (
          <Text style={styles.meta}>
            Event date: {place.date}
          </Text>
        )}

        {distanceKm != null && (
          <Text style={styles.meta}>
            {distanceKm.toFixed(1)} km away
          </Text>
        )}

        <Pressable onPress={openInMaps}>
          <Text style={styles.link}>Open in Google Maps -&gt;</Text>
        </Pressable>
      </View>
      </Pressable>
    </Animated.View>
  );
}
