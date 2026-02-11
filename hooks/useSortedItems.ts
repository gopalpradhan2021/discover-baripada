import { useMemo } from "react";

type SortKey = "default" | "nearest" | "az";

type SortableItem = {
  id: string;
  name: string;
};

type DistanceMap = Record<string, number | null>;

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: "nearest", label: "Nearest" },
  { key: "az", label: "A–Z" },
  { key: "default", label: "Default" },
];

export function useSortedItems<T extends SortableItem>(
  items: T[],
  sortKey: SortKey,
  distances: DistanceMap,
  canUseDistance: boolean
) {
  return useMemo(() => {
    if (sortKey === "nearest" && canUseDistance) {
      return [...items].sort((a, b) => {
        const da = distances[a.id];
        const db = distances[b.id];
        if (da == null && db == null) return 0;
        if (da == null) return 1;
        if (db == null) return -1;
        return da - db;
      });
    }

    if (sortKey === "az") {
      return [...items].sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  }, [items, sortKey, distances, canUseDistance]);
}
