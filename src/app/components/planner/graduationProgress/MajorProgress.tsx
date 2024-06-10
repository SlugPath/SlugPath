import { Typography } from "@mui/material";

import MajorProgressBar from "./MajorProgressBar";

export default function MajorProgress({
  majorProgressPercentages,
}: {
  majorProgressPercentages: { [key: string]: number };
}) {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col w-full">
        <Typography sx={{ marginBottom: 0.2 }}>
          {Object.keys(majorProgressPercentages).length > 2
            ? "Programs"
            : "Program"}
        </Typography>
        <MajorProgressBar percentages={majorProgressPercentages} />
      </div>
    </div>
  );
}
