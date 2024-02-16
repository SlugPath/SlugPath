import {
  getMajorDefaultPlanners,
  getUserDefaultPlannerId,
  getUserPrimaryMajor,
  updateUserDefaultPlanner,
} from "@/app/actions/major";
import { Major } from "@/app/types/Major";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function useDefaultPlanners(
  major?: Major,
  onUpdated?: () => void,
) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { data: majorDefaultPlanners, isLoading: loadingMajorDefaultPlanners } =
    useQuery({
      queryKey: ["majorDefaults", major],
      queryFn: async () => {
        return await getMajorDefaultPlanners({
          userId: session!.user.id,
          major,
        });
      },
    });

  const { data: defaultPlannerId } = useQuery({
    queryKey: ["userDefaultPlanner", session!.user.id],
    queryFn: async () => {
      return await getUserDefaultPlannerId(session!.user.id);
    },
  });

  const { data: primaryMajor } = useQuery({
    queryKey: ["userPrimaryMajor", session!.user.id],
    queryFn: async () => {
      return await getUserPrimaryMajor(session!.user.id);
    },
  });

  const {
    mutate: updateDefaultPlanner,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["updateUserDefaultPlanner"],
    mutationFn: async (defaultPlannerId: string) => {
      queryClient.invalidateQueries({ queryKey: ["userDefaultPlanner", session?.user.id] });
      return await updateUserDefaultPlanner({
        userId: session!.user.id,
        defaultPlannerId: defaultPlannerId,
      });
    },
    onSuccess: () => {
      if (onUpdated) onUpdated();
      console.log("successfully updated default planner");
    },
  });

  return {
    primaryMajor,
    defaultPlannerId,
    majorDefaultPlanners,
    loadingMajorDefaultPlanners,
    updateDefaultPlanner,
    updateDefaultPlannerIsPending: isPending,
    updateDefaultPlannerIsError: isError,
  };
}
