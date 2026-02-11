import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useUserLocation } from "@/hooks/useUserLocation";
import { haversineKm } from "@/hooks/useDistances";
import { useRatings } from "@/hooks/useRatings";

type OpenHours = {
  openTime: string;
  closeTime: string;
};

type FoodType = "veg" | "nonveg" | "both";

type CategoryListingCardProps = {
  id: string;
  title: string;
  image: string;
  rating?: number;
  locationCoords: {
    latitude: number;
    longitude: number;
  };
  openHours: OpenHours;
  foodType: FoodType;
  isBookmarked?: boolean;
};

function parseMinutes(time: string) {
  const [hh, mm] = time.split(":").map((value) => Number(value));
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 60 + mm;
}

function isOpenNow(openHours: OpenHours) {
  const openMinutes = parseMinutes(openHours.openTime);
  const closeMinutes = parseMinutes(openHours.closeTime);
  if (openMinutes == null || closeMinutes == null) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export function CategoryListingCard({
  id,
  title,
  image,
  rating,
  locationCoords,
  openHours,
  foodType,
  isBookmarked = false,
}: CategoryListingCardProps) {
  const { latitude, longitude } = useUserLocation();
  const { average } = useRatings(id);
  const displayRating = average ?? rating ?? null;
  const distance = useMemo(() => {
    if (
      latitude == null ||
      longitude == null ||
      locationCoords.latitude == null ||
      locationCoords.longitude == null
    ) {
      return null;
    }
    return haversineKm(
      latitude,
      longitude,
      locationCoords.latitude,
      locationCoords.longitude
    );
  }, [latitude, longitude, locationCoords.latitude, locationCoords.longitude]);

  const openNow = useMemo(() => isOpenNow(openHours), [openHours]);

  const foodLabel = foodType === "veg" ? "Veg" : foodType === "nonveg" ? "Non-Veg" : "Both";
  const foodDot =
    foodType === "veg"
      ? "#3BD06B"
      : foodType === "nonveg"
      ? "#F0534F"
      : "#F2B045";

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/details/${id}`)}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.dots}>
          {[0, 1, 2, 3, 4].map((dot) => (
            <View key={dot} style={styles.dot} />
          ))}
        </View>
        <View style={styles.bookmark}>
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={18}
            color="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          {displayRating != null && (
            <View style={styles.ratingWrap}>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={12} color="#FFFFFF" />
                <Text style={styles.ratingText}>
                  {displayRating.toFixed(1)}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="navigate-outline" size={14} color="#A7B0BD" />
            <Text style={styles.metaText}>
              {distance != null ? `${distance.toFixed(1)} km` : "Distance N/A"}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons
              name="radio-button-on"
              size={10}
              color={openNow ? "#3BD06B" : "#F0534F"}
            />
            <Text style={[styles.metaText, { color: openNow ? "#3BD06B" : "#F0534F" }]}>
              {openNow ? "Open" : "Closed"}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <View style={[styles.foodDot, { backgroundColor: foodDot }]} />
            <Text style={styles.metaText}>{foodLabel}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C22",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  imageWrap: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 190,
  },
  dots: {
    position: "absolute",
    bottom: 10,
    right: 14,
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  bookmark: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    padding: 14,
    gap: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  ratingWrap: {
    alignItems: "flex-end",
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#1FAE5B",
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: "#A7B0BD",
    fontSize: 12,
    fontWeight: "600",
  },
  foodDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
});
