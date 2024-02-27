import { createContext } from "react";

import useDefaultPlanners from "../components/modals/majorsModal/defaultPlannerSelection/useDefaultPlanners";
import useMajorSelection from "../components/modals/majorsModal/majorSelection/useMajorSelection";
import { SetState } from "../types/Common";
import { Major } from "../types/Major";
import { PlannerData, PlannerTitle } from "../types/Planner";

export interface DefaultPlannerContextProps {
  primaryMajor: Major | null;
  setPrimaryMajor: SetState<Major | null>;
  majorDefaultPlanners: PlannerTitle[] | undefined;
  loadingMajorDefaultPlanners: boolean;
  updateDefaultPlanner: (plannerId: string) => void;
  updateDefaultPlannerIsPending: boolean;
  userDefaultPlanner: PlannerData;
  defaultPlannerId: string | undefined;
  setDefaultPlannerId: SetState<string | undefined>;
  userMajors: Major[];
  userMajorsIsLoading: boolean;
  saveMajors: (majors: Major[]) => void;
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
  } = useMajorSelection();

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
