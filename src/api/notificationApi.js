const MOCK_API_URL = "https://6a709a6e55c0ce38c3268a13.mockapi.io/notifications/notifications";

export const getNotifications = async () => {
  const response = await fetch(MOCK_API_URL);
  if (!response.ok) throw new Error("Failed to fetch notifications");
  const data = await response.json();
  return data.map((item) => ({
    id: item.id,
    title: item.title,
    message: item.message,
    createdAt: item.createdAt,
  }));
};

export const getWeatherNotifications = (weather) => {
  const alerts = [];
  const now = new Date().toISOString();

  if (weather.rainChance >= 60)
    alerts.push({ id: "w1", title: "Rain Alert", message: `${weather.rainChance}% chance of rain today in ${weather.city}.`, createdAt: now });

  if (weather.windspeed >= 40)
    alerts.push({ id: "w2", title: "Strong Wind Warning", message: `Wind speed is ${weather.windspeed} km/h in ${weather.city}.`, createdAt: now });

  if (weather.temperature >= 35)
    alerts.push({ id: "w3", title: "Heat Warning", message: `Temperature is ${weather.temperature}°C in ${weather.city}. Stay hydrated.`, createdAt: now });

  if (weather.temperature <= 5)
    alerts.push({ id: "w4", title: "Cold Alert", message: `Temperature is ${weather.temperature}°C in ${weather.city}. Dress warmly.`, createdAt: now });

  if (weather.humidity >= 80)
    alerts.push({ id: "w5", title: "High Humidity", message: `Humidity is at ${weather.humidity}% in ${weather.city}.`, createdAt: now });

  if (weather.weathercode >= 95)
    alerts.push({ id: "w6", title: "Thunderstorm Warning", message: `Thunderstorm expected in ${weather.city}.`, createdAt: now });

  if (alerts.length === 0)
    alerts.push({ id: "w7", title: "All Clear", message: `Weather looks good in ${weather.city} today.`, createdAt: now });

  return alerts;
};
