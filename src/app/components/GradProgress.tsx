import { Typography } from "@mui/joy";
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
      <div className="pt-16 flex flex-col place-items-center gap-4">
        <Donut
          value={percentage}
          sx={{
            color: getColor(percentage),
          }}
        ></Donut>
        <div className="grid grid-cols-2 items-center">
          <Typography className="text-sm grid-cols-1 justify-self-end">
            Total Credits:
          </Typography>
          <Typography className="grid-cols-1 justify-self-center">
            {credits} / {TOTAL_CREDITS_NEEDED}
          </Typography>
        </div>
        <Typography className="text-sm grid-cols-1 text-center">
          The total number of credits needed for graduation is 180.
        </Typography>
      </div>
    </>
  );
};
