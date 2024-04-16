"use client";

import { PlannerData } from "@/app/types/Planner";
import { cn } from "@/lib/utils";
import usePlannersStore from "@/store/planner";
import { MajorVerificationProvider } from "@contexts/MajorVerificationProvider";
import { PlannerProvider } from "@contexts/PlannerProvider";
import { useMemo } from "react";

import Planner from "../planner/Planner";

export default function PlannerList() {
  const planners = usePlannersStore((state) => state.planners);
  const setPlanner = usePlannersStore((state) => state.setPlanner);
  const activePlannerId = usePlannersStore((state) => state.activePlannerId);

  const activePlanner = useMemo(
    () => planners.find((planner) => planner.id === activePlannerId),
    [planners, activePlannerId],
  );

  if (!planners || planners.length == 0) return <HelpfulTips />;

  if (!activePlanner) {
    throw new Error("Active planner not found");
  }

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      {planners.map(({ id }) => (
        <div
          key={id}
          className={cn(
            activePlannerId === id ? "flex w-full flex-1 min-h-0" : "hidden",
          )}
        >
          <MajorVerificationProvider>
            <PlannerProvider
              planner={activePlanner}
              setPlanner={(newPlanner: PlannerData) =>
                setPlanner(activePlanner.id, newPlanner)
              }
            >
              <Planner isActive={activePlannerId === id} />
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
