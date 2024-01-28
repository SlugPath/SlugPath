import { useLoadPlanner } from "@/app/components/planners/useLoad";
import { EMPTY_PLANNER, emptyPlanner } from "@/lib/plannerUtils";
import { Card, Skeleton } from "@mui/joy";

import MiniQuarters from "./MiniQuarters";

export default function MiniPlanner({
  plannerId,
  active,
  addCardContainer,
}: {
  plannerId: string;
  active?: boolean;
  addCardContainer?: boolean;
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
      {addCardContainer ? (
        <Card variant="soft">
          <MiniQuarters courseState={courseState} />
        </Card>
      ) : (
        <MiniQuarters courseState={courseState} />
      )}
    </Skeleton>
  );
}
