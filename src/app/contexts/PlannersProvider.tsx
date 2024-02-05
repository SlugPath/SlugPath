import { usePlanners } from "@components/planners/usePlanners";
import { PlannersContextProps } from "@customTypes/Context";
import { useSession } from "next-auth/react";
import { createContext } from "react";

import { PlannerData } from "../types/Planner";

export const PlannersContext = createContext({} as PlannersContextProps);

export function PlannersProvider({
  allPlanners,
  children,
}: {
  allPlanners: PlannerData[];
  children: React.ReactNode;
}) {
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
    activePlanner,
    deletedPlanner,
  } = usePlanners(session?.user.id, allPlanners);

  return (
    <PlannersContext.Provider
      value={{
        planners,
        removePlanner,
        getPlanner,
        setPlanner,
        addPlanner,
        switchPlanners,
        changePlannerName,
        replaceCurrentPlanner,
        activePlanner,
        deletedPlanner,
      }}
    >
      {children}
    </PlannersContext.Provider>
  );
}
