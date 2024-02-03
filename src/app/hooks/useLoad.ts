import { getPlanner } from "@/app/actions/planner";
import { initialPlanner } from "@/lib/plannerUtils";
import { PlannerData } from "@customTypes/Planner";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to load a planner
 * @param plannerId id of the planner to load
 * @param userId id of the user
 * @returns
 */
export const useLoadPlanner = ({
  plannerId,
  userId,
  skipLoad,
}: {
  plannerId: string | undefined;
  userId: string | undefined;
  skipLoad?: boolean;
}): [PlannerData, { loading: boolean; error: Error | null }] => {
  const {
    data: planner,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["getPlanner", userId, plannerId],
    queryFn: async () => {
      const res = await getPlanner({
        userId: userId!,
        plannerId: plannerId!,
      });
      if (!res) return initialPlanner();
      return res;
    },
    initialData: initialPlanner(),
    enabled: !skipLoad,
  });

  return [planner, { loading, error }];
};
