"use client";

import { PlannerProvider } from "@/app/contexts/PlannerProvider";
import { useRouter } from "next/navigation";

import MajorSelection from "./MajorSelection";

export default function MajorSelectionPage() {
  const router = useRouter();
  const redirectToPlanner = () => router.push("/planner");

  return (
    <PlannerProvider plannerId="" order={0} title="">
      <div className="grid place-items-center my-3 justify-center h-auto w-[66vw] mx-auto overflow-auto">
        <MajorSelection
          saveButtonName="Next"
          onSaved={redirectToPlanner}
          onSkip={redirectToPlanner}
        />
      </div>
    </PlannerProvider>
  );
}
