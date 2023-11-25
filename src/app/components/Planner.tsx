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
import { ModalsProvider } from "../contexts/ModalsProvider";
import MajorCompletionModal from "./MajorCompletionModal";
import ExportModal from "./ExportModal";
import CourseInfoModal from "./CourseInfoModal";
import { LabelsProvider } from "../contexts/LabelsProvider";

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
          <ModalsProvider>
            <div className="flex">
              <div className="flex-initial pr-2">
                <Search coursesInPlanner={memoAlreadyCourses} />
              </div>
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  <LabelsProvider>
                    <div className="overflow-auto h-[92vh] w-auto">
                      <Quarters courseState={courseState} />
                    </div>

                    {/* Modals and Grad Progress */}
                    <div className="pl-4 pt-7 self-start">
                      <div className="pb-6">
                        <PlannerActions />
                        <Modals />
                      </div>

                      <hr className="rounded border-t border-slate-400" />

                      <div className="pl-2 pt-8 flex justify-items-center">
                        <GradProgress credits={totalCredits} />
                      </div>
                    </div>
                  </LabelsProvider>
                  {/* End Modals */}
                </>
              )}
            </div>
          </ModalsProvider>
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
