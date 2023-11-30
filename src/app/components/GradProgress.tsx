import { Tooltip, Typography } from "@mui/joy";
import { Donut } from "theme-ui";
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
      <div className="flex flex-col place-items-center w-full pb-2">
        <div className="grid grid-cols-5 py-1 w-full">
          <div className="col-span-4">
            <Typography>Total Credits:</Typography>
            <Typography>
              {credits} / {TOTAL_CREDITS_NEEDED}
            </Typography>
          </div>
          <div className="justify-self-end">
            <Tooltip title="180 credits is needed for graduation" size="sm">
              <InfoIcon sx={{ color: "gray" }} />
            </Tooltip>
          </div>
        </div>
        <Donut
          value={percentage}
          sx={{
            color: getColor(percentage),
            strokeWidth: 3,
            // className: "flex place-self-center"
          }}
        ></Donut>
      </div>
    </>
  );
};
