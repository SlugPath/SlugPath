import { Box, Typography } from "@mui/joy";
import { Donut } from "theme-ui";

const TOTAL_CREDITS_NEEDED = 180;
const colors = ["red", "orange", "blue", "green"];

const getColor = (percentage: number) => {
  const idx = Math.floor((colors.length - 1) * percentage);
  return colors[idx] ?? "neutral";
};

export const GradProgress = ({ credits }: { credits: number }) => {
  const percentage = Math.min(credits / TOTAL_CREDITS_NEEDED, 1);
  return (
    <>
      <Box>
        <Typography level="h4" fontSize="lg" sx={{ mb: 0.5 }}>
          Total Credits - {credits} / {TOTAL_CREDITS_NEEDED}
        </Typography>
        <Donut
          value={percentage}
          sx={{
            color: getColor(percentage),
          }}
        ></Donut>
      </Box>
    </>
  );
};
