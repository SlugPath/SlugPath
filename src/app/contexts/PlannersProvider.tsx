import { SetShow, SetState } from "@customTypes/Common";
import { PlannerData } from "@customTypes/Planner";
import { createContext } from "react";

import { usePlannersOld } from "../hooks/usePlanners";

export interface MultiPlanner {
  planners: PlannerData[];
  activePlanner: string | undefined;
}

export interface PlannersContextProps {
  planners: PlannerData[];
  removePlanner: (plannerId: string) => void;
  addPlanner: () => void;
  getPlanner: (id: string) => PlannerData;
  setPlanner: (id: string, courseState: PlannerData) => void;
  switchPlanners: (id: string) => void;
  changePlannerName: (id: string, newTitle: string) => void;
  replaceCurrentPlanner: () => void;
  duplicatePlanner: (id: string) => void;
  activePlanner: string | undefined;
  showExportModal: boolean;
  setShowExportModal: SetState<boolean>;
  showShareModal: boolean;
  setShowShareModal: SetShow;
}

export interface PlannersProviderProps {
  children: React.ReactNode;
}

export const PlannersContext = createContext({} as PlannersContextProps);

export function PlannersProvider({ children }: PlannersProviderProps) {
  const {
    planners,
    removePlanner,
    addPlanner,
    getPlanner,
    setPlanner,
    switchPlanners,
    changePlannerName,
    replaceCurrentPlanner,
    duplicatePlanner,
    activePlanner,
    showExportModal,
    setShowExportModal,
    showShareModal,
    setShowShareModal,
  } = usePlannersOld();

  return (
    <PlannersContext.Provider
      value={{
        showExportModal,
        setShowExportModal,
        planners,
        removePlanner,
        getPlanner,
        setPlanner,
        addPlanner,
        switchPlanners,
        changePlannerName,
        replaceCurrentPlanner,
        duplicatePlanner,
        activePlanner,
        showShareModal,
        setShowShareModal,
      }}
    >
      {children}
    </PlannersContext.Provider>
  );
}
