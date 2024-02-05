import { getPlannerById } from "@/app/actions/planner";
import { EMPTY_PLANNER, initialPlanner } from "@/lib/plannerUtils";
import { Card, Skeleton } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";

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
  const { data: courseState, isLoading: loading } = useQuery({
    queryKey: ["getPlanner", plannerId],
    queryFn: async () => {
      return await getPlannerById(plannerId);
    },
    initialData: initialPlanner(),
    enabled: plannerId !== EMPTY_PLANNER,
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
