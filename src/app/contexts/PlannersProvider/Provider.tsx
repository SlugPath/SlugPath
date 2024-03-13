import { createContext } from "react";

import { PlannersContextProps, PlannersProviderProps } from "./Types";
import { usePlanners } from "./usePlanners";

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
  } = usePlanners();

  return (
    <PlannersContext.Provider
      value={{
        showShareModal,
        setShowShareModal,
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
      }}
    >
      {children}
    </PlannersContext.Provider>
  );
}
