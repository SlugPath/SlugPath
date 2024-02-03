import { initialPlanner } from "@/lib/plannerUtils";
import { DefaultPlannerContextProps } from "@customTypes/Context";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { createContext, useState } from "react";

import { getUserMajorById } from "../actions/major";
import { PlannerData } from "../types/Planner";

export const DefaultPlannerContext = createContext(
  {} as DefaultPlannerContextProps,
);

export function DefaultPlannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  const [defaultPlanner, setDefaultPlanner] = useState<PlannerData>(
    initialPlanner(),
  ); // [defaultPlanner, setDefaultPlanner
  const {
    data: userMajorData,
    isLoading: loadingMajorData,
    error: errorMajorData,
  } = useQuery({
    queryKey: ["userMajorData", session?.user.id],
    queryFn: async () => {
      const data = await getUserMajorById(session?.user.id ?? "");
      if (!data) {
        setDefaultPlanner(initialPlanner());
      } else {
        setDefaultPlanner(data.defaultPlanner);
      }
      return data;
    },
    initialData: null,
    enabled: !!session?.user.id,
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
        hasAutoFilled,
        setHasAutoFilled,
        setDefaultPlanner,
      }}
    >
      {children}
    </DefaultPlannerContext.Provider>
  );
}
