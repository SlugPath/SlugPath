import { LinearProgress, Box, Typography, ColorPaletteProp } from "@mui/joy";

const TOTAL_CREDITS_NEEDED = 180;
const colors = ["danger", "warning", "primary", "success"];

const getColor = (percentage: number) => {
  const idx = Math.floor((colors.length - 1) * percentage);
  console.log(`${colors[idx]}`);
  return colors[idx] ?? "neutral";
};

export const GradProgress = ({ credits }: { credits: number }) => {
  const percentage = Math.min(credits / TOTAL_CREDITS_NEEDED, 1);
  return (
    <>
      <Typography level="h4" fontSize="lg" sx={{ mb: 0.5 }}>
        Graduation Status - {credits} / {TOTAL_CREDITS_NEEDED} credits
      </Typography>
      <Box>
        <LinearProgress
          thickness={20}
          determinate
          variant="outlined"
          color={getColor(percentage) as ColorPaletteProp}
          value={percentage * 100}
        />
      </Box>
    </>
  );
};
