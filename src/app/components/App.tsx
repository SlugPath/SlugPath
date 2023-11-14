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
    <div className="h-full min-h-screen w-full bg-gray-100 flex flex-col justify-between">
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
