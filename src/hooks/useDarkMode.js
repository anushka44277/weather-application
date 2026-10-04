import { useState, useEffect } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("darkMode", dark);
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const toggle = () => setDark((d) => !d);
  return { dark, toggle };
}
