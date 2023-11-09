import QuarterCard from "./QuarterCard";
import { quartersPerYear } from "../../lib/initialPlanner";
import { PlannerData } from "../ts-types/PlannerData";
import useCoursePlanner from "../hooks/useCoursePlanner";
import Search from "./Search";
import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Snackbar } from "@mui/joy";
import { PlaylistAddCheckCircleRounded, Warning } from "@mui/icons-material";

export default function CoursePlanner({
  id,
  isActive,
  onCourseStateChanged,
  title,
  order,
}: {
  id: string;
  order: number;
  isActive: boolean;
  title: string;
  onCourseStateChanged: any;
}) {
  const { data: session } = useSession();
  const [saveOpen, setSaveOpen] = useState(false);
  const [errOpen, setErrOpen] = useState(false);

  const {
    courseState,
    handleDragEnd,
    coursesAlreadyAdded,
    saveStatus,
    saveError,
  } = useCoursePlanner({
    userId: session?.user.id,
    plannerId: id,
    title,
    order,
  });

  useEffect(() => {
    onCourseStateChanged(courseState);
  }, [courseState, onCourseStateChanged]);

  useEffect(() => {
    if (saveStatus) setSaveOpen(true);
  }, [saveStatus]);

  useEffect(() => {
    if (saveError !== undefined) {
      setSaveOpen(false);
      setErrOpen(true);
    }
  }, [saveError]);

  if (!isActive) {
    return <></>;
  }

  return (
    <>
      {/* Snackbars to show save status */}
      <Snackbar
        variant="soft"
        color="primary"
        open={saveOpen}
        autoHideDuration={3000}
        onClose={() => setSaveOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        startDecorator={<PlaylistAddCheckCircleRounded />}
        endDecorator={
          <Button
            onClick={() => setSaveOpen(false)}
            size="sm"
            variant="soft"
            color="primary"
          >
            Dismiss
          </Button>
        }
      >
        Saving planner...
      </Snackbar>
      <Snackbar
        variant="soft"
        color="warning"
        open={errOpen}
        onClose={() => setErrOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        startDecorator={<Warning />}
        endDecorator={
          <Button
            onClick={() => setErrOpen(false)}
            size="sm"
            variant="soft"
            color="warning"
          >
            Dismiss
          </Button>
        }
      >
        Unable to save planner...
      </Snackbar>

      {/* End snackbars */}
      <div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex">
            <div className="flex-1 px-4 py-6">
              <Search coursesAlreadyAdded={coursesAlreadyAdded()} />
            </div>
            <div className="flex-2 py-6">
              <Quarters courseState={courseState} />
            </div>
            <div className="flex-1 py-6" />
          </div>
        </DragDropContext>
      </div>
    </>
  );
}

function Quarters({ courseState }: { courseState: PlannerData }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: quartersPerYear }, (_, index) => index).map((i) => {
        const slice_val = quartersPerYear * i;
        const quarters = courseState.quarters.slice(
          slice_val,
          slice_val + quartersPerYear,
        );
        return (
          <div key={i} className="flex flex-row space-x-2">
            {quarters.map((quarter) => {
              const courses = quarter.courses;

              return (
                <QuarterCard
                  id={quarter.id}
                  key={quarter.id}
                  title={quarter.title}
                  courses={courses}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
