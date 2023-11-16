import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/joy";
import { StoredCourse } from "../types/Course";
import { getTitle } from "../../lib/courseUtils";
import { useContext, useState } from "react";
import { DraggableProvided } from "@hello-pangea/dnd";
import CloseIcon from "@mui/icons-material/Close";
import { PlannerContext } from "../contexts/PlannerProvider";
import { ModalsStateContext } from "../contexts/ModalsStateProvider";

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
  const { onShowCourseInfoModal } = useContext(ModalsStateContext);
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
      variant={alreadyAdded ? "soft" : "outlined"}
      style={{
        ...getItemStyle(provided.draggableProps.style),
        height: "35px",
        justifyContent: "center",
        backgroundColor:
          isDragging || highlighted ? "#E5E7EB" : alreadyAdded ? "" : "#FFFFFF",
      }}
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
    >
      <CardContent>
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid xs={10}>
            <Typography level="body-sm">
              <Link
                overlay
                underline="none"
                href="#interactive-card"
                sx={{ color: "text.tertiary" }}
                onClick={() => onShowCourseInfoModal(course)}
              >
                {course
                  ? getTitle(course.department, course.number)
                  : "No course"}
              </Link>
            </Typography>
          </Grid>
          <Grid xs={2}>
            {quarterId !== undefined && (
              <IconButton
                onClick={() => deleteCourse(quarterId)(index)}
                variant="plain"
                size="sm"
                className={`bg-gray-200 hover:bg-gray-300 ${
                  highlighted ? "" : "invisible"
                }`}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
