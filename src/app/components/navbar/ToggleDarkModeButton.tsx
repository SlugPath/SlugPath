import { Switch, useColorScheme } from "@mui/joy";
import { useEffect, useMemo } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

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
    <Switch
      checked={isDark}
      variant="soft"
      startDecorator={
        <LightModeIcon
          sx={{
            color: "#fcb103",
          }}
        />
      }
      endDecorator={
        <DarkModeIcon
          sx={{
            color: "#6703fc",
          }}
        />
      }
      onChange={handleToggleMode}
    />
  );
}
