import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "discover_baripada_recents";
const MAX_RECENTS = 10;

export type RecentEntry =
  | { type: "item"; id: string; ts: number }
  | { type: "category"; id: "places" | "food" | "culture" | "events"; ts: number };

export function useRecents() {
  const [recents, setRecents] = useState<RecentEntry[]>([]);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (!mounted) return;
      if (!value) return;
      try {
        const parsed = JSON.parse(value) as RecentEntry[];
        setRecents(parsed);
      } catch {
        setRecents([]);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback((next: RecentEntry[]) => {
    setRecents(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
  }, []);

  const recordItem = useCallback(
    (id: string) => {
      const now = Date.now();
      setRecents((prev) => {
        const filtered = prev.filter(
          (entry) => !(entry.type === "item" && entry.id === id)
        );
        const next: RecentEntry[] = [
          { type: "item", id, ts: now },
          ...filtered,
        ].slice(0, MAX_RECENTS);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
        return next;
      });
    },
    []
  );

  const recordCategory = useCallback(
    (id: "places" | "food" | "culture" | "events") => {
      const now = Date.now();
      setRecents((prev) => {
        const filtered = prev.filter(
          (entry) => !(entry.type === "category" && entry.id === id)
        );
        const next: RecentEntry[] = [
          { type: "category", id, ts: now },
          ...filtered,
        ].slice(0, MAX_RECENTS);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
        return next;
      });
    },
    []
  );

  const latest = useMemo(() => recents.slice(0, 3), [recents]);

  return { recents, latest, recordItem, recordCategory };
}
