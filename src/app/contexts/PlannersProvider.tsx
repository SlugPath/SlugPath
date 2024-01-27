import { createContext } from "react";
import { useSession } from "next-auth/react";
import { usePlanners } from "../components/planners/usePlanners";
import { PlannersContextProps } from "../types/Context";

export const PlannersContext = createContext({} as PlannersContextProps);

export function PlannersProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const {
    planners,
    removePlanner,
    addPlanner,
    switchPlanners,
    changePlannerName,
    replaceCurrentPlanner,
    activePlanner,
    plannersLoading,
    loadingDeletePlanner,
    deletedPlanner,
  } = usePlanners(session?.user.id);

  return (
    <PlannersContext.Provider
      value={{
        planners,
        removePlanner,
        addPlanner,
        switchPlanners,
        changePlannerName,
        replaceCurrentPlanner,
        activePlanner,
        plannersLoading,
        loadingDeletePlanner,
        deletedPlanner,
      }}
    >
      {children}
    </PlannersContext.Provider>
  );
}
