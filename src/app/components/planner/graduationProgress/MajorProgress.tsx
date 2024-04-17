import { Typography } from "@mui/material";

import MajorProgressBar from "./MajorProgressBar";

export default function MajorProgress({
  majorProgressPercentage,
}: {
  majorProgressPercentage: { [key: string]: number };
}) {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col w-full">
        <Typography sx={{ marginBottom: 0.2 }}>Programs</Typography>
        <MajorProgressBar percentages={majorProgressPercentage} />
      </div>
    </div>
  );
}
