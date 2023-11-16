import { ChangeEvent, createContext } from "react";
import { useSession } from "next-auth/react";
import { usePlanners } from "../hooks/usePlanners";
import { MultiPlanner } from "../types/MultiPlanner";

interface PlannersContextProps {
  planners: MultiPlanner;
  removePlanner: (plannerId: string) => void;
  addPlanner: () => void;
  switchPlanners: (id: string, title: string) => void;
  changePlannerName: (event: ChangeEvent<HTMLInputElement>, id: string) => void;
}

export const PlannersContext = createContext({} as PlannersContextProps);

interface PlannersProviderProps {
  children: React.ReactNode;
}

export function PlannersProvider({ children }: PlannersProviderProps) {
  const { data: session } = useSession();
  const {
    planners,
    removePlanner,
    addPlanner,
    switchPlanners,
    changePlannerName,
  } = usePlanners(session?.user.id);

  return (
    <PlannersContext.Provider
      value={{
        planners,
        removePlanner,
        addPlanner,
        switchPlanners,
        changePlannerName,
      }}
    >
      {children}
    </PlannersContext.Provider>
  );
}
