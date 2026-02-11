import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import {
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";

import { FavoritesProvider } from "@/components/FavoritesProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getTheme } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const { colors, isDark } = getTheme(scheme);

  return (
    <ThemeProvider scheme={scheme}>
      <FavoritesProvider>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <StatusBar
            style={isDark ? "light" : "dark"}
            backgroundColor={colors.background}
          />
          <Stack
            screenOptions={{
              animation: "none",
              headerShown: false,
            }}
          />
        </View>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
