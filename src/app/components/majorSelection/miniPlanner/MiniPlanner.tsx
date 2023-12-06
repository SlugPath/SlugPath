import { useLoadPlanner } from "@/app/hooks/useLoad";
import MiniQuarters from "./MiniQuarters";
import { EMPTY_PLANNER, emptyPlanner } from "@/lib/plannerUtils";
import { Skeleton } from "@mui/joy";

export default function MiniPlanner({
  plannerId,
  active,
}: {
  plannerId: string;
  active?: boolean;
}) {
  const skipLoad = plannerId == EMPTY_PLANNER;
  const [courseState] = useLoadPlanner({
    userId: undefined,
    plannerId: plannerId,
    skipLoad,
    defaultPlanner: emptyPlanner(),
  });

  if (!active) {
    return <></>;
  }

  return (
    <Skeleton loading={skipLoad} variant="rectangular">
      <MiniQuarters courseState={courseState} />
    </Skeleton>
  );
}
