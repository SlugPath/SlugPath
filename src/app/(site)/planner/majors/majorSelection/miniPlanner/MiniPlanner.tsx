import { usePlanner } from "@/app/hooks/reactQuery";
import { EMPTY_PLANNER } from "@/lib/plannerUtils";

import MiniQuarters from "./MiniQuarters";

export default function MiniPlanner({
  plannerId,
  active,
}: {
  plannerId: string;
  active?: boolean;
}) {
  const { data: planner, isLoading: loading } = usePlanner(plannerId);

  if (!active || plannerId === EMPTY_PLANNER || loading || !planner) {
    return <></>;
  }

  return <MiniQuarters courseState={planner} />;
}
