import QuarterCard from "./QuarterCard";
import { quartersPerYear } from "../../lib/initialPlanner";
import { PlannerData } from "../types/PlannerData";
import Search from "./Search";
import { DragDropContext } from "@hello-pangea/dnd";
import { useState } from "react";
import SaveSnackbars from "./SaveSnackbars";
import { CircularProgress } from "@mui/joy";
import useDebounce from "../hooks/useDebounce";
import { GradProgress } from "./GradProgress";
import { PlannerContext } from "../contexts/PlannerProvider";
import { useContext } from "react";
import PlannerActions from "./PlannerActions";
import { ModalsStateProvider } from "../contexts/ModalsStateProvider";
import MajorCompletionModal from "./MajorCompletionModal";
import ExportModal from "./ExportModal";
import CourseInfoModal from "./CourseInfoModal";

export default function Planner({ isActive }: { isActive: boolean }) {
  const {
    handleOnDragStart,
    handleDragEnd,
    totalCredits,
    courseState,
    memoAlreadyCourses,
    saveStatus,
    saveError,
  } = useContext(PlannerContext);
  const [loading, setLoading] = useState(true);

  useDebounce({
    callback: () => setLoading(status === "loading"),
    delay: 1000,
    dependencies: [status],
  });

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
            {/* <div className="pr-2 flex-initial"> */}
            <div className="flex-initial pr-2">
              <Search coursesInPlanner={memoAlreadyCourses} />
            </div>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <div className="overflow-auto h-[92vh] w-auto">
                  <Quarters courseState={courseState} />
                </div>
                {/* Modals and Grad Progress */}
                <div className="pl-4 flex-initial self-start">
                  <GradProgress credits={totalCredits} />
                  <ModalsStateProvider>
                    <PlannerActions />
                    <Modals />
                  </ModalsStateProvider>
                  {/* End Modals */}
                </div>
              </>
            )}
          </div>
        </DragDropContext>
      </div>
    </>
  );
}

function Modals() {
  return (
    <>
      <CourseInfoModal />
      <ExportModal />
      <MajorCompletionModal />
    </>
  );
}

function Quarters({ courseState }: { courseState: PlannerData }) {
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
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
