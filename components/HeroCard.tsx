import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { radius, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/ThemeProvider";

export type HeroSlide = {
  id: string;
  kicker?: string;
  title: string;
  subtitle: string;
  image: string;
  route?: string;
};

type HeroCardProps = {
  slides: HeroSlide[];
};

export function HeroCard({ slides }: HeroCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<HeroSlide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      const next = (activeIndexRef.current + 1) % slides.length;
      activeIndexRef.current = next;
      setActiveIndex(next);
      listRef.current?.scrollToIndex({ index: next, animated: true });
    }, 3500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const styles = StyleSheet.create({
    card: {
      borderRadius: radius.l,
      overflow: "hidden",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    slide: {
      width,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.s,
      justifyContent: "center",
      gap: spacing.xs,
    },
    image: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
    kicker: {
      color: "#FFFFFF",
      fontSize: 12,
      letterSpacing: 1,
      textTransform: "uppercase",
      fontFamily: typography.bodySemibold,
    },
    title: {
      marginTop: spacing.xs,
      fontSize: 24,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      fontFamily: typography.headingAlt,
      color: "#FFFFFF",
    },
    subtitle: {
      marginTop: spacing.xs,
      color: "rgba(255,255,255,0.85)",
      fontSize: 13,
      lineHeight: 18,
      fontFamily: typography.body,
    },
    dots: {
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
      paddingBottom: spacing.s,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.4)",
    },
    dotActive: {
      width: 16,
      borderRadius: 999,
      backgroundColor: colors.accent,
    },
  });

  if (!slides.length) {
    return null;
  }

  return (
    <View style={styles.card}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          activeIndexRef.current = index;
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (item.route) {
                router.push(item.route);
              }
            }}
            style={styles.slide}
          >
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
            <LinearGradient
              colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.55)"]}
              style={styles.overlay}
            />
            {item.kicker ? <Text style={styles.kicker}>{item.kicker}</Text> : null}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </Pressable>
        )}
      />
      <View style={styles.dots}>
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}
