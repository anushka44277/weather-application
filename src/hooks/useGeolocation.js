import { useState, useEffect } from "react";
import { fetchWeatherByCoords } from "../api/weatherApi";

export function useGeolocation() {
  const [locationWeather, setLocationWeather] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | loading | denied | unavailable | done

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
          setLocationWeather(data);
          setLocationStatus("done");
        } catch {
          setLocationStatus("unavailable");
        }
      },
      () => setLocationStatus("denied"),
      { timeout: 10000 }
    );
  }, []);

  return { locationWeather, locationStatus };
}
