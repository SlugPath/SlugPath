"use client";

import { MajorAndPlannerSelection } from "@/app/components/modals/majorsModal/MajorsModal";
import { CourseInfoProvider } from "@/app/contexts/CourseInfoProvider";
import { MajorVerificationProvider } from "@/app/contexts/MajorVerificationProvider";
import { ModalsProvider } from "@/app/contexts/ModalsProvider/Provider";
import { PermissionsProvider } from "@/app/contexts/PermissionsProvider";
import { useRouter } from "next/navigation";

export default function MajorSelectionPage() {
  const router = useRouter();
  const redirectToPlanner = () => router.push("/planner");

  return (
    <ModalsProvider>
      <CourseInfoProvider>
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
      </CourseInfoProvider>
    </ModalsProvider>
  );
}
