import usePlanner from "../../../hooks/usePlanner";
import MiniQuarters from "./MiniQuarters";
import { EMPTY_PLANNER } from "@/lib/plannerUtils";
import { Skeleton } from "@mui/joy";

export default function MiniPlanner({
  plannerId,
  title,
  order,
  active,
}: {
  plannerId: string;
  title: string;
  order: number;
  active?: boolean;
}) {
  const skipLoad = plannerId == EMPTY_PLANNER;
  const { courseState } = usePlanner(
    {
      userId: undefined,
      plannerId: plannerId,
      title,
      order,
    },
    skipLoad,
  );

  if (!active) {
    return <></>;
  }

  return (
    <Skeleton loading={skipLoad} variant="rectangular">
      <MiniQuarters courseState={courseState} />
    </Skeleton>
  );
}
