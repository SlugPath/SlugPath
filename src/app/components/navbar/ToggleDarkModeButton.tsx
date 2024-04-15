"use client";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Button, useColorScheme } from "@mui/joy";
import { useEffect, useMemo } from "react";

export default function ToggleButton() {
  const { mode, setMode } = useColorScheme();

  const isDark = useMemo(() => mode === "dark", [mode]);

  function handleToggleMode() {
    setMode(isDark ? "light" : "dark");
  }

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <Button
      onClick={handleToggleMode}
      variant="solid"
      className="hover:bg-primary-400"
    >
      {isDark ? (
        <DarkModeIcon sx={{ color: "#fff" }} />
      ) : (
        <LightModeIcon sx={{ color: "#fff" }} />
      )}
    </Button>
  );
}
