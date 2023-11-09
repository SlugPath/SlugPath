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
import { useSession } from "next-auth/react";

export default function App() {
  const { data: session } = useSession();
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
  } = usePlanner(session?.user.id);

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
            />
          </ListItem>
        ))}
      </List>
      <Modals />
      <Footer />
    </div>
  );
}
