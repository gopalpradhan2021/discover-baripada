import React, { useMemo } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";

type ScreenProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
};

export function Screen({
  children,
  style,
  edges = ["top", "left", "right"],
}: ScreenProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: colors.background,
          paddingHorizontal: spacing.l,
        },
      }),
    [colors]
  );

  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
