const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export const fetchWeatherByCoords = async (lat, lon) => {
  const [weatherRes, geoRes] = await Promise.all([
    fetch(
      `${WEATHER_URL}?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode,apparent_temperature` +
      `&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,sunrise,sunset` +
      `&timezone=auto&forecast_days=7`
    ),
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`),
  ]);

  const weatherData = await weatherRes.json();
  const geoData = await geoRes.json();
  const cityName = geoData.city || geoData.locality || geoData.principalSubdivision || "Current Location";
  const country = geoData.countryCode || "";

  return {
    city: country ? `${cityName}, ${country}` : cityName,
    lat,
    lon,
    temperature: Math.round(weatherData.current.temperature_2m),
    feelsLike: Math.round(weatherData.current.apparent_temperature),
    humidity: weatherData.current.relative_humidity_2m,
    windspeed: Math.round(weatherData.current.windspeed_10m),
    weathercode: weatherData.current.weathercode,
    condition: getWeatherLabel(weatherData.current.weathercode),
    tempMax: Math.round(weatherData.daily.temperature_2m_max[0]),
    tempMin: Math.round(weatherData.daily.temperature_2m_min[0]),
    rainChance: weatherData.daily.precipitation_probability_max[0],
    sunrise: weatherData.daily.sunrise[0].split("T")[1],
    sunset: weatherData.daily.sunset[0].split("T")[1],
    daily: weatherData.daily.time.map((date, i) => ({
      date,
      temp: Math.round(weatherData.daily.temperature_2m_max[i]),
      condition: getWeatherLabel(weatherData.daily.weathercode[i]),
      weathercode: weatherData.daily.weathercode[i],
    })),
  };
};

export const fetchWeather = async (city) => {
  const geoRes = await fetch(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1`);
  const geoData = await geoRes.json();

  if (!geoData.results?.length) throw new Error("City not found");

  const { latitude, longitude, name, country } = geoData.results[0];

  const weatherRes = await fetch(
    `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode,apparent_temperature` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,sunrise,sunset` +
    `&timezone=auto&forecast_days=7`
  );
  const weatherData = await weatherRes.json();

  return {
    city: `${name}, ${country}`,
    lat: latitude,
    lon: longitude,
    temperature: Math.round(weatherData.current.temperature_2m),
    feelsLike: Math.round(weatherData.current.apparent_temperature),
    humidity: weatherData.current.relative_humidity_2m,
    windspeed: Math.round(weatherData.current.windspeed_10m),
    weathercode: weatherData.current.weathercode,
    condition: getWeatherLabel(weatherData.current.weathercode),
    tempMax: Math.round(weatherData.daily.temperature_2m_max[0]),
    tempMin: Math.round(weatherData.daily.temperature_2m_min[0]),
    rainChance: weatherData.daily.precipitation_probability_max[0],
    sunrise: weatherData.daily.sunrise[0].split("T")[1],
    sunset: weatherData.daily.sunset[0].split("T")[1],
    daily: weatherData.daily.time.map((date, i) => ({
      date,
      temp: Math.round(weatherData.daily.temperature_2m_max[i]),
      condition: getWeatherLabel(weatherData.daily.weathercode[i]),
      weathercode: weatherData.daily.weathercode[i],
    })),
  };
};

export const getWeatherLabel = (code) => {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Showers";
  return "Thunderstorm";
};
