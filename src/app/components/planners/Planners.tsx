"use client";

// import usePlannersStore from "@/store/planners";
// import usePlannerSync from "@/app/hooks/usePlannerSync";
// import ExportModal from "../modals/exportModal/ExportModal";
import PlannerList from "./PlannerList";
import PlannerTabs from "./plannerTabs/PlannerTabs";

export default function Planners() {
  // Sync the local planners with the server on interval and beforeunload
  // usePlannerSync();

  return (
    <>
      <div className="flex flex-col py-4 mb-auto flex-1 min-h-0 gap-4">
        <div className="flex justify-left px-7">
          <PlannerTabs />
        </div>
        <div className="flex px-5 flex-1 justify-center items-stretch min-h-0">
          <PlannerList />
          {/* <Planner isActive /> */}
        </div>
      </div>
    </>
  );
}

// function Planner({ plannerId }: { plannerId: string }) {
//   const planners = usePlannersStore((state) => state.planners);
//   const plan

// }
