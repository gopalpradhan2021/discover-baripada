import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";
import type { ServiceItem } from "@/data/essentialsData";

type ServiceCardProps = {
  item: ServiceItem;
};

export function ServiceCard({ item }: ServiceCardProps) {
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
    meta: {
      fontSize: 12,
      fontFamily: typography.body,
      color: colors.inkMuted,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: spacing.s,
    },
    price: {
      fontSize: 13,
      fontFamily: typography.bodySemibold,
      color: colors.accentDeep,
    },
    actions: {
      flexDirection: "row",
      gap: spacing.s,
    },
    action: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: spacing.s,
      paddingVertical: 8,
      borderRadius: radius.s,
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionText: {
      fontSize: 12,
      fontFamily: typography.bodySemibold,
      color: colors.ink,
    },
  });

  const handleCall = () => {
    Linking.openURL(`tel:${item.phone}`);
  };

  const handleWhatsApp = () => {
    if (!item.whatsapp) return;
    Linking.openURL(`https://wa.me/${item.whatsapp.replace("+", "")}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>{item.price}+</Text>
      </View>
      <Text style={styles.meta}>{item.type}</Text>
      <Text style={styles.meta}>{item.area}</Text>
      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={handleCall}>
          <Ionicons name="call-outline" size={14} color={colors.accentDeep} />
          <Text style={styles.actionText}>Call</Text>
        </Pressable>
        {item.whatsapp ? (
          <Pressable style={styles.action} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={14} color={colors.accentDeep} />
            <Text style={styles.actionText}>WhatsApp</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
