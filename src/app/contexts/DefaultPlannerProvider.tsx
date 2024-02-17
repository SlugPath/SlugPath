import { DefaultPlannerContextProps } from "@customTypes/Context";
import { useSession } from "next-auth/react";
import { createContext, useState } from "react";

import useDefaultPlanners from "../components/majorSelection/defaultPlannerSelection/useDefaultPlanners";
import useMajorSelection from "../components/majorSelection/useMajorSelection";
import { Major } from "../types/Major";

export const DefaultPlannerContext = createContext(
  {} as DefaultPlannerContextProps,
);

export function DefaultPlannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [selectedMajor, setSelectedMajor] = useState<Major | undefined>(
    undefined,
  );

  const {
    saveMajors,
    userMajors,
    userMajorsIsLoading,
    loadingSaveMajor,
    errorSavingMajor,
  } = useMajorSelection(session?.user.id);

  const {
    primaryMajor,
    userDefaultPlanner,
    majorDefaultPlanners,
    loadingMajorDefaultPlanners,
    updateDefaultPlanner,
    updateDefaultPlannerIsPending,
    defaultPlannerId,
  } = useDefaultPlanners(selectedMajor);

  return (
    <DefaultPlannerContext.Provider
      value={{
        selectedMajor,
        setSelectedMajor,
        majorDefaultPlanners,
        loadingMajorDefaultPlanners,
        updateDefaultPlanner,
        updateDefaultPlannerIsPending,
        userDefaultPlanner,
        defaultPlannerId: defaultPlannerId as string | undefined,
        primaryMajor: primaryMajor as Major | undefined,
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
