import { useState } from "react";

export function useUnit() {
  const [unit, setUnit] = useState(() => localStorage.getItem("unit") || "C");

  const toggle = () => setUnit((u) => {
    const next = u === "C" ? "F" : "C";
    localStorage.setItem("unit", next);
    return next;
  });

  const convert = (celsius) => {
    if (celsius == null) return "—";
    return unit === "C" ? `${celsius}°C` : `${Math.round(celsius * 9 / 5 + 32)}°F`;
  };

  return { unit, toggle, convert };
}
