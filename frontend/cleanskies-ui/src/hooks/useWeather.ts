import { useEffect, useState } from "react";

export type WeatherData = {
  zip: string;
  tempC: number;
  humidity: number;
  windKph: number;
  description: string;
};

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string | undefined;

async function fetchWeatherForZip(zip: string): Promise<WeatherData | null> {
  if (!API_KEY) return null;
  try {
    // OpenWeatherMap current weather by zip (US). Units=metric for °C
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) return null;
    const json = await res.json();
    return {
      zip,
      tempC: json.main.temp,
      humidity: json.main.humidity,
      windKph: (json.wind.speed ?? 0) * 3.6,
      description: json.weather?.[0]?.description ?? "",
    };
  } catch (e) {
    return null;
  }
}

export function useWeather(zip: string | null) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!zip) return;
    setLoading(true);
    fetchWeatherForZip(zip).then((w) => {
      if (!mounted) return;
      setData(w);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [zip]);

  return { data, loading } as const;
}

export async function fetchWeatherForZips(zips: string[], batchSize = 5) {
  // Returns a map of zip -> WeatherData | null (null on failure)
  const map: Record<string, WeatherData | null> = {};
  if (!API_KEY) {
    zips.forEach((z) => (map[z] = null));
    return map;
  }

  for (let i = 0; i < zips.length; i += batchSize) {
    const chunk = zips.slice(i, i + batchSize);
    const promises = chunk.map((z) =>
      fetchWeatherForZip(z).then((r) => ({ zip: z, data: r })).catch(() => ({ zip: z, data: null }))
    );
    const results = await Promise.all(promises);
    results.forEach((r) => {
      map[r.zip] = r.data;
      if (!r.data) console.warn(`Weather fetch failed for zip ${r.zip}`);
    });
    // small delay to be gentle with the API
    await new Promise((res) => setTimeout(res, 250));
  }

  return map;
}
