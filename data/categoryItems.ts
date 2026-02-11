import { places, type Place } from "@/data/places";

export type CategoryItems = Record<
  "places" | "food" | "culture" | "events" | "shopping",
  Place[]
>;

const food: Place[] = [
  {
    id: "hotel-livya",
    name: "Hotel Livya",
    description:
      "Baripada restaurant serving North Indian, Chinese, and South Indian menus.",
    image: "https://source.unsplash.com/adzbTddUg68/1600x900",
    cuisineType: "North Indian · Chinese · South Indian",
    priceRange: "₹₹",
    contactNumber: "+91 94370 00001",
    openHours: { openTime: "09:30", closeTime: "22:30" },
    foodType: "both",
    latitude: 21.9326,
    longitude: 86.7521,
  },
  {
    id: "shri-balaji",
    name: "Shri Balaji Restaurant",
    description: "Known for South Indian dishes like dosa and uttapam.",
    image: "https://source.unsplash.com/zKmzgVixk_I/1600x900",
    cuisineType: "South Indian",
    priceRange: "₹",
    contactNumber: "+91 94370 00002",
    openHours: { openTime: "08:00", closeTime: "21:30" },
    foodType: "veg",
    latitude: 21.9332,
    longitude: 86.7564,
  },
  {
    id: "brewbakes",
    name: "Brewbakes - Balaji Group",
    description: "Cafe and bakery with fast food, desserts, and beverages.",
    image: "https://source.unsplash.com/NCSxv_ShUGY/1600x900",
    cuisineType: "Cafe · Bakery",
    priceRange: "₹₹",
    contactNumber: "+91 94370 00003",
    openHours: { openTime: "10:00", closeTime: "23:00" },
    foodType: "both",
    latitude: 21.9314,
    longitude: 86.7489,
  },
];

const culture: Place[] = [
  {
    id: "belgadia-palace",
    name: "Belgadia Palace",
    description:
      "Heritage palace stay in Baripada offering local culture and experiences.",
    image: "https://source.unsplash.com/a7ybS7r8p5Y/1600x900",
    originPeriod: "19th Century",
    community: "Mayurbhanj royal heritage",
    recognition: "Heritage palace stay",
    openHours: { openTime: "10:00", closeTime: "18:30" },
    latitude: 21.9331,
    longitude: 86.7515,
  },
  {
    id: "mayurbhanj-palace",
    name: "Mayurbhanj Palace",
    description:
      "Historic palace associated with the former royal family of Mayurbhanj.",
    image: "https://source.unsplash.com/LBgkfHU-_mY/1600x900",
    originPeriod: "Early 20th Century",
    community: "Mayurbhanj royal lineage",
    recognition: "Regional heritage site",
    openHours: { openTime: "09:00", closeTime: "17:30" },
    latitude: 21.9337,
    longitude: 86.7548,
  },
  {
    id: "kichakeswari-temple",
    name: "Kichakeswari Temple, Khiching",
    description:
      "Ancient temple complex dedicated to Goddess Kichakeswari in Khiching.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/Kichakeswari_Temple%2C_Khiching%2C_Odisha_01.jpg",
    originPeriod: "11th–12th Century",
    community: "Kichakeswari worship tradition",
    recognition: "Archaeological monument",
    openHours: { openTime: "06:00", closeTime: "20:00" },
    latitude: 21.5916,
    longitude: 85.9713,
  },
];

const events: Place[] = [
  {
    id: "baripada-rath-yatra",
    name: "Baripada Rath Yatra",
    description:
      "Unique Rath Yatra where women pull the chariot of Subhadra.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/37/Baripada_ratha_yatra_01.jpg",
    date: "2026-06-27",
    time: "09:00 AM",
    venue: "Baripada Main Street",
    latitude: 21.9335,
    longitude: 86.7502,
  },
  {
    id: "chaitra-parva",
    name: "Chaitra Parva (Chhau)",
    description:
      "Spring festival in Mayurbhanj featuring Chhau dance performances.",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Mayurbhanj_Chhau.jpg",
    date: "2026-03-30",
    time: "06:00 PM",
    venue: "Chhau Ground",
    latitude: 21.9321,
    longitude: 86.7582,
  },
  {
    id: "belgadia-cultural-evening",
    name: "Belgadia Palace Cultural Evenings",
    description:
      "Cultural evenings with music, dance, and local experiences.",
    image: "https://source.unsplash.com/a7ybS7r8p5Y/1600x900",
    date: "2026-02-05",
    time: "07:00 PM",
    venue: "Belgadia Palace",
    latitude: 21.9329,
    longitude: 86.751,
  },
];

const shopping: Place[] = [
  {
    id: "baripada-bazaar",
    name: "Baripada Bazaar",
    description: "Bustling market for fabrics, jewelry, and daily essentials.",
    image: "https://source.unsplash.com/FV3GConVSss/1600x900",
    openHours: { openTime: "09:00", closeTime: "21:00" },
    priceRange: "₹₹",
    contactNumber: "+91 94370 00004",
    latitude: 21.933,
    longitude: 86.754,
  },
  {
    id: "mayurbhanj-handicraft",
    name: "Mayurbhanj Handicrafts",
    description: "Local crafts, tribal art pieces, and handmade souvenirs.",
    image: "https://source.unsplash.com/b9drVB7xIOI/1600x900",
    openHours: { openTime: "10:00", closeTime: "19:00" },
    priceRange: "₹₹",
    contactNumber: "+91 94370 00005",
    latitude: 21.9319,
    longitude: 86.7508,
  },
  {
    id: "khadi-bhawan",
    name: "Khadi Bhawan",
    description: "Cotton, khadi, and handloom products from Odisha.",
    image: "https://source.unsplash.com/vC8wj_Kphak/1600x900",
    openHours: { openTime: "10:00", closeTime: "20:00" },
    priceRange: "₹₹",
    contactNumber: "+91 94370 00006",
    latitude: 21.9342,
    longitude: 86.7527,
  },
];

export const categoryItems: CategoryItems = {
  places,
  food,
  culture,
  events,
  shopping,
};
