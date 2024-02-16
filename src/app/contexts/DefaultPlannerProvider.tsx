import { initialPlanner } from "@/lib/plannerUtils";
import { DefaultPlannerContextProps } from "@customTypes/Context";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { createContext, useState } from "react";

import { getPlannerById } from "../actions/planner";
import useMajorSelection from "../components/majorSelection/useMajorSelection";
import { Major } from "../types/Major";
import { getUserDefaultPlannerId } from "../actions/major";

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

  // majorToAdd is the major the user may be about to add to their list of majors,
  // so that the defaultPlannerSelection component can display default planners for this major
  // as users search for a major to add.
  const [majorToAdd, setMajorToAdd] = useState<Major>({} as Major);

  const { data: defaultPlannerId } = useQuery({
    queryKey: ["userDefaultPlanner", session?.user.id],
    queryFn: async () => {
      return await getUserDefaultPlannerId(session?.user.id!);
    },
    initialData: "",
    enabled: !!session?.user.id
  })

  // Get the default planner data
  const { data: defaultPlanner, isLoading: loadingDefaultPlanner } = useQuery({
    queryKey: ["defaultPlanner", defaultPlannerId],
    queryFn: async () => {
      return await getPlannerById(defaultPlannerId!);
    },
    initialData: initialPlanner(),
    enabled: !!defaultPlannerId,
  });

  return (
    <DefaultPlannerContext.Provider
      value={{
        defaultPlanner,
        loadingDefaultPlanner,
        userMajors,
        userMajorsIsLoading,
        majorToAdd,
        setMajorToAdd,
        saveMajors,
        loadingSaveMajor,
        errorSavingMajor,
      }}
    >
      {children}
    </DefaultPlannerContext.Provider>
  );
}
