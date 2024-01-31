import { PlannerData, findCoursesInQuarter } from "@/app/types/Planner";
import { quartersPerYear } from "@/lib/plannerUtils";
import { StoredCourse } from "@customTypes/Course";
import { Quarter } from "@customTypes/Quarter";

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
