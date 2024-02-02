import { getPlanner } from "@/app/actions/planner";
import { emptyPlanner, initialPlanner } from "@/lib/plannerUtils";
import { SetState } from "@customTypes/Common";
import { PlannerData } from "@customTypes/Planner";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import useMajorSelection from "../components/majorSelection/useMajorSelection";

/**
 * Hook to load a planner
 * @param plannerId id of the planner to load
 * @param userId id of the user
 * @returns
 */
export const useLoadPlanner = ({
  plannerId,
  userId,
  defaultPlanner,
  skipLoad,
}: {
  plannerId: string | undefined;
  userId: string | undefined;
  defaultPlanner: PlannerData;
  skipLoad?: boolean;
}): [
  PlannerData,
  SetState<PlannerData>,
  { loading: boolean; error: Error | null },
] => {
  const [planner, setPlanner] = useState<PlannerData>(defaultPlanner);
  const { isLoading: loading, error } = useQuery({
    queryKey: ["getPlanner", userId, plannerId],
    queryFn: async () => {
      const res = await getPlanner({
        userId: userId!,
        plannerId: plannerId!,
      });
      if (!res) return emptyPlanner();

      setPlanner(res);
      return res;
    },
    enabled: !skipLoad,
  });

  return [planner, setPlanner, { loading, error }];
};
/**
 * Hook that loads the default planner of a particular user.
 * @param userId id of a user
 * @returns
 */
export const useLoadDefaultPlanner = (userId?: string) => {
  const { userMajorData } = useMajorSelection(userId);
  const plannerId = userMajorData?.defaultPlannerId ?? "";
  const skipLoad = userMajorData === undefined || plannerId === undefined;

  return useLoadPlanner({
    plannerId,
    userId: undefined,
    defaultPlanner: initialPlanner(),
    skipLoad,
  });
};
