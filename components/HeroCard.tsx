import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
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
  const heroHeight = Math.round(width * 0.6);
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
      width: "100%",
      height: heroHeight,
      borderRadius: radius.l,
      overflow: "hidden",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      position: "relative",
    },
    slide: {
      width,
      height: heroHeight,
      justifyContent: "flex-end",
    },
    image: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1,
    },
    content: {
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.s,
      gap: spacing.xs,
      zIndex: 2,
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
      position: "absolute",
      bottom: 12,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 3,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
      backgroundColor: "rgba(255,255,255,0.6)",
    },
    dotActive: {
      width: 20,
      borderRadius: 10,
      backgroundColor: "#F4A261",
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
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.6)"]}
                style={styles.overlay}
              />
              <View style={styles.content}>
                {item.kicker ? <Text style={styles.kicker}>{item.kicker}</Text> : null}
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </ImageBackground>
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
