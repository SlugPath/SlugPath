import { List, ListItem } from "@mui/joy";
import Planner from "./Planner";
import TabList from "./TabList";
import MajorCompletionModal from "./MajorCompletionModal";
import ExportModal from "./ExportModal";
import Navbar from "./Navbar";
import ScreenSizeWarning from "./ScreenSizeWarning";
import Footer from "./Footer";
import { useContext, useState } from "react";
import { initialPlanner } from "@/lib/initialPlanner";
import CourseInfoModal from "./CourseInfoModal";
import { StoredCourse } from "@/graphql/planner/schema";
import {
  PlannersContext,
  PlannersProvider,
} from "../contexts/PlannersProvider";
import { PlannerProvider } from "../contexts/PlannerProvider";

export default function App() {
  const [showMajorCompletionModal, setShowMajorCompletionModal] =
    useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCourseInfoModal, setShowCourseInfoModal] = useState(false);
  const [currentCourseState, setCurrentCourseState] = useState(initialPlanner);
  const [displayCourse, setDisplayCourse] = useState<
    StoredCourse | undefined
  >();

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
      <PlannersProvider>
        <div className="pt-4 mb-auto">
          <div className="flex justify-left px-7">
            <TabList />
          </div>
          <div className="px-5">
            <PlannerList
              setCurrentCourseState={setCurrentCourseState}
              handleShowCourseInfoModal={handleShowCourseInfoModal}
            />
          </div>
          <Modals />
        </div>
      </PlannersProvider>
      {/* Planner End */}

      {/* Footer Start */}
      <Footer />
      {/* Footer End */}
    </div>
  );
}

function PlannerList({
  setCurrentCourseState,
  handleShowCourseInfoModal,
}: any) {
  const { planners } = useContext(PlannersContext);
  return (
    <List>
      {Object.keys(planners).map((id, index) => (
        <ListItem sx={{ display: planners[id][1] ? "block" : "none" }} key={id}>
          <PlannerProvider plannerId={id} title={planners[id][0]} order={index}>
            <Planner
              isActive={planners[id][1]}
              onCourseStateChanged={setCurrentCourseState}
              onShowCourseInfoModal={handleShowCourseInfoModal}
            />
          </PlannerProvider>
        </ListItem>
      ))}
    </List>
  );
}
