import { initialPlanner } from "@/lib/plannerUtils";
import { DefaultPlannerContextProps } from "@customTypes/Context";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { createContext, useState } from "react";

import { getUserMajorById } from "../actions/major";
import { getPlannerById } from "../actions/planner";

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

  // setDefaultPlanner is to instantly set the default planner in the context for MajorSelectionModal
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  return (
    <DefaultPlannerContext.Provider
      value={{
        userMajorData,
        loadingMajorData,
        errorMajorData,
        defaultPlanner,
        setDefaultPlannerId,
        loadingDefaultPlanner,
        hasAutoFilled,
        setHasAutoFilled,
      }}
    >
      {children}
    </DefaultPlannerContext.Provider>
  );
}
