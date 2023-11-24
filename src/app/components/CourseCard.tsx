import { Card, CardContent, Grid, Link, Typography } from "@mui/joy";
import { StoredCourse } from "../types/Course";
import {
  extractTermFromQuarter,
  getTitle,
  isOffered,
} from "../../lib/courseUtils";
import { useContext, useState } from "react";
import { DraggableProvided } from "@hello-pangea/dnd";
import { PlannerContext } from "../contexts/PlannerProvider";
import { ModalsContext } from "../contexts/ModalsProvider";
import { WarningAmberRounded } from "@mui/icons-material";
import CloseIconButton from "./CloseIconButton";

export default function CourseCard({
  course,
  index,
  alreadyAdded,
  quarterId,
  provided,
  isDragging,
}: {
  course: StoredCourse;
  index: number;
  alreadyAdded?: boolean;
  quarterId?: string;
  provided: DraggableProvided;
  isDragging: boolean;
}) {
  const { deleteCourse } = useContext(PlannerContext);
  const { onShowCourseInfoModal } = useContext(ModalsContext);
  const [highlighted, setHighlighted] = useState(false);
  const margin = 2;
  const getItemStyle = (draggableStyle: any) => ({
    userSelect: "none",
    margin: `0 0 ${margin}px 0`,
    ...draggableStyle,
  });

  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      size="sm"
      variant={"soft"}
      style={{
        ...getItemStyle(provided.draggableProps.style),
        height: "35px",
        justifyContent: "center",
        backgroundColor:
          isDragging || highlighted
            ? "rgb(226 232 240)"
            : alreadyAdded
            ? ""
            : "#F1F5F9",
      }}
      // className="bg-slate-200"
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
    >
      <CardContent>
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid xs={10}>
            <Typography
              // level="title-md"
              endDecorator={
                course &&
                !isOffered(
                  course.quartersOffered,
                  extractTermFromQuarter(quarterId),
                ) && <WarningAmberRounded color="warning" />
              }
            >
              <Link
                overlay
                underline="none"
                sx={{ color: "text.tertiary" }}
                onClick={() =>
                  onShowCourseInfoModal([
                    course,
                    extractTermFromQuarter(quarterId),
                  ])
                }
              >
                {course
                  ? getTitle(course.departmentCode, course.number)
                  : "No course"}
              </Link>
            </Typography>
          </Grid>
          <Grid xs={2}>
            {quarterId !== undefined && (
              <CloseIconButton
                onClick={() => deleteCourse(quarterId)(index)}
                sx={{
                  visibility: highlighted ? "visible" : "hidden",
                }}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
