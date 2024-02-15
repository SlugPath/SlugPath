import { initialPlanner } from "@/lib/plannerUtils";
import { UserMajorOutput, getUserMajorById } from "@actions/major";
import { getPlannerById } from "@actions/planner";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { createContext, useState } from "react";

import { SetState } from "../types/Common";
import { PlannerData } from "../types/Planner";

export interface DefaultPlannerContextProps {
  defaultPlanner: PlannerData;
  setDefaultPlannerId: SetState<string>;
  loadingDefaultPlanner: boolean;
  userMajorData: UserMajorOutput | null;
  loadingMajorData: boolean;
  errorMajorData: Error | null;
}

export const DefaultPlannerContext = createContext(
  {} as DefaultPlannerContextProps,
);

export function DefaultPlannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  const [defaultPlannerId, setDefaultPlannerId] = useState<string>("");

  // Get user major data
  const {
    data: userMajorData,
    isLoading: loadingMajorData,
    error: errorMajorData,
  } = useQuery({
    queryKey: ["userMajorData", session?.user.id],
    queryFn: async () => {
      const data = await getUserMajorById(session?.user.id ?? "");
      setDefaultPlannerId(data?.defaultPlannerId ?? "");
      return data;
    },
    initialData: null,
    enabled: !!session?.user.id,
  });

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
        userMajorData,
        loadingMajorData,
        errorMajorData,
        defaultPlanner,
        setDefaultPlannerId,
        loadingDefaultPlanner,
      }}
    >
      {children}
    </DefaultPlannerContext.Provider>
  );
}
