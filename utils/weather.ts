export type WeatherKind = "rainy" | "sunny" | "cloudy";

export function mapWeatherCode(code: number): WeatherKind {
  if (
    code === 51 ||
    code === 53 ||
    code === 55 ||
    code === 56 ||
    code === 57 ||
    code === 61 ||
    code === 63 ||
    code === 65 ||
    code === 66 ||
    code === 67 ||
    code === 80 ||
    code === 81 ||
    code === 82 ||
    code === 95 ||
    code === 96 ||
    code === 99
  ) {
    return "rainy";
  }
  if (code === 0 || code === 1) {
    return "sunny";
  }
  return "cloudy";
}

export function weatherLabel(kind: WeatherKind) {
  if (kind === "rainy") return "rainy";
  if (kind === "sunny") return "sunny";
  return "cloudy";
}
