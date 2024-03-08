import IsSatisfiedMark from "@/app/components/miscellaneous/IsSatisfiedMark";
import { GESMappedToCourses } from "@/lib/plannerUtils";
import { PlannerData } from "@customTypes/Planner";
import { Typography } from "@mui/joy";

export default function GraduationProgress({
  credits,
  courseState,
  majorProgressPercentage,
}: {
  credits: number;
  courseState: PlannerData;
  majorProgressPercentage: number;
}) {
  const creditsPercentage = Math.min((credits / 180) * 100, 100);
  const gePercentage = (GESMappedToCourses({ courseState }).size / 10) * 100;
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
