import {
  getMajorDefaultPlanners,
  getUserDefaultPlannerId,
  updateUserDefaultPlanner,
} from "@/app/actions/major";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function useDefaultPlanners(
  catalogYear: string,
  majorName: string,
  onUpdated?: () => void,
) {
  const { data: session } = useSession();
  const { data: majorDefaultPlanners, isLoading: loadingMajorDefaultPlanners } =
    useQuery({
      queryKey: ["majorDefaults", catalogYear, majorName],
      queryFn: async () => {
        return await getMajorDefaultPlanners({
          catalogYear,
          name: majorName,
        });
      },
      enabled: !!catalogYear && !!majorName,
    });

  const { data: defaultPlannerId } = useQuery({
    queryKey: ["userDefaultPlanner", session!.user.id],
    queryFn: async () => {
      return await getUserDefaultPlannerId(session!.user.id);
    },
  });

  const {
    mutate: updateDefaultPlanner,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["updateUserDefaultPlanner"],
    mutationFn: async (defaultPlannerId: string) => {
      return await updateUserDefaultPlanner({
        userId: session!.user.id,
        defaultPlannerId: defaultPlannerId,
      });
    },
    onSuccess: () => {
      if (onUpdated) onUpdated();
    },
  });

  return {
    defaultPlannerId,
    majorDefaultPlanners,
    loadingMajorDefaultPlanners,
    updateDefaultPlanner,
    updateDefaultPlannerIsPending: isPending,
    updateDefaultPlannerIsError: isError,
  };
}
