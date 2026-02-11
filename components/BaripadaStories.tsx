import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";
import { ExpandableSearch } from "@/components/ExpandableSearch";
import { DetailSectionCard } from "@/components/DetailSectionCard";

type StorySection = {
  id: string;
  title: string;
  tag: string;
  icon: keyof typeof Ionicons.glyphMap;
  paragraphs: string[];
};

const STORY_SECTIONS: StorySection[] = [
  {
    id: "origins",
    title: "Origins & Early History",
    tag: "Pre-18th Century",
    icon: "time-outline",
    paragraphs: [
      "Baripada’s name is linked to water-rich landscapes. Local explanations connect it to Odia words for “land of water,” reflecting the town’s ponds and the Budhabalanga river that shapes daily life.",
      "Another tradition traces the name to early forest communities such as the Bauri/Bathudi, highlighting the area’s tribal roots and close ties to the surrounding forests.",
      "The 16th-century Jagannath temple marks an early cultural landmark, showing Baripada’s long-standing spiritual and civic identity.",
    ],
  },
  {
    id: "royal",
    title: "Royal Legacy of Mayurbhanj",
    tag: "18th–20th Century",
    icon: "crown-outline",
    paragraphs: [
      "The Bhanja dynasty ruled Mayurbhanj for centuries, and Baripada eventually became the capital of the princely state after earlier seats at Khiching and Haripur.",
      "Baripada rose to prominence in the late 18th century under Maharani Sumitra Devi, becoming the administrative heart of the state.",
      "Later rulers, including Maharajas Jadunatha Bhanja and Sriram Chandra Bhanj Deo, supported education, urban planning, and cultural patronage that shaped the city’s modern form.",
    ],
  },
  {
    id: "freedom",
    title: "Freedom Movement & Modern Era",
    tag: "20th Century",
    icon: "flag-outline",
    paragraphs: [
      "During the freedom movement, Mayurbhanj’s leaders and citizens engaged with the national struggle, blending local identity with wider aspirations.",
      "The princely state acceded to India in 1948 and was merged into Odisha in 1949, after which Baripada grew as the district headquarters and civic hub.",
    ],
  },
  {
    id: "festivals",
    title: "Festivals & Traditions",
    tag: "Living Heritage",
    icon: "sparkles",
    paragraphs: [
      "Baripada’s Rath Yatra is celebrated for a rare tradition: women pull the chariot of Subhadra, a custom associated with the Haribaldev temple.",
      "The town’s calendar is filled with seasonal fairs and community gatherings, weaving together royal-era rituals and tribal celebrations.",
    ],
  },
  {
    id: "arts",
    title: "Art, Dance & Culture",
    tag: "UNESCO 2010",
    icon: "musical-notes-outline",
    paragraphs: [
      "Mayurbhanj Chhau is a classical dance form rooted in this region and was recognized by UNESCO as intangible cultural heritage.",
      "The dance is closely tied to Chaitra Parva festivities, and Mayurbhanj’s cultural identity continues to be shaped by folk music and performance traditions.",
    ],
  },
  {
    id: "people",
    title: "People, Nature & Identity",
    tag: "Community & Nature",
    icon: "leaf-outline",
    paragraphs: [
      "Mayurbhanj is home to large tribal communities such as the Santal, Ho, Bhumij, and Bathudi, whose languages, crafts, and rituals define the district’s cultural tapestry.",
      "Similipal, one of India’s major tiger reserves and a biosphere reserve, lies within the district and connects Baripada’s identity to forests, waterfalls, and wildlife.",
      "This blend of tribal heritage, royal history, and natural landscapes is why Baripada is often described as the cultural heart of North Odisha.",
    ],
  },
  {
    id: "facts",
    title: "Interesting & Lesser-Known Facts",
    tag: "Did You Know?",
    icon: "information-circle-outline",
    paragraphs: [
      "Baripada appeared in 18th-century maps under the spelling “Burpuddah,” showing its early importance on colonial records.",
      "The Jagannath temple in Baripada dates back to the 1500s and remains central to local identity today.",
      "Women pulling Subhadra’s chariot during Rath Yatra is a rare practice in India and continues to draw visitors each year.",
    ],
  },
];

export default function BaripadaStories() {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchRow}>
          <ExpandableSearch value={query} onChange={setQuery} placeholder="Search..." />
        </View>
        <View style={styles.hero}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1600",
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={[styles.heroTitle, { color: colors.surface }]}>
              Baripada Stories
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.surface }]}>
              History, culture & untold stories of Mayurbhanj
            </Text>
          </View>
        </View>

        {STORY_SECTIONS.map((section) => (
          <View key={section.id} style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.tag, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.tagText, { color: colors.inkMuted }]}>
                  {section.tag}
                </Text>
              </View>
              <Ionicons name={section.icon} size={18} color={colors.accentDeep} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.ink }]}>
              {section.title}
            </Text>
            {section.paragraphs.map((paragraph, index) => (
              <Text
                key={`${section.id}-${index}`}
                style={[styles.cardText, { color: colors.inkMuted }]}
              >
                {paragraph}
              </Text>
            ))}
          </View>
        ))}

        <DetailSectionCard
          title="Historical Context"
          items={[
            { icon: "time-outline", label: "Era", value: "18th Century" },
            { icon: "map-outline", label: "Region", value: "Mayurbhanj, Odisha" },
            { icon: "star-outline", label: "Significance", value: "Cultural heartland" },
            { icon: "link-outline", label: "Related Events", value: "Rath Yatra, Chhau" },
          ]}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.l,
    paddingBottom: spacing.xl,
    gap: spacing.m,
  },
  searchRow: {
    alignItems: "flex-end",
  },
  hero: {
    borderRadius: radius.l,
    overflow: "hidden",
    minHeight: 200,
  },
  heroImage: {
    width: "100%",
    height: 220,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroContent: {
    position: "absolute",
    left: spacing.m,
    right: spacing.m,
    bottom: spacing.m,
    gap: spacing.xs,
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: typography.headingAlt,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: typography.body,
    lineHeight: 20,
  },
  card: {
    padding: spacing.m,
    borderRadius: radius.l,
    gap: spacing.s,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 11,
    fontFamily: typography.bodySemibold,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: typography.headingAlt,
  },
  cardText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: typography.body,
  },
});
