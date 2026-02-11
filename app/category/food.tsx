import { router } from "expo-router";

import { CategoryList } from "@/components/CategoryList";
import { Screen } from "@/components/Screen";
import { categories } from "@/data/categories";

const category = categories.find((item) => item.slug === "food");

export default function FoodScreen() {
  return (
    <Screen>
      <CategoryList
        initialCategory="food"
        onItemPress={(id) => router.push(`/details/${id}`)}
        titleOverride={category?.title}
        subtitleOverride={category?.description}
      />
    </Screen>
  );
}
