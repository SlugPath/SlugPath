import { List, ListItem } from "@mui/joy";
import Planner from "./Planner";
import TabList from "./TabList";
import MajorCompletionModal from "./MajorCompletionModal";
import ExportModal from "./ExportModal";
import Navbar from "./Navbar";
import ScreenSizeWarning from "./ScreenSizeWarning";
import Footer from "./Footer";
import { useContext } from "react";
import CourseInfoModal from "./CourseInfoModal";
import {
  PlannersContext,
  PlannersProvider,
} from "../contexts/PlannersProvider";
import { PlannerProvider } from "../contexts/PlannerProvider";
import { ModalsStateProvider } from "../contexts/ModalsStateProvider";

export default function App() {
  return (
    <div className="h-full min-h-screen w-full bg-gray-100 flex flex-col justify-between">
      <ScreenSizeWarning />
      <ModalsStateProvider>
        {/* Header Start */}
        <Navbar />
        {/* Header End */}

        {/* Planner Start */}
        <PlannersProvider>
          <div className="pt-4 mb-auto">
            <div className="flex justify-left px-7">
              <TabList />
            </div>
            <div className="px-5">
              <PlannerList />
            </div>
            <Modals />
          </div>
        </PlannersProvider>
        {/* Planner End */}
      </ModalsStateProvider>

      {/* Footer Start */}
      <Footer />
      {/* Footer End */}
    </div>
  );
}

const Modals = () => (
  <>
    <CourseInfoModal />
    <ExportModal />
    <MajorCompletionModal />
  </>
);

function PlannerList() {
  const { planners } = useContext(PlannersContext);
  return (
    <List>
      {Object.keys(planners).map((id, index) => (
        <ListItem sx={{ display: planners[id][1] ? "block" : "none" }} key={id}>
          <PlannerProvider plannerId={id} title={planners[id][0]} order={index}>
            <Planner isActive={planners[id][1]} />
          </PlannerProvider>
        </ListItem>
      ))}
    </List>
  );
}
