import QuarterCard from "./QuarterCard";
import { quartersPerYear } from "../../lib/initialPlanner";
import { PlannerData } from "../types/PlannerData";
import useCoursePlanner from "../hooks/useCoursePlanner";
import Search from "./Search";
import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SaveSnackbars from "./SaveSnackbars";
import { CircularProgress } from "@mui/joy";
import useDebounce from "../hooks/useDebounce";
import { GradProgress } from "./GradProgress";

export default function CoursePlanner({
  id,
  isActive,
  onCourseStateChanged,
  title,
  order,
  onShowCourseInfoModal,
}: {
  id: string;
  order: number;
  isActive: boolean;
  title: string;
  onCourseStateChanged: any;
  onShowCourseInfoModal: any;
}) {
  const { data: session, status } = useSession();
  const {
    handleOnDragStart,
    deleteCourse,
    totalCredits,
    unavailableQuarters,
    courseState,
    handleDragEnd,
    memoAlreadyCourses,
    saveStatus,
    saveError,
  } = useCoursePlanner({
    userId: session?.user.id,
    plannerId: id,
    title,
    order,
  });

  const [loading, setLoading] = useState(true);

  useDebounce({
    callback: () => setLoading(status === "loading"),
    delay: 1000,
    dependencies: [status],
  });

  useEffect(() => {
    onCourseStateChanged(courseState);
  }, [courseState, onCourseStateChanged]);

  if (!isActive) {
    return <></>;
  }

  return (
    <>
      <SaveSnackbars saving={saveStatus} saveError={saveError} />
      <div>
        <DragDropContext
          onDragEnd={handleDragEnd}
          onDragStart={handleOnDragStart}
        >
          <div className="flex">
            <div className="flex-initial pr-2">
              <Search
                coursesInPlanner={memoAlreadyCourses}
                onShowCourseInfoModal={onShowCourseInfoModal}
              />
            </div>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <div className="overflow-auto h-[92vh] w-auto">
                  <Quarters
                    courseState={courseState}
                    unavailableQuarters={unavailableQuarters}
                    deleteCourse={deleteCourse}
                    onShowCourseInfoModal={onShowCourseInfoModal}
                  />
                </div>
                <div className="pl-4 flex-initial self-start w-[145px] xl:w-[300px]">
                  <GradProgress credits={totalCredits} />
                </div>
              </>
            )}
          </div>
        </DragDropContext>
      </div>
    </>
  );
}

function Quarters({
  courseState,
  unavailableQuarters,
  deleteCourse,
  onShowCourseInfoModal,
}: {
  courseState: PlannerData;
  unavailableQuarters: string[];
  deleteCourse: any;
  onShowCourseInfoModal: any;
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: quartersPerYear }, (_, index) => index).map((i) => {
        const slice_val = quartersPerYear * i;
        const quarters = courseState.quarters.slice(
          slice_val,
          slice_val + quartersPerYear,
        );
        return (
          <div key={i} className="flex flex-row space-x-2">
            {quarters.map((quarter) => {
              const courses = quarter.courses;
              return (
                <QuarterCard
                  id={quarter.id}
                  key={quarter.id}
                  title={quarter.title}
                  courses={courses}
                  deleteCourse={deleteCourse(quarter.id)}
                  unavailableQuarters={unavailableQuarters}
                  onShowCourseInfoModal={onShowCourseInfoModal}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
