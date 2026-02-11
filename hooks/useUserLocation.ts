import { useEffect, useState } from "react";
import * as Location from "expo-location";

type LocationState = {
  loading: boolean;
  error: string | null;
  latitude: number | null;
  longitude: number | null;
};

export function useUserLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    loading: true,
    error: null,
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!mounted) return;
      if (status !== "granted") {
        setState({
          loading: false,
          error: "Location permission denied",
          latitude: null,
          longitude: null,
        });
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      if (!mounted) return;
      setState({
        loading: false,
        error: null,
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
