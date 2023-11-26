import { Typography } from "@mui/joy";
import { Donut } from "theme-ui";
import { Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

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
      <div className="flex flex-col place-items-center gap-4 xl:w-64">
        <div className="flex py-1 justify-between w-full">
          <div>
            <Typography className="grid-cols-1 pl-2 xl:pl-0 justify-self-end">
              Total Credits:
            </Typography>
            <Typography className="grid-cols-1 pl-2 xl:pl-0 xl:justify-self-center">
              {credits} / {TOTAL_CREDITS_NEEDED}
            </Typography>
          </div>
          <Tooltip title="180 credits is needed for graduation">
            <InfoIcon sx={{ color: "gray" }} />
          </Tooltip>
        </div>
        <Donut
          value={percentage}
          sx={{
            color: getColor(percentage),
            strokeWidth: 3,
          }}
        ></Donut>
      </div>
    </>
  );
};
