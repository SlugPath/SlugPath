import { quartersPerYear } from "@/lib/plannerUtils";
import { PlannerData, findCoursesInQuarter } from "../../../types/PlannerData";
import { StoredCourse } from "../../../types/Course";
import { Quarter } from "../../../types/Quarter";
import MiniQuarterCard from "../MiniQuarterCard";

export default function MiniQuarters({
  courseState,
}: {
  courseState: PlannerData;
}) {
  return (
    <div className="space-y-1 min-w-[130px]">
      {Array.from({ length: quartersPerYear }, (_, index) => index).map((i) => {
        const slice_val = quartersPerYear * i;
        const quarters = courseState.quarters.slice(
          slice_val,
          slice_val + quartersPerYear,
        );
        return (
          <div key={i} className="flex flex-row space-x-1">
            {quarters.map((quarter: Quarter, index: number) => {
              const courses: StoredCourse[] = findCoursesInQuarter(
                courseState,
                quarter.id,
              );

              return (
                <MiniQuarterCard
                  key={index}
                  quarter={quarter}
                  courses={courses}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
