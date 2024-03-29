import { Typography } from "@mui/joy";

import ProgressBar from "./ProgressBar";

const TOTAL_CREDITS_NEEDED = 180;

export const CreditsProgress = ({ credits }: { credits: number }) => {
  return (
    <>
      <div className="flex flex-col place-items-center w-full">
        <div className="flex flex-col w-full">
          <Typography>Credits: {credits} / 180</Typography>
        </div>
        <ProgressBar
          percentage={(credits / TOTAL_CREDITS_NEEDED) * 100}
          progressType="credit"
        />
      </div>
    </>
  );
};
