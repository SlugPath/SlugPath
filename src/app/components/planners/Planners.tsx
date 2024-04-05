"use client";

import usePlannerSync from "@/app/hooks/usePlannerSync";
import { PlannerData } from "@/app/types/Planner";
import { cn } from "@/lib/utils";
import usePlannersStore from "@/store/planners";
import { MajorVerificationProvider } from "@contexts/MajorVerificationProvider";
import { PlannerProvider } from "@contexts/PlannerProvider";

import Planner from "../planner/Planner";
import PlannerTabs from "./plannerTabs/PlannerTabs";

export default function Planners() {
  // Sync the local planners with the server on interval and beforeunload
  usePlannerSync();

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

function PlannerList() {
  const planners = usePlannersStore((state) => state.planners);
  const setPlanner = usePlannersStore((state) => state.setPlanner);
  const activePlannerId = usePlannersStore((state) => state.activePlannerId);

  // const activePlanner = useMemo(
  //   () => planners.find((planner) => planner.id === activePlannerId),
  //   [planners, activePlannerId],
  // );

  if (!planners || planners.length == 0) return <HelpfulTips />;

  // TODO: Remove providers; remove map; use only one planner
  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      {planners.map((planner) => (
        <div
          key={planner.id}
          className={cn(
            activePlannerId === planner.id
              ? "flex w-full flex-1 min-h-0"
              : "hidden",
          )}
        >
          <MajorVerificationProvider>
            <PlannerProvider
              planner={planner}
              setPlanner={(newPlanner: PlannerData) =>
                setPlanner(planner.id, newPlanner)
              }
            >
              {activePlannerId === planner.id && <Planner />}
            </PlannerProvider>
          </MajorVerificationProvider>
        </div>
      ))}
    </div>
  );
}

const HelpfulTips = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] text-secondary-900 dark:text-secondary-200">
      <div className="text-lg text-center">
        Click the <b>+</b> button above to create a new planner ✏️
      </div>
    </div>
  );
};
