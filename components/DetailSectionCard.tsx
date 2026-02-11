import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";

type DetailItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

type DetailSectionCardProps = {
  title: string;
  items: DetailItem[];
};

export function DetailSectionCard({ title, items }: DetailSectionCardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      padding: spacing.m,
      borderRadius: radius.l,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.s,
    },
    title: {
      fontSize: 16,
      fontFamily: typography.bodySemibold,
      color: colors.ink,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.s,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.s,
      flex: 1,
    },
    label: {
      fontSize: 13,
      fontFamily: typography.bodyMedium,
      color: colors.inkMuted,
    },
    value: {
      fontSize: 13,
      fontFamily: typography.bodySemibold,
      color: colors.ink,
    },
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {items.map((item) => (
        <View key={`${item.label}-${item.value}`} style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name={item.icon} size={16} color={colors.accentDeep} />
            <Text style={styles.label}>{item.label}</Text>
          </View>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}
