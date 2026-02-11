import { categoryItems } from "@/data/categoryItems";
import { places, type Place } from "@/data/places";

export type Item = Place & {
  category: "places" | "food" | "culture" | "events" | "shopping";
};

const categorized: Item[] = [
  ...places.map((item) => ({ ...item, category: "places" as const })),
  ...categoryItems.food.map((item) => ({ ...item, category: "food" as const })),
  ...categoryItems.culture.map((item) => ({ ...item, category: "culture" as const })),
  ...categoryItems.events.map((item) => ({ ...item, category: "events" as const })),
  ...categoryItems.shopping.map((item) => ({ ...item, category: "shopping" as const })),
];

export const items = categorized;

export function getItemById(id: string | string[] | undefined) {
  if (!id) return undefined;
  const key = Array.isArray(id) ? id[0] : id;
  return items.find((item) => item.id === key);
}

export function getItemsByIds(ids: Set<string>) {
  if (!ids.size) return [];
  return items.filter((item) => ids.has(item.id));
}
