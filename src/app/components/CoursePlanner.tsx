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
  const {
    handleOnDragStart,
    unavailableQuarters,
    courseState,
    handleDragEnd,
    coursesAlreadyAdded,
  } = useCoursePlanner();

  useEffect(() => {
    onCourseStateChanged(courseState);
  }, [courseState, onCourseStateChanged]);

  if (!isActive) {
    return <></>;
  }

  return (
    <div>
      <DragDropContext
        onDragEnd={handleDragEnd}
        onDragStart={handleOnDragStart}
      >
        <div className="flex">
          <div className="flex-1 pr-2">
            <Search coursesInPlanner={coursesAlreadyAdded()} />
          </div>
          <div className="flex-3 overflow-auto h-[92vh] w-auto">
            <Quarters
              courseState={courseState}
              unavailableQuarters={unavailableQuarters}
            />
          </div>
          <div className="flex-1" />
        </div>
      </DragDropContext>
    </div>
  );
}

function Quarters({
  courseState,
  unavailableQuarters,
}: {
  courseState: PlannerData;
  unavailableQuarters: string[];
}) {
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
                  unavailableQuarters={unavailableQuarters}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
