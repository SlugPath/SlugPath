"use client";

import { useRouter } from "next/navigation";

import MajorSelection from "./components/majorSelection/MajorSelection";

export default function Page() {
  const router = useRouter();
  const redirectToPlanner = () => router.push("/planner");
  return (
    <MajorSelection
      saveButtonName="Next"
      onSaved={redirectToPlanner}
      onUserMajorAlreadyExists={redirectToPlanner}
      onSkip={redirectToPlanner}
    />
  );
}
