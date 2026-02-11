import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";

type HomePageStoriesCardProps = {
  title?: string;
  description?: string;
  tag?: string;
  image?: string;
};

export function HomePageStoriesCard({
  title = "Baripada Stories",
  description = "Stories from the land of Mayurbhanj",
  tag = "Royal Era",
  image = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1600",
}: HomePageStoriesCardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      width: "100%",
      borderRadius: radius.l,
      padding: spacing.m,
      minHeight: 98,
      backgroundColor: "#F5A15B",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.08)",
    },
    bgImage: {
      position: "absolute",
      right: -40,
      top: -20,
      width: 200,
      height: 200,
      opacity: 0.25,
    },
    tag: {
      alignSelf: "flex-start",
      paddingHorizontal: spacing.s,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.6)",
      marginBottom: spacing.s,
    },
    tagText: {
      fontSize: 11,
      fontFamily: typography.bodySemibold,
      color: "#3D2A1B",
    },
    title: {
      fontSize: 20,
      fontFamily: typography.headingAlt,
      color: "#2B1B10",
    },
    description: {
      marginTop: spacing.xs,
      fontSize: 13,
      lineHeight: 18,
      fontFamily: typography.body,
      color: "#3D2A1B",
    },
    iconWrap: {
      marginTop: spacing.s,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.7)",
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      color: colors.accentDeep,
    },
  });

  return (
    <Pressable
      onPress={() => router.push("/stories")}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel="Open Baripada Stories"
    >
      <Image source={{ uri: image }} style={styles.bgImage} />
      <View style={styles.tag}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
      <View style={styles.iconWrap}>
        <Ionicons name="book-outline" size={18} style={styles.icon} />
      </View>
    </Pressable>
  );
}
