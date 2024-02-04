import { Typography } from "@mui/material";

import ProgressBar from "./ProgressBar";

export default function MajorProgress({
  majorProgressPercentage,
}: {
  majorProgressPercentage: number;
}) {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col place-items-center w-full">
        <div className="flex flex-col w-full">
          <Typography>Major</Typography>
        </div>
        <ProgressBar percentage={majorProgressPercentage} />
      </div>
    </div>
  );
}
