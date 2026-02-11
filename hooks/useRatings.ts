import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "discover_baripada_ratings";

type RatingEntry = {
  count: number;
  total: number;
  userRating?: number;
};

type RatingStore = Record<string, RatingEntry>;

export function useRatings(placeId: string | undefined) {
  const [entry, setEntry] = useState<RatingEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!placeId) {
      setEntry(null);
      setLoading(false);
      return;
    }
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted) return;
        if (!raw) {
          setEntry(null);
          setLoading(false);
          return;
        }
        const store = JSON.parse(raw) as RatingStore;
        setEntry(store[placeId] ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setEntry(null);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [placeId]);

  const rate = useCallback(
    async (rating: number) => {
      if (!placeId) return;
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const store: RatingStore = raw ? JSON.parse(raw) : {};
      const current = store[placeId];
      const previousRating = current?.userRating ?? null;
      const next: RatingEntry = previousRating
        ? {
            count: current?.count ?? 1,
            total: (current?.total ?? 0) - previousRating + rating,
            userRating: rating,
          }
        : {
            count: (current?.count ?? 0) + 1,
            total: (current?.total ?? 0) + rating,
            userRating: rating,
          };
      store[placeId] = next;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      setEntry(next);
    },
    [placeId]
  );

  const average =
    entry && entry.count > 0 ? Number((entry.total / entry.count).toFixed(1)) : null;

  return {
    loading,
    average,
    userRating: entry?.userRating ?? null,
    rate,
  };
}
