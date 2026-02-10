import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing } from "@/constants/theme";

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
  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.l,
  },
});
