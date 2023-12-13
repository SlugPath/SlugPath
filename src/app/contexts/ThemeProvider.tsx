"use client";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);

  // On mount get the system preference and set the dark mode state
  useEffect(() => {
    const match = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(match.matches);

    const changeHandler = (event: MediaQueryListEvent) =>
      setDarkMode(event.matches);
    match.addEventListener("change", changeHandler);

    return () => {
      match.removeEventListener("change", changeHandler);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
