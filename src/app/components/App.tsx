import { List, ListItem } from "@mui/joy";
import CoursePlanner from "./CoursePlanner";
import TabList from "./TabList";
import { usePlanner } from "../hooks/usePlanner";
import MajorCompletionModal from "./MajorCompletionModal";
import ExportModal from "./ExportModal";
import Navbar from "./Navbar";
import { MobileWarningModal, isMobile } from "./isMobile";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { initialPlanner } from "@/lib/initialPlanner";

export default function App() {
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [showMajorCompletionModal, setShowMajorCompletionModal] =
    useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentCourseState, setCurrentCourseState] = useState(initialPlanner);
  const {
    planners,
    handleRemovePlanner,
    handleAddPlanner,
    handleSwitchPlanners,
    handleChangePlannerName,
  } = usePlanner();

  // checks if user is on mobile device
  useEffect(() => {
    if (isMobile()) {
      setShowMobileWarning(true);
    }
  }, []);

  const Modals = () => (
    <>
      <ExportModal
        courseState={currentCourseState}
        setShowModal={setShowExportModal}
        showModal={showExportModal}
      />
      <MajorCompletionModal
        setShowModal={setShowMajorCompletionModal}
        showModal={showMajorCompletionModal}
      />
      <MobileWarningModal show={showMobileWarning} />
    </>
  );

  return (
    <div className="bg-gray-100 mt-16">
      <Navbar
        setShowExportModal={setShowExportModal}
        setShowMajorCompletionModal={setShowMajorCompletionModal}
      />
      <div className="flex justify-left px-6">
        <TabList
          planners={planners}
          onRemovePlanner={handleRemovePlanner}
          onAddPlanner={handleAddPlanner}
          onSwitchPlanners={handleSwitchPlanners}
          onChangePlannerName={handleChangePlannerName}
        />
      </div>
      <List>
        {Object.entries(planners).map(([id, [, isActive]]) => (
          <ListItem sx={{ display: isActive ? "block" : "none" }} key={id}>
            <CoursePlanner
              id={id}
              isActive={isActive}
              onCourseStateChanged={setCurrentCourseState}
            />
          </ListItem>
        ))}
      </List>
      <Modals />
      <Footer />
    </div>
  );
}
