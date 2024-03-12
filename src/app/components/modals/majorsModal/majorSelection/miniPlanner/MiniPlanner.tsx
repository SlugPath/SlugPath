import { EMPTY_PLANNER, initialPlanner } from "@/lib/plannerUtils";
import { getPlannerById } from "@actions/planner";
import { useQuery } from "@tanstack/react-query";

import MiniQuarters from "./MiniQuarters";

export default function MiniPlanner({
  plannerId,
  active,
}: {
  plannerId: string;
  active?: boolean;
}) {
  const { data: courseState, isLoading: loading } = useQuery({
    queryKey: ["getPlanner", plannerId],
    queryFn: async () => await getPlannerById(plannerId),
    placeholderData: initialPlanner(),
    enabled: !!plannerId && plannerId !== EMPTY_PLANNER,
  });

  if (!active || plannerId === EMPTY_PLANNER || loading) {
    return <></>;
  }

  return <MiniQuarters courseState={courseState!} />;
}
