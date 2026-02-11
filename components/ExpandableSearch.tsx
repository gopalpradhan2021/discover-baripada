import { useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";

type ExpandableSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function ExpandableSearch({
  value,
  onChange,
  placeholder = "Search...",
}: ExpandableSearchProps) {
  const { colors } = useTheme();
  const [fullWidth, setFullWidth] = useState(180);
  const inputRef = useRef<TextInput>(null);
  const widthAnim = useRef(new Animated.Value(36)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);

  const collapse = () => {
    Keyboard.dismiss();
    onChange("");
    Animated.parallel([
      Animated.timing(widthAnim, {
        toValue: 36,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start(() => setExpanded(false));
  };

  const expand = () => {
    setExpanded(true);
    Animated.parallel([
      Animated.timing(widthAnim, {
        toValue: fullWidth,
        duration: 240,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        delay: 60,
        useNativeDriver: false,
      }),
    ]).start(() => {
      inputRef.current?.focus();
    });
  };

  useEffect(() => {
    if (!expanded) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      collapse();
      return true;
    });
    return () => sub.remove();
  }, [expanded]);


  const styles = StyleSheet.create({
    container: {
      alignItems: "flex-end",
    },
    pill: {
      height: 36,
      borderRadius: radius.s,
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.s,
      gap: spacing.s,
    },
    input: {
      flex: 1,
      color: colors.ink,
      fontFamily: typography.body,
      fontSize: 13,
      paddingVertical: 0,
    },
    icon: {
      color: colors.inkMuted,
    },
  });

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const measured = event.nativeEvent.layout.width;
        if (measured > 0 && measured !== fullWidth) {
          setFullWidth(measured);
        }
      }}
    >
      <Animated.View style={[styles.pill, { width: widthAnim }]}>
        <Pressable onPress={expanded ? undefined : expand} hitSlop={10}>
          <Ionicons name="search" size={16} style={styles.icon} />
        </Pressable>
        <Animated.View
          style={{ flex: 1, opacity: opacityAnim }}
          pointerEvents={expanded ? "auto" : "none"}
        >
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={colors.inkMuted}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </Animated.View>
        {expanded && (
          <Pressable onPress={collapse} hitSlop={10}>
            <Ionicons name="close" size={16} style={styles.icon} />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}
