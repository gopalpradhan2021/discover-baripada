export type Place = {
  id: string;
  name: string;
  description: string;
  image: string;
  date?: string;
  time?: string;
  venue?: string;
  openHours?: {
    openTime: string;
    closeTime: string;
  };
  foodType?: "veg" | "nonveg" | "both";
  cuisineType?: string;
  priceRange?: string;
  contactNumber?: string;
  entryFee?: string;
  bestTime?: string;
  originPeriod?: string;
  community?: string;
  recognition?: string;
  latitude?: number;
  longitude?: number;
};

export const places: Place[] = [
  {
    id: "simlipal",
    name: "Simlipal National Park",
    description:
      "A UNESCO biosphere reserve near Baripada, famous for dense forests, waterfalls, and wildlife including tigers and elephants.",
    image:
      "https://images.unsplash.com/photo-1652501836325-5610537fbb96?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1600",
    latitude: 21.9497,
    longitude: 86.349,
  },
  {
    id: "jaganath",
    name: "Jagannath Temple, Baripada",
    description:
      "A famous Jagannath temple known for its unique Ratha Yatra where women pull the chariots.",
    image:
      "https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1600",
    latitude: 21.9315,
    longitude: 86.7513,
  },
  {
    id: "khiching",
    name: "Khiching Temple",
    description:
      "An ancient archaeological site with beautiful stone temples, dedicated to Goddess Kichakeswari.",
    image:
      "https://images.unsplash.com/photo-1767766790575-118ab8087c31?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1600",
    latitude: 21.5916,
    longitude: 85.9713,
  },
];
