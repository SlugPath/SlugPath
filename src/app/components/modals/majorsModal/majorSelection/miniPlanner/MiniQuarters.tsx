import { QUARTERS_PER_YEAR, findCoursesInQuarter } from "@/lib/plannerUtils";
import { StoredCourse } from "@customTypes/Course";
import { PlannerData } from "@customTypes/Planner";
import { Quarter } from "@customTypes/Quarter";

import MiniQuarterCard from "./MiniQuarterCard";

export default function MiniQuarters({
  courseState,
}: {
  courseState: PlannerData;
}) {
  return (
    <div className="space-y-1 min-w-[130px]">
      {Array.from({ length: QUARTERS_PER_YEAR }, (_, index) => index).map(
        (i) => {
          const slice_val = QUARTERS_PER_YEAR * i;
          const quarters = courseState.quarters.slice(
            slice_val,
            slice_val + QUARTERS_PER_YEAR,
          );
          return (
            <div key={i} className="flex flex-row space-x-1">
              {quarters.map((quarter: Quarter, index: number) => {
                const courses: StoredCourse[] = findCoursesInQuarter(
                  courseState,
                  quarter,
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
        },
      )}
    </div>
  );
}
