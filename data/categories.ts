export type Category = {
  slug: "places" | "food" | "culture" | "events" | "shopping";
  title: string;
  description: string;
  icon:
    | "map-outline"
    | "restaurant-outline"
    | "color-palette-outline"
    | "calendar-outline"
    | "bag-outline";
  color: string;
};

export const categories: Category[] = [
  {
    slug: "places",
    title: "Places",
    description: "Parks, markets, and landmarks around Baripada.",
    icon: "map-outline",
    color: "#E6F0FA",
  },
  {
    slug: "food",
    title: "Food",
    description: "Street bites, cafes, and local favorites.",
    icon: "restaurant-outline",
    color: "#FCE8D5",
  },
  {
    slug: "culture",
    title: "Culture",
    description: "Heritage, crafts, and community stories.",
    icon: "color-palette-outline",
    color: "#F6E6F0",
  },
  {
    slug: "events",
    title: "Events",
    description: "Weekend plans and city happenings.",
    icon: "calendar-outline",
    color: "#E3F3E4",
  },
  {
    slug: "shopping",
    title: "Shopping",
    description: "Local markets, crafts, and souvenirs.",
    icon: "bag-outline",
    color: "#F6F0D9",
  },
];
