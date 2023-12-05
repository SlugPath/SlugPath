import { Card } from "@mui/joy";
import usePlanner from "../../../hooks/usePlanner";
import MiniQuarters from "./MiniQuarters";
import { EMPTY_PLANNER } from "@/lib/plannerUtils";

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
    <>
      <Card>
        {plannerId}
        <MiniQuarters courseState={courseState} />
      </Card>
    </>
  );
}
