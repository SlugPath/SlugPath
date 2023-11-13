import { LinearProgress, Box, Typography } from "@mui/joy";

const TOTAL_CREDITS_NEEDED = 180;

export const GradProgress = ({ credits }: { credits: number }) => {
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
          color="success"
          value={Math.min((credits / TOTAL_CREDITS_NEEDED) * 100, 100)}
        />
      </Box>
    </>
  );
};
