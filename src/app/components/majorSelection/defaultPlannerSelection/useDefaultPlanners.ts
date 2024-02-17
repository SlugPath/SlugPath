import {
  getMajorDefaultPlanners,
  getUserDefaultPlannerId,
  getUserPrimaryMajor,
  updateUserDefaultPlanner,
} from "@/app/actions/major";
import { getPlannerById } from "@/app/actions/planner";
import { Major } from "@/app/types/Major";
import { initialPlanner } from "@/lib/plannerUtils";
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
      queryKey: ["majorDefaults"],
      queryFn: async () => {
        return await getMajorDefaultPlanners({
          userId: session!.user.id,
          major,
        });
      },
    });

  const { data: defaultPlannerId, isLoading: defaultPlannerIdIsPending } =
    useQuery({
      queryKey: ["userDefaultPlannerId", session?.user.id],
      queryFn: async () => {
        console.log("fetch default planner id");
        return await getUserDefaultPlannerId(session!.user.id);
      },
      enabled: !!session?.user.id,
    });

  // get user default planner
  const { data: userDefaultPlanner } = useQuery({
    queryKey: ["userDefaultPlanner", defaultPlannerId],
    queryFn: async () => {
      if (!defaultPlannerId) return initialPlanner();
      return await getPlannerById(defaultPlannerId);
    },
    initialData: initialPlanner(),
    enabled: !!defaultPlannerId && !!session?.user.id,
  });

  const { data: primaryMajor } = useQuery({
    queryKey: ["userPrimaryMajor", session?.user.id],
    queryFn: async () => {
      return await getUserPrimaryMajor(session!.user.id);
    },
    enabled: !!session?.user.id,
  });

  const {
    mutate: updateDefaultPlanner,
    isPending: updateDefaultPlannerIsPending,
    isError: updateDefaultPlannerIsError,
  } = useMutation({
    mutationKey: ["updateUserDefaultPlannerId"],
    mutationFn: async (defaultPlannerId: string) => {
      queryClient.refetchQueries({
        queryKey: ["userDefaultPlannerId", session?.user.id],
      });
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
    primaryMajor,
    userDefaultPlanner: userDefaultPlanner!,
    defaultPlannerId,
    defaultPlannerIdIsPending,
    majorDefaultPlanners,
    loadingMajorDefaultPlanners,
    updateDefaultPlanner,
    updateDefaultPlannerIsPending,
    updateDefaultPlannerIsError,
  };
}
