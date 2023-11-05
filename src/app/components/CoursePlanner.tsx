import { useEffect } from "react";
import QuarterCard from "./QuarterCard";
import { initialPlanner } from "../../lib/initialPlanner";
import { PlannerData } from "../ts-types/PlannerData";
import useCoursePlanner from "../hooks/useCoursePlanner";
import Search from "./Search";
import { DragDropContext } from "@hello-pangea/dnd";

export default function CoursePlanner({
  isActive,
  onCourseStateChanged,
}: {
  isActive: boolean;
  onCourseStateChanged: any;
}) {
  const { courseState, handleDragEnd, coursesAlreadyAdded } =
    useCoursePlanner();

  useEffect(() => {
    onCourseStateChanged(courseState);
  }, [courseState, onCourseStateChanged]);

  if (!isActive) {
    return <></>;
  }

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex">
          <div className="flex-1 px-4 py-6">
            <Search coursesAlreadyAdded={coursesAlreadyAdded()} />
          </div>
          <div className="flex-2 py-6">
            <Quarters courseState={courseState} />
          </div>
          <div className="flex-1 py-6" />
        </div>
      </DragDropContext>
    </div>
  );
}

function Quarters({ courseState }: { courseState: PlannerData }) {
  return (
    <div className="space-y-2">
      {Array.from(
        { length: initialPlanner.quartersPerYear },
        (_, index) => index,
      ).map((i) => {
        const slice_val = initialPlanner.quartersPerYear * i;
        const quarters = courseState.quarterOrder.slice(
          slice_val,
          slice_val + initialPlanner.quartersPerYear,
        );
        return (
          <div key={i} className="flex flex-row space-x-2">
            {quarters.map((quarterId) => {
              const quarter = courseState.quarters[quarterId];
              const courses = quarter.courses;

              return (
                <QuarterCard
                  title={quarter.title}
                  id={quarter.id}
                  key={quarter.id}
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
