import { List, ListItem } from "@mui/joy";
import CoursePlanner from "./CoursePlanner";
import TabList from "./TabList";
import { usePlanner } from "../hooks/usePlanner";
import MajorCompletionModal from "./MajorCompletionModal";
import ExportModal from "./ExportModal";
import Navbar from "./Navbar";
import ScreenSizeWarning from "./ScreenSizeWarning";
import Footer from "./Footer";
import { useState } from "react";
import { initialPlanner } from "@/lib/initialPlanner";
import { useSession } from "next-auth/react";
import CourseInfoModal from "./CourseInfoModal";
import { StoredCourse } from "@/graphql/planner/schema";

export default function App() {
  const { data: session } = useSession();
  const [showMajorCompletionModal, setShowMajorCompletionModal] =
    useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCourseInfoModal, setShowCourseInfoModal] = useState(false);
  const [currentCourseState, setCurrentCourseState] = useState(initialPlanner);
  const [displayCourse, setDisplayCourse] = useState<
    StoredCourse | undefined
  >();
  const {
    planners,
    handleRemovePlanner,
    handleAddPlanner,
    handleSwitchPlanners,
    handleChangePlannerName,
  } = usePlanner(session?.user.id);

  function handleShowCourseInfoModal(course: StoredCourse) {
    setDisplayCourse(course);
    setShowCourseInfoModal(true);
  }

  const Modals = () => (
    <>
      <CourseInfoModal
        showModal={showCourseInfoModal}
        setShowModal={setShowCourseInfoModal}
        course={displayCourse}
      />
      <ExportModal
        courseState={currentCourseState}
        setShowModal={setShowExportModal}
        showModal={showExportModal}
      />
      <MajorCompletionModal
        setShowModal={setShowMajorCompletionModal}
        showModal={showMajorCompletionModal}
      />
    </>
  );

  return (
    <div className="h-full min-h-screen w-full bg-gray-100 flex flex-col justify-between">
      <ScreenSizeWarning />
      {/* Header Start */}
      <div className="">
        <Navbar
          setShowExportModal={setShowExportModal}
          setShowMajorCompletionModal={setShowMajorCompletionModal}
        />
      </div>
      {/* Header End */}

      {/* Planner Start */}
      <div className="pt-4 mb-auto">
        <div className="flex justify-left px-7">
          <TabList
            planners={planners}
            onRemovePlanner={handleRemovePlanner}
            onAddPlanner={handleAddPlanner}
            onSwitchPlanners={handleSwitchPlanners}
            onChangePlannerName={handleChangePlannerName}
          />
        </div>
        <div className="px-5">
          {Object.keys(planners).length == 0 ? (
            <div className="flex flex-col items-center justify-center h-[80vh]">
              <div className="text-2xl font-semibold">
                Welcome to UCSC Course Planner!
              </div>
              <div className="text-lg text-center">
                To get started, click the <b>+</b> button above to create a new
                planner.
              </div>
              <div className="text-sm text-slate-600 flex flex-row items-end gap-2 text-center pt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="red"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <span>
                  (Login to save your progress - Your progress will not be saved
                  if you login after creating a planner)
                </span>
              </div>
            </div>
          ) : (
            <></>
          )}
          <List>
            {Object.keys(planners).map((id, index) => (
              <ListItem
                sx={{ display: planners[id][1] ? "block" : "none" }}
                key={id}
              >
                <CoursePlanner
                  order={index}
                  title={planners[id][0]}
                  id={id}
                  isActive={planners[id][1]}
                  onCourseStateChanged={setCurrentCourseState}
                  onShowCourseInfoModal={handleShowCourseInfoModal}
                />
              </ListItem>
            ))}
          </List>
        </div>
        <Modals />
      </div>
      {/* Planner End */}

      {/* Footer Start */}
      <Footer />
      {/* Footer End */}
    </div>
  );
}
