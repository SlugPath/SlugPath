import QuarterCard from "./QuarterCard";
import MajorCompletionModal from "./MajorCompletionModal";
import ExportModal from "./ExportModal";
import { initialPlanner } from "../../lib/initialPlanner";
import { PlannerData } from "../ts-types/PlannerData";
import useCoursePlanner from "../hooks/useCoursePlanner";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Search from "./Search";
import { MobileWarningModal } from "./isMobile";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

export default function CoursePlanner() {
  const {
    courseState,
    handleDragEnd,
    getCoursesAlreadyAdded,
    showExportModal,
    showMajorCompletionModal,
    showMobileWarning,
    setShowExportModal,
    setShowMajorCompletionModal,
  } = useCoursePlanner();

  return (
    <div className="bg-gray-100 mt-16">
      <Navbar
        setShowExportModal={setShowExportModal}
        setShowMajorCompletionModal={setShowMajorCompletionModal}
      />
      <ExportModal
        courseState={courseState}
        setShowModal={setShowExportModal}
        showModal={showExportModal}
      />
      <MajorCompletionModal
        setShowModal={setShowMajorCompletionModal}
        showModal={showMajorCompletionModal}
      />
      <MobileWarningModal show={showMobileWarning} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex">
          <div className="flex-1 px-4 py-6">
            <Search coursesAlreadyAdded={getCoursesAlreadyAdded()} />
          </div>
          <div className="flex-3 py-6">
            <Quarters courseState={courseState} />
          </div>
          <div className="flex-1">
            <RemoveCourseArea droppableId={"remove-course-area2"} />
          </div>
        </div>
      </DragDropContext>
      <Footer />
    </div>
  );
}

function RemoveCourseArea({ droppableId }: { droppableId: string }) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => {
        return (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`h-full ${snapshot.isDraggingOver ? "bg-red-200" : ""}`}
            style={{ height: "100%", minHeight: "48px" }}
          >
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
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
