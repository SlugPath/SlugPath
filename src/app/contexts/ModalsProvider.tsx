import { Program } from "@/app/types/Program";
import { PlannerContext } from "@contexts/PlannerProvider";
import { SetShow, SetState } from "@customTypes/Common";
import { PlannerData } from "@customTypes/Planner";
import { createContext, useContext } from "react";

import useModals from "../hooks/useModals";

export interface ModalsContextProps {
  showMajorsModal: boolean;
  setShowMajorsModal: SetShow;
  showReplaceRLModal: boolean;
  setShowReplaceRLModal: SetShow;
  showMajorRequirementsEditModal: boolean;
  setShowMajorRequirementsEditModal: SetShow;
  showNewPlannerModal: boolean;
  setShowNewPlannerModal: SetShow;
  courseState: PlannerData;
  majorToEdit: Program | undefined;
  setMajorToEdit: SetState<Program | undefined>;
}

export const ModalsContext = createContext({} as ModalsContextProps);

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const {
    showMajorsModal,
    setShowMajorsModal,
    showReplaceRLModal,
    setShowReplaceRLModal,
    showMajorRequirementsEditModal,
    setShowMajorRequirementsEditModal,
    showNewPlannerModal,
    setShowNewPlannerModal,
    majorToEdit,
    setMajorToEdit,
  } = useModals();

  const { courseState } = useContext(PlannerContext);

  return (
    <ModalsContext.Provider
      value={{
        showMajorsModal,
        setShowMajorsModal,
        showReplaceRLModal,
        setShowReplaceRLModal,
        showMajorRequirementsEditModal,
        setShowMajorRequirementsEditModal,
        showNewPlannerModal,
        setShowNewPlannerModal,
        courseState,
        majorToEdit,
        setMajorToEdit,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
}
