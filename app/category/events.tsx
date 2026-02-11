import { router } from "expo-router";

import { CategoryList } from "@/components/CategoryList";
import { Screen } from "@/components/Screen";
import { categories } from "@/data/categories";

const category = categories.find((item) => item.slug === "events");

export default function EventsScreen() {
  return (
    <Screen>
      <CategoryList
        initialCategory="events"
        onItemPress={(id) => router.push(`/details/${id}`)}
        titleOverride={category?.title}
        subtitleOverride={category?.description}
      />
    </Screen>
  );
}
