import { PlannerData } from "@/app/types/PlannerData";
import { GESMappedToCourses } from "@/lib/plannerUtils";
import { Typography } from "@mui/joy";

import IsSatisfiedMark from "../../IsSatisfiedMark";

export default function GraduationProgress({
  credits,
  courseState,
  majorProgressPercentage,
}: {
  credits: number;
  courseState: PlannerData;
  majorProgressPercentage: number;
}) {
  const creditsPercentage = (credits / 180) * 100;
  const gePercentage =
    (Object.keys(GESMappedToCourses({ courseState })).length / 10) * 100;
  const totalPercentage: number = Math.floor(
    (creditsPercentage + gePercentage + majorProgressPercentage) / 3,
  );

  return (
    <div className="flex flex-col place-items-center w-full gap-1">
      <Typography level="title-lg">Graduation Progress</Typography>
      <div className="flex flex-row gap-1 place-items-center">
        <IsSatisfiedMark isSatisfied={totalPercentage == 100} />
        <Typography level="title-md">{totalPercentage}%</Typography>
      </div>
    </div>
  );
}
