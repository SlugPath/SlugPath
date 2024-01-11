import { IconButton, useColorScheme } from "@mui/joy";
import { useEffect } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ToggleButton() {
  const { mode, setMode } = useColorScheme();

  function handleSetMode() {
    setMode(mode === "dark" ? "light" : "dark");
  }

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return (
    <IconButton variant="plain" onClick={handleSetMode}>
      {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
