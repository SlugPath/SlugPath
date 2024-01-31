import { getAllPlanners, getPlanner } from "@/app/actions/planner";
import { SetState } from "@/app/types/Common";
import { PlannerData } from "@/app/types/Planner";
import { PlannerTitle } from "@/graphql/planner/schema";
import { initialLabels } from "@/lib/labels";
import { getTotalCredits, initialPlanner } from "@/lib/plannerUtils";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import useMajorSelection from "../majorSelection/useMajorSelection";

/**
 * Custom hook to load all planners for a particular user
 * @param userId id of the user
 * @returns
 */

export const useLoadAllPlanners = (
  userId: string | undefined,
  onLoadedPlanners?: (numPlanners: number) => void,
): [
  PlannerTitle[],
  SetState<PlannerTitle[]>,
  string | undefined,
  SetState<string | undefined>,
  { loading: boolean; error: Error | null },
] => {
  const [planners, setPlanners] = useState<PlannerTitle[]>([]);
  const [activePlanner, setActivePlanner] = useState<string | undefined>(
    undefined,
  );
  const { isLoading: loading, error } = useQuery({
    queryKey: ["getAllPlanners", userId],
    queryFn: async () => {
      const res = await getAllPlanners(userId ?? "");
      setPlanners(res);
      setActivePlanner(res[0]?.id);
      if (onLoadedPlanners) {
        onLoadedPlanners(res.length);
      }
    },
    enabled: !!userId,
  });

  return [
    planners,
    setPlanners,
    activePlanner,
    setActivePlanner,
    { loading, error },
  ];
};

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
  const { setHasAutoFilled } = useContext(DefaultPlannerContext);
  const [planner, setPlanner] = useState<PlannerData>(defaultPlanner);
  const { isLoading: loading, error } = useQuery({
    queryKey: ["getPlanner", userId, plannerId, defaultPlanner],
    queryFn: async () => {
      if (skipLoad) return undefined;
      const res = await getPlanner({
        userId: userId ?? "",
        plannerId: plannerId ?? "",
      });
      if (res) {
        setPlanner(res);
      } else {
        autofillWithDefaultPlanner();
      }
    },
    enabled: !skipLoad,
  });

  function autofillWithDefaultPlanner() {
    setPlanner({
      ...defaultPlanner,
      labels: initialLabels(),
    });
    if (getTotalCredits(defaultPlanner.courses) > 0) {
      setHasAutoFilled(true);
    }
  }

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

/**
 * Hook to load a user planner
 */
export const useLoadUserPlanner = ({
  userId,
  plannerId,
  skipLoad,
}: {
  userId: string | undefined;
  plannerId: string;
  skipLoad?: boolean;
}) => {
  const { defaultPlanner } = useContext(DefaultPlannerContext);
  const clonedPlanner = cloneDefaultPlanner(defaultPlanner);
  return useLoadPlanner({
    plannerId,
    userId,
    defaultPlanner: clonedPlanner,
    skipLoad,
  });
};

/**
 * Copies a PlannerData, but changes the id's of the courses within the planner
 * to prevent data inconsistencies
 * Also adds a value for notes
 * @param defaultPlanner a defaultPlanner
 * @returns a unique PlannerData instance
 */
const cloneDefaultPlanner = (defaultPlanner: PlannerData): PlannerData => {
  const clone = { ...defaultPlanner };
  // Create a lookup table between old ids and newStoredCourse
  const lookup = {} as any;
  defaultPlanner.courses.forEach((c) => {
    lookup[c.id] = { ...c, id: uuidv4() };
  });
  // Pass the new Stored courses to the clone
  clone.courses = Object.values(lookup);

  // Replace all the references in the quarters to course ids with their new
  // counterparts
  clone.quarters = defaultPlanner.quarters.map((q) => {
    return {
      ...q,
      courses: q.courses.map((crs) => {
        return lookup[crs].id;
      }),
      notes: "",
    };
  });
  return clone;
};
