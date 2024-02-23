"use client";

import { PlannersProvider } from "@contexts/PlannersProvider";
import { PlannerData } from "@customTypes/Planner";

import ExportModal from "../modals/exportModal/ExportModal";
import PlannerList from "./PlannerList";
import PlannerTabs from "./plannerTabs/PlannerTabs";

export default function Planners({ planners }: { planners: PlannerData[] }) {
  return (
    <PlannersProvider allPlanners={planners}>
      <div className="flex flex-col pt-4 mb-auto border-4 border-red-500 flex-1 min-w-0">
        <div className="flex justify-left px-7">
          <PlannerTabs />
        </div>
        <div className="flex px-5 border-blue-500 border-2 flex-1 justify-center items-stretch min-w-0">
          <PlannerList />
        </div>
      </div>
      <ExportModal />
    </PlannersProvider>
  );
}
