import { createContext } from "react";

import useDefaultPlanners from "../hooks/useDefaultPlanners";
import useProgramSelection from "../hooks/useMajorSelection";
import { SetState } from "../types/Common";
import { PlannerData, PlannerTitle } from "../types/Planner";
import { Program } from "../types/Program";

export interface DefaultPlannerContextProps {
  primaryMajor: Program | null;
  setPrimaryMajor: SetState<Program | null>;
  majorDefaultPlanners: PlannerTitle[] | undefined;
  loadingMajorDefaultPlanners: boolean;
  updateDefaultPlanner: (plannerId: string) => void;
  updateDefaultPlannerIsPending: boolean;
  userDefaultPlanner: PlannerData;
  defaultPlannerId: string | undefined;
  setDefaultPlannerId: SetState<string | undefined>;
  userMajors: Program[];
  userMajorsIsLoading: boolean;
  saveMajors: (majors: Program[]) => void;
  loadingSaveMajor: boolean;
  errorSavingMajor: boolean;
}

export const DefaultPlannerContext = createContext(
  {} as DefaultPlannerContextProps,
);

export function DefaultPlannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    saveMajors,
    userMajors,
    userMajorsIsLoading,
    loadingSaveMajor,
    errorSavingMajor,
  } = useProgramSelection();

  const {
    primaryMajor,
    setPrimaryMajor,
    userDefaultPlanner,
    majorDefaultPlanners,
    loadingMajorDefaultPlanners,
    updateDefaultPlanner,
    updateDefaultPlannerIsPending,
    defaultPlannerId,
    setDefaultPlannerId,
  } = useDefaultPlanners();

  return (
    <DefaultPlannerContext.Provider
      value={{
        primaryMajor,
        setPrimaryMajor,
        majorDefaultPlanners,
        loadingMajorDefaultPlanners,
        updateDefaultPlanner,
        updateDefaultPlannerIsPending,
        userDefaultPlanner,
        defaultPlannerId,
        setDefaultPlannerId,
        userMajors,
        userMajorsIsLoading,
        saveMajors,
        loadingSaveMajor,
        errorSavingMajor,
      }}
    >
      {children}
    </DefaultPlannerContext.Provider>
  );
}
