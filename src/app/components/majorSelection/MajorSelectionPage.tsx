"use client";

import { PlannerProvider } from "@/app/contexts/PlannerProvider";
import { useRouter } from "next/navigation";

import MajorSelection from "./MajorSelection";

export default function MajorSelectionPage() {
  const router = useRouter();
  const redirectToPlanner = () => router.push("/planner");

  return (
    <PlannerProvider plannerId="" order={0} title="">
      <MajorSelection
        saveButtonName="Next"
        onSaved={redirectToPlanner}
        onSkip={redirectToPlanner}
      />
    </PlannerProvider>
  );
}
