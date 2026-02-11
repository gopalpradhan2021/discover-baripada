import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { ServiceCard } from "@/components/ServiceCard";
import { essentialsData } from "@/data/essentialsData";
import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";

export default function EssentialsScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    content: {
      paddingTop: spacing.l,
      paddingBottom: spacing.xl,
      gap: spacing.l,
    },
    header: {
      padding: spacing.m,
      borderRadius: radius.l,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.s,
    },
    title: {
      fontSize: 22,
      fontFamily: typography.headingAlt,
      color: colors.ink,
    },
    subtitle: {
      fontSize: 13,
      fontFamily: typography.body,
      color: colors.inkMuted,
    },
    section: {
      gap: spacing.s,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: typography.bodySemibold,
      color: colors.ink,
      paddingHorizontal: spacing.s,
    },
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Essentials</Text>
          <Text style={styles.subtitle}>
            Quick access to services you may need in Baripada.
          </Text>
        </View>

        {essentialsData.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <ServiceCard key={item.id} item={item} />
            ))}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
