import { initialPlanner } from "@/lib/plannerUtils";
import useMajorSelection from "./useMajorSelection";
import usePlanner from "./usePlanner";

export function useDefaultPlanner(userId: string | undefined) {
  const { userMajorData } = useMajorSelection(userId);

  const skipLoad = userMajorData === undefined;
  const { courseState: plannerData } = usePlanner(
    {
      userId: undefined,
      plannerId: userMajorData ? userMajorData.defaultPlannerId : "",
      title: "Some title wow",
      order: 0,
    },
    initialPlanner(),
    skipLoad,
  );

  return {
    defaultPlanner: plannerData,
  };
}
