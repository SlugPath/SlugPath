import QuarterCard from "./QuarterCard";
import { quartersPerYear } from "../../lib/initialPlanner";
import { PlannerData } from "../ts-types/PlannerData";
import useCoursePlanner from "../hooks/useCoursePlanner";
import Search from "./Search";
import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function CoursePlanner({
  id,
  isActive,
  onCourseStateChanged,
  title,
  order,
}: {
  id: string;
  order: number;
  isActive: boolean;
  title: string;
  onCourseStateChanged: any;
}) {
  const { data: session } = useSession();

  const { courseState, handleDragEnd, coursesAlreadyAdded } = useCoursePlanner({
    userId: session?.user.id,
    plannerId: id,
    title,
    order,
  });

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
      {Array.from({ length: quartersPerYear }, (_, index) => index).map((i) => {
        const slice_val = quartersPerYear * i;
        const quarters = courseState.quarterOrder.slice(
          slice_val,
          slice_val + quartersPerYear,
        );
        return (
          <div key={i} className="flex flex-row space-x-2">
            {quarters.map((quarterId) => {
              const quarter = courseState.quarters[quarterId];
              const courses = quarter.courses;

              return (
                <QuarterCard
                  id={quarterId}
                  key={quarterId}
                  title={quarter.title}
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
