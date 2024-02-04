import { useColorScheme } from "@mui/joy";
import { blue } from "@mui/material/colors";

const lightColor = blue[200];
const darkColor = blue[600];
const fadedLightColor = blue[50];
const fadedDarkColor = "#172554";

export default function ProgressBar({ percentage }: { percentage: number }) {
  const { mode } = useColorScheme();
  const fadedBackgroundColor =
    mode === "dark" ? fadedDarkColor : fadedLightColor;
  const backgroundColor = mode === "dark" ? darkColor : lightColor;

  return (
    <div
      className="flex flex-row w-full h-6 rounded-md"
      style={{
        background: fadedBackgroundColor,
      }}
    >
      <div
        className="rounded-md"
        style={{
          width: `${percentage}%`,
          background: backgroundColor,
          transition: "width 0.25s",
        }}
      ></div>
    </div>
  );
}
