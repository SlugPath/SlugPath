import { initialPlanner } from "@/lib/plannerUtils";
import { DefaultPlannerContextProps } from "@customTypes/Context";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { createContext, useState } from "react";

import { getPlannerById } from "../actions/planner";
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
    userMajors,
    userMajorsIsLoading,
    onAddMajor,
    loadingAddMajor,
    errorAddingMajor,
    onRemoveMajor,
    loadingRemoveMajor,
    errorRemovingMajor,
  } = useMajorSelection(session?.user.id);

  const [defaultPlannerId, setDefaultPlannerId] = useState<string>("");

  // TODO - figure out how to get and set user default planner

  // Get user major data
  // const {
  //   data: userMajorData,
  //   isLoading: loadingMajorData,
  //   error: errorMajorData,
  // } = useQuery({
  //   queryKey: ["userMajorData", session?.user.id],
  //   queryFn: async () => {
  //     const data = await getUserMajorById(session?.user.id ?? "");
  //     setDefaultPlannerId(data?.defaultPlannerId ?? "");
  //     return data;
  //   },
  //   initialData: null,
  //   enabled: !!session?.user.id,
  // });

  // Get the default planner data
  const { data: defaultPlanner, isLoading: loadingDefaultPlanner } = useQuery({
    queryKey: ["defaultPlanner", defaultPlannerId],
    queryFn: async () => {
      return await getPlannerById(defaultPlannerId);
    },
    initialData: initialPlanner(),
    enabled: !!defaultPlannerId,
  });

  return (
    <DefaultPlannerContext.Provider
      value={{
        defaultPlanner,
        setDefaultPlannerId,
        loadingDefaultPlanner,
        userMajors,
        userMajorsIsLoading,
        onAddMajor,
        loadingAddMajor,
        errorAddingMajor,
        onRemoveMajor,
        loadingRemoveMajor,
        errorRemovingMajor,
      }}
    >
      {children}
    </DefaultPlannerContext.Provider>
  );
}
