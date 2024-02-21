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

  const { data: defaultPlannerIdData, isLoading: defaultPlannerIdIsPending } =
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
    queryKey: ["userDefaultPlanner", defaultPlannerIdData],
    queryFn: async () => {
      if (!defaultPlannerIdData) return initialPlanner();
      return await getPlannerById(defaultPlannerIdData);
    },
    initialData: initialPlanner(),
    enabled: !!defaultPlannerIdData && !!session?.user.id,
  });

  // =================== user primary major START ===================
  const { data: primaryMajorData } = useQuery({
    queryKey: ["userPrimaryMajor", session?.user.id],
    queryFn: async () => {
      return await getUserPrimaryMajor(session!.user.id);
    },
    enabled: !!session?.user.id,
  });

  const [defaultPlannerId, setDefaultPlannerId] = useState<string | undefined>(
    undefined,
  );
  const [primaryMajor, setPrimaryMajor] = useState<Major | undefined>(
    undefined,
  );

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

  // =================== user primary major END ===================

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

  useEffect(() => {
    if (defaultPlannerIdData && majorDefaultPlanners) {
      const plannerIds = majorDefaultPlanners.map((planner) => planner.id);
      if (!plannerIds.includes(defaultPlannerIdData)) {
        setDefaultPlannerId(majorDefaultPlanners[0]?.id);
      } else {
        setDefaultPlannerId(defaultPlannerIdData);
      }
    }
  }, [defaultPlannerIdData, majorDefaultPlanners]);

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
