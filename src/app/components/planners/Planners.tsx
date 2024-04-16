"use client";

import { PlannersStoreProvider } from "@/app/contexts/PlannersProvider";
import usePlannerSync from "@/app/hooks/usePlannerSync";
import usePlannersStore from "@/app/hooks/usePlanners";
import { PlannerData } from "@/app/types/Planner";
import useModalsStore from "@/store/modal";
import { MajorVerificationProvider } from "@contexts/MajorVerificationProvider";
import { PlannerProvider } from "@contexts/PlannerProvider";
import { useMemo } from "react";

import CourseInfoModal from "../modals/courseInfoModal/CourseInfoModal";
import Planner from "../planner/Planner";
import PlannerTabs from "./plannerTabs/PlannerTabs";

export default function Planners({
  initialPlanners,
}: {
  initialPlanners?: PlannerData[];
}) {
  return (
    <PlannersStoreProvider initialPlanners={initialPlanners}>
      <div className="flex flex-col py-4 mb-auto flex-1 min-h-0 gap-4">
        <div className="flex justify-left px-7">
          <PlannerTabs />
        </div>
        <div className="flex px-5 flex-1 justify-center items-stretch min-h-0">
          <ActivePlanner />
        </div>
      </div>
    </PlannersStoreProvider>
  );
}

function ActivePlanner() {
  // Sync the local planners with the server on interval and beforeunload
  usePlannerSync();

  // Planners Zustand store
  const { planners, setPlanner, activePlannerId } = usePlannersStore(
    (state) => ({
      planners: state.planners,
      setPlanner: state.setPlanner,
      activePlannerId: state.activePlannerId,
    }),
  );

  // CourseInfoModal Zustand store
  const {
    showCourseInfoModal,
    setShowCourseInfoModal,
    displayCourse,
    displayTerm,
  } = useModalsStore((state) => ({
    showCourseInfoModal: state.showCourseInfoModal,
    setShowCourseInfoModal: state.setShowCourseInfoModal,
    displayCourse: state.courseInfoDisplayCourse,
    displayTerm: state.courseInfoDisplayTerm,
  }));

  const activePlanner = useMemo(
    () => planners.find((planner) => planner.id === activePlannerId),
    [planners, activePlannerId],
  );

  if (!planners || planners.length == 0) return <HelpfulTips />;

  if (!activePlanner) {
    const plannerIds = planners.map((planner) => planner.id);
    throw new Error(
      `Active planner not found; Id ${activePlannerId} not found in planners ${plannerIds}`,
    );
  }

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
    </>
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
