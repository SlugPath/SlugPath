import { useSession } from "next-auth/react";
import { createContext } from "react";

import { PlannersContextProps, PlannersProviderProps } from "./Types";
import { usePlanners } from "./usePlanners";

export const PlannersContext = createContext({} as PlannersContextProps);

export function PlannersProvider({
  allPlanners,
  children,
}: PlannersProviderProps) {
  const { data: session } = useSession();
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
    showShareModal,
    setShowExportModal,
    setShowShareModal,
  } = usePlanners(session?.user.id, allPlanners);

  return (
    <PlannersContext.Provider
      value={{
        showExportModal,
        setShowExportModal,
        showShareModal,
        setShowShareModal,
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
