import { useState, useCallback } from "react";

function getKey(prefix, username) {
  return `${prefix}_${username}`;
}

export function useUserStorage(username) {
  const favKey = getKey("favorites", username);
  const histKey = getKey("history", username);
  const defKey = getKey("defaultCity", username);

  const [favorites, setFavoritesState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(favKey)) || []; } catch { return []; }
  });

  const [history, setHistoryState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(histKey)) || []; } catch { return []; }
  });

  const [defaultCity, setDefaultCityState] = useState(() =>
    localStorage.getItem(defKey) || ""
  );

  const addFavorite = useCallback((city) => {
    setFavoritesState((prev) => {
      if (prev.includes(city)) return prev;
      const next = [...prev, city];
      localStorage.setItem(favKey, JSON.stringify(next));
      return next;
    });
  }, [favKey]);

  const removeFavorite = useCallback((city) => {
    setFavoritesState((prev) => {
      const next = prev.filter((c) => c !== city);
      localStorage.setItem(favKey, JSON.stringify(next));
      return next;
    });
  }, [favKey]);

  const addHistory = useCallback((city) => {
    setHistoryState((prev) => {
      const filtered = prev.filter((c) => c !== city);
      const next = [city, ...filtered].slice(0, 10);
      localStorage.setItem(histKey, JSON.stringify(next));
      return next;
    });
  }, [histKey]);

  const clearHistory = useCallback(() => {
    localStorage.setItem(histKey, JSON.stringify([]));
    setHistoryState([]);
  }, [histKey]);

  const setDefaultCity = useCallback((city) => {
    localStorage.setItem(defKey, city);
    setDefaultCityState(city);
  }, [defKey]);

  return { favorites, addFavorite, removeFavorite, history, addHistory, clearHistory, defaultCity, setDefaultCity };
}
