"use client";

import { CourseInfoProvider } from "@/app/contexts/CourseInfoProvider";
import { MajorVerificationProvider } from "@/app/contexts/MajorVerificationProvider";
import { ModalsProvider } from "@/app/contexts/ModalsProvider/Provider";
import { PermissionsProvider } from "@/app/contexts/PermissionsProvider";
import { PlannerProvider } from "@contexts/PlannerProvider";
import { useRouter } from "next/navigation";

import { MajorAndPlannerSelection } from "../planner/graduationProgress/majorsModal/MajorsModal";

export default function MajorSelectionPage() {
  const router = useRouter();
  const redirectToPlanner = () => router.push("/planner");

  return (
    <ModalsProvider>
      <CourseInfoProvider>
        <PlannerProvider plannerId="" order={0} title="">
          <MajorVerificationProvider>
            <PermissionsProvider>
              <div className="grid place-items-center my-3 justify-center h-auto w-[80vw] mx-auto overflow-auto">
                <MajorAndPlannerSelection
                  isInPlannerPage={false}
                  onSavedDefaultPlanner={redirectToPlanner}
                />
              </div>
            </PermissionsProvider>
          </MajorVerificationProvider>
        </PlannerProvider>
      </CourseInfoProvider>
    </ModalsProvider>
  );
}
