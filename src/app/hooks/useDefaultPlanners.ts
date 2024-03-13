import {
  getProgramDefaultPlanners,
  getUserDefaultPlannerId,
  getUserPrimaryMajor,
  updateUserDefaultPlanner,
} from "@/app/actions/program";
import { Program } from "@/app/types/Program";
import { initialPlanner } from "@/lib/plannerUtils";
import { getPlannerById } from "@actions/planner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";

// TODO: Extract async caching and querying logic from useState ?
// TODO: Why is there a useQuery and useMutation in the same hook?

export default function useDefaultPlanners(onUpdated?: () => void) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [defaultPlannerId, setDefaultPlannerId] = useState<string | undefined>(
    undefined,
  );
  const [primaryMajor, setPrimaryMajor] = useState<Program | null>(null);
  useQuery({
    queryKey: ["userPrimaryMajor", session?.user.id],
    queryFn: async () => {
      const res = await getUserPrimaryMajor(session!.user.id);
      if (res) setPrimaryMajor(res);
      return res;
    },
    enabled: !!session?.user.id,
  });

  // get user default plannerId
  const { isLoading: defaultPlannerIdIsPending } = useQuery({
    queryKey: ["userDefaultPlannerId", session?.user.id],
    queryFn: async () => {
      const res = await getUserDefaultPlannerId(session!.user.id);
      if (res) setDefaultPlannerId(res);
      return res;
    },
    enabled: !!session?.user.id,
  });

  // get user default planner
  const { data: userDefaultPlanner } = useQuery({
    queryKey: ["userDefaultPlanner", defaultPlannerId!],
    queryFn: async () => await getPlannerById(defaultPlannerId!),
    placeholderData: initialPlanner(),
    enabled: !!defaultPlannerId && !!session?.user.id,
  });

  // get major default planners for the primary major
  const { data: majorDefaultPlanners, isLoading: loadingMajorDefaultPlanners } =
    useQuery({
      queryKey: ["majorDefaults", session?.user.id, primaryMajor],
      queryFn: async () => {
        const res = await getProgramDefaultPlanners({
          userId: session!.user.id,
          program: primaryMajor!,
        });
        const ids = res.map((p) => p.id);
        // set defaultPlannerId to the first default planner id of the newly selected primary major
        // if it hasn't been already
        if (defaultPlannerId && !ids.includes(defaultPlannerId))
          setDefaultPlannerId(res[0]?.id);
        return res;
      },
      enabled: !!session?.user.id && !!primaryMajor,
    });

  // update the default planner
  const {
    mutate: updateDefaultPlanner,
    isPending: updateDefaultPlannerIsPending,
    isError: updateDefaultPlannerIsError,
  } = useMutation({
    mutationKey: ["updateUserDefaultPlannerId"],
    mutationFn: async (defaultPlannerId: string) =>
      await updateUserDefaultPlanner({
        userId: session!.user.id,
        defaultPlannerId: defaultPlannerId,
      }),
    onSuccess: () => {
      if (onUpdated) onUpdated();
      queryClient.refetchQueries({
        queryKey: ["userDefaultPlannerId", session?.user.id],
      });
      queryClient.refetchQueries({
        queryKey: ["userPrimaryMajor", session?.user.id],
      });
      queryClient.refetchQueries({
        queryKey: ["userDefaultPlanner"],
      });
    },
  });

  return {
    primaryMajor,
    setPrimaryMajor,
    userDefaultPlanner: userDefaultPlanner!,
    defaultPlannerId,
    setDefaultPlannerId,
    defaultPlannerIdIsPending,
    majorDefaultPlanners,
    loadingMajorDefaultPlanners,
    updateDefaultPlanner,
    updateDefaultPlannerIsPending,
    updateDefaultPlannerIsError,
  };
}
