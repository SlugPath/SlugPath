"use client";

import { useRouter } from "next/navigation";

import MajorSelection from "./MajorSelection";

export default function MajorSelectionPage() {
  const router = useRouter();
  const redirectToPlanner = () => router.push("/planner");

  return (
    <MajorSelection
      saveButtonName="Next"
      onSaved={redirectToPlanner}
      onSkip={redirectToPlanner}
    />
  );
}
