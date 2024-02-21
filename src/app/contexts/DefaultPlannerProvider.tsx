import { DefaultPlannerContextProps } from "@customTypes/Context";
import { useSession } from "next-auth/react";
import { createContext } from "react";

import useDefaultPlanners from "../components/majorSelection/defaultPlannerSelection/useDefaultPlanners";
import useMajorSelection from "../components/majorSelection/useMajorSelection";

export const DefaultPlannerContext = createContext(
  {} as DefaultPlannerContextProps,
);

export function DefaultPlannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  const {
    saveMajors,
    userMajors,
    userMajorsIsLoading,
    loadingSaveMajor,
    errorSavingMajor,
  } = useMajorSelection(session?.user.id);

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
