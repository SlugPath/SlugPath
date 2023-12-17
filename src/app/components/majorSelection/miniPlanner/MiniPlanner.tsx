import { useLoadPlanner } from "@/app/hooks/useLoad";
import MiniQuarters from "./MiniQuarters";
import { EMPTY_PLANNER, emptyPlanner } from "@/lib/plannerUtils";
import { Card, Skeleton } from "@mui/joy";

export default function MiniPlanner({
  plannerId,
  active,
}: {
  plannerId: string;
  active?: boolean;
}) {
  const skipLoad = plannerId === EMPTY_PLANNER;
  const [courseState, , { loading }] = useLoadPlanner({
    userId: undefined,
    plannerId: plannerId,
    skipLoad,
    defaultPlanner: emptyPlanner(),
  });

  if (!active || plannerId === EMPTY_PLANNER) {
    return <></>;
  }

  return (
    <Skeleton loading={loading} variant="rectangular">
      <Card variant="soft">
        <MiniQuarters courseState={courseState} />
      </Card>
    </Skeleton>
  );
}
