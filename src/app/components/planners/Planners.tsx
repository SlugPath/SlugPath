"use client";

import usePlannerSync from "@/app/hooks/usePlannerSync";
import { PlannerData } from "@/app/types/Planner";
import useModalsStore from "@/store/modal";
import usePlannersStore from "@/store/planners";
import { MajorVerificationProvider } from "@contexts/MajorVerificationProvider";
import { PlannerProvider } from "@contexts/PlannerProvider";
import { useMemo } from "react";

import CourseInfoModal from "../modals/courseInfoModal/CourseInfoModal";
import Planner from "../planner/Planner";
import PlannerTabs from "./plannerTabs/PlannerTabs";

export default function Planners() {
  // Sync the local planners with the server on interval and beforeunload
  usePlannerSync();

  // CourseInfoModal Zustand store
  const showCourseInfoModal = useModalsStore(
    (state) => state.showCourseInfoModal,
  );
  const setShowCourseInfoModal = useModalsStore(
    (state) => state.setShowCourseInfoModal,
  );
  const displayCourse = useModalsStore(
    (state) => state.courseInfoDisplayCourse,
  );
  const displayTerm = useModalsStore((state) => state.courseInfoDisplayTerm);

  return (
    <>
      {displayCourse && displayTerm && (
        <CourseInfoModal
          showModal={showCourseInfoModal}
          setShowModal={setShowCourseInfoModal}
          course={displayCourse}
          term={displayTerm}
        />
      )}
      <div className="flex flex-col py-4 mb-auto flex-1 min-h-0 gap-4">
        <div className="flex justify-left px-7">
          <PlannerTabs />
        </div>
        <div className="flex px-5 flex-1 justify-center items-stretch min-h-0">
          <ActivePlanner />
          {/* <Planner isActive /> */}
        </div>
      </div>
    </>
  );
}

function ActivePlanner() {
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
      <MajorVerificationProvider>
        <PlannerProvider
          planner={activePlanner}
          setPlanner={(newPlanner: PlannerData) =>
            setPlanner(activePlanner.id, newPlanner)
          }
        >
          {activePlanner && <Planner />}
        </PlannerProvider>
      </MajorVerificationProvider>
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
