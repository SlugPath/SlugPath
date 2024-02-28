"use client";

import { PlannersProvider } from "@/app/contexts/PlannersProvider";
import { PlannerData } from "@customTypes/Planner";

import ExportModal from "../modals/exportModal/ExportModal";
import ShareModal from "../modals/shareModal/ShareModal";
import PlannerList from "./PlannerList";
import PlannerTabs from "./plannerTabs/PlannerTabs";

export default function Planners({ planners }: { planners: PlannerData[]}) {
  return (
    <PlannersProvider allPlanners={planners}>
      <div className="pt-4 mb-auto">
        <div className="flex justify-left px-7">
          <PlannerTabs />
        </div>
        <div className="px-5">
          <PlannerList />
        </div>
      </div>
      <ExportModal />
      <ShareModal />
    </PlannersProvider>
  );
}
