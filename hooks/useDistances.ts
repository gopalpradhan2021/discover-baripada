import { useMemo } from "react";

type CoordItem = {
  id: string;
  latitude?: number;
  longitude?: number;
};

type DistanceMap = Record<string, number | null>;

const EARTH_RADIUS_KM = 6371;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function useDistances<T extends CoordItem>(
  items: T[],
  latitude: number | null,
  longitude: number | null
): DistanceMap {
  return useMemo(() => {
    if (latitude == null || longitude == null) {
      return Object.fromEntries(items.map((item) => [item.id, null]));
    }
    return Object.fromEntries(
      items.map((item) => {
        if (item.latitude == null || item.longitude == null) {
          return [item.id, null];
        }
        const distance = haversineKm(
          latitude,
          longitude,
          item.latitude,
          item.longitude
        );
        return [item.id, distance];
      })
    );
  }, [items, latitude, longitude]);
}
