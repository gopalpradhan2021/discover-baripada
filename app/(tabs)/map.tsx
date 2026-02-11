import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { Screen } from "@/components/Screen";
import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";
import { items } from "@/data/items";

const DEFAULT_REGION: Region = {
  latitude: 21.932,
  longitude: 86.753,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

export default function MapScreen() {
  const { placeId } = useLocalSearchParams<{ placeId?: string }>();
  const mappedItems = useMemo(
    () => items.filter((item) => item.latitude != null && item.longitude != null),
    []
  );
  const { colors } = useTheme();

  const selected = useMemo(
    () => mappedItems.find((item) => item.id === placeId),
    [mappedItems, placeId]
  );

  const region = useMemo(() => {
    if (!mappedItems.length) return DEFAULT_REGION;
    const center = mappedItems.reduce(
      (acc, item) => ({
        lat: acc.lat + (item.latitude ?? 0),
        lon: acc.lon + (item.longitude ?? 0),
      }),
      { lat: 0, lon: 0 }
    );
    const lat = center.lat / mappedItems.length;
    const lon = center.lon / mappedItems.length;
    return {
      latitude: lat,
      longitude: lon,
      latitudeDelta: DEFAULT_REGION.latitudeDelta,
      longitudeDelta: DEFAULT_REGION.longitudeDelta,
    };
  }, [mappedItems]);

  const styles = StyleSheet.create({
    screen: {
      paddingHorizontal: 0,
    },
    header: {
      paddingHorizontal: spacing.l,
      paddingVertical: spacing.m,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 22,
      fontFamily: typography.heading,
      color: colors.ink,
    },
    subtitle: {
      marginTop: 4,
      color: colors.inkMuted,
      fontFamily: typography.body,
      fontSize: 13,
    },
    map: {
      flex: 1,
    },
    callout: {
      width: 220,
      padding: spacing.s,
      backgroundColor: colors.surface,
    },
    calloutTitle: {
      fontSize: 14,
      fontFamily: typography.bodySemibold,
      color: colors.ink,
    },
    calloutSubtitle: {
      marginTop: 4,
      fontSize: 12,
      color: colors.inkMuted,
      fontFamily: typography.body,
    },
    calloutButton: {
      marginTop: spacing.s,
      paddingVertical: 6,
      borderRadius: radius.s,
      backgroundColor: colors.accent,
      alignItems: "center",
    },
    calloutButtonText: {
      color: colors.surface,
      fontFamily: typography.bodySemibold,
      fontSize: 12,
    },
  });

  return (
    <Screen style={styles.screen} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Map</Text>
        <Text style={styles.subtitle}>All places, food, culture, and events.</Text>
      </View>
      <MapView
        style={styles.map}
        initialRegion={selected
          ? {
              latitude: selected.latitude as number,
              longitude: selected.longitude as number,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }
          : region}
      >
        {mappedItems.map((item) => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.latitude as number, longitude: item.longitude as number }}
            title={item.name}
            description={item.description}
          >
            <Callout onPress={() => router.push(`/details/${item.id}`)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{item.name}</Text>
                <Text style={styles.calloutSubtitle} numberOfLines={2}>
                  {item.description}
                </Text>
                <Pressable style={styles.calloutButton}>
                  <Text style={styles.calloutButtonText}>View details</Text>
                </Pressable>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </Screen>
  );
}
