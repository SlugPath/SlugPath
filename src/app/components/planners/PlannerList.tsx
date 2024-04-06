"use client";

import { PlannersContext } from "@/app/contexts/PlannersProvider";
import { cn } from "@/lib/utils";
import { MajorVerificationProvider } from "@contexts/MajorVerificationProvider";
import { PlannerProvider } from "@contexts/PlannerProvider";
import { useContext } from "react";

import Planner from "../planner/Planner";

export default function PlannerList() {
  const { planners, activePlanner } = useContext(PlannersContext);

  if (!planners || planners.length == 0) return <HelpfulTips />;

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      {planners.map(({ id, title }, index) => (
        <div
          key={id}
          className={cn(
            activePlanner === id ? "flex w-full flex-1 min-h-0" : "hidden",
          )}
        >
          <MajorVerificationProvider>
            <PlannerProvider plannerId={id} title={title} order={index}>
              <Planner isActive={activePlanner === id} />
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
