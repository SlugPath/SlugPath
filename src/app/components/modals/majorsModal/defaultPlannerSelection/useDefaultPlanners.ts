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
import { useEffect, useState } from "react";

export default function useDefaultPlanners(onUpdated?: () => void) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const {
    primaryMajor,
    setPrimaryMajor,
    defaultPlannerId,
    setDefaultPlannerId,
    defaultPlannerIdIsPending,
  } = useUserPrimaryMajor();

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

  const { data: majorDefaultPlanners, isLoading: loadingMajorDefaultPlanners } =
    useQuery({
      queryKey: ["majorDefaults", session?.user.id, primaryMajor],
      queryFn: async () => {
        return await getMajorDefaultPlanners({
          userId: session!.user.id,
          major: primaryMajor,
        });
      },
      enabled: !!session?.user.id,
    });

  // whenever majorDefaultPlanners is fetched, update defaultPlannerId if it's not in the list
  useEffect(() => {
    if (defaultPlannerId && majorDefaultPlanners) {
      const plannerIds = majorDefaultPlanners.map((planner) => planner.id);
      if (!plannerIds.includes(defaultPlannerId)) {
        setDefaultPlannerId(majorDefaultPlanners[0]?.id);
      } else {
        setDefaultPlannerId(defaultPlannerId);
      }
    }
  }, [defaultPlannerId, majorDefaultPlanners, setDefaultPlannerId]);

  // conceptually, updates both primaryMajor and defaultPlannerId
  // defaultPlannerId is used to determine primary major
  const {
    mutate: updateDefaultPlanner,
    isPending: updateDefaultPlannerIsPending,
    isError: updateDefaultPlannerIsError,
  } = useMutation({
    mutationKey: ["updateUserDefaultPlannerId"],
    mutationFn: async (defaultPlannerId: string) => {
      return await updateUserDefaultPlanner({
        userId: session!.user.id,
        defaultPlannerId: defaultPlannerId,
      });
    },
    onSuccess: () => {
      if (onUpdated) onUpdated();
      queryClient.refetchQueries({
        queryKey: ["userDefaultPlannerId", session?.user.id],
      });
      queryClient.refetchQueries({
        queryKey: ["userPrimaryMajor", session?.user.id],
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

// this simply abstracts the logic for fetching the user's primary major and defaultPlannerId out
// which improves readability and reusability
function useUserPrimaryMajor() {
  const { data: session } = useSession();
  const { data: primaryMajorData } = useQuery({
    queryKey: ["userPrimaryMajor", session?.user.id],
    queryFn: async () => {
      return await getUserPrimaryMajor(session!.user.id);
    },
    enabled: !!session?.user.id,
  });
  const { data: defaultPlannerIdData, isLoading: defaultPlannerIdIsPending } =
    useQuery({
      queryKey: ["userDefaultPlannerId", session?.user.id],
      queryFn: async () => {
        return await getUserDefaultPlannerId(session!.user.id);
      },
      enabled: !!session?.user.id,
    });

  const [defaultPlannerId, setDefaultPlannerId] = useState<string | undefined>(
    undefined,
  );
  const [primaryMajor, setPrimaryMajor] = useState<Major | undefined>(
    undefined,
  );

  // update the local state when the data is fetched
  useEffect(() => {
    if (primaryMajorData) {
      setPrimaryMajor(primaryMajorData);
    }
  }, [primaryMajorData]);
  useEffect(() => {
    if (defaultPlannerIdData) {
      setDefaultPlannerId(defaultPlannerIdData);
    }
  }, [defaultPlannerIdData]);

  return {
    primaryMajor,
    setPrimaryMajor,
    defaultPlannerId,
    setDefaultPlannerId,
    defaultPlannerIdIsPending,
  };
}
