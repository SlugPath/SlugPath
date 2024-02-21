import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useColorScheme } from "@mui/joy";
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

  if (isDark) {
    return <DarkModeIcon onClick={handleToggleMode} sx={{ color: "#fff" }} />;
  }

  return <LightModeIcon onClick={handleToggleMode} sx={{ color: "#fff" }} />;
}
