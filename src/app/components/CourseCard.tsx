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
import { useState } from "react";
import { DraggableProvided } from "@hello-pangea/dnd";
import CloseIcon from "@mui/icons-material/Close";

export default function CourseCard({
  course,
  index,
  alreadyAdded,
  onDelete,
  provided,
  isDragging,
  onShowCourseInfoModal,
}: {
  course: StoredCourse;
  index: number;
  alreadyAdded?: boolean;
  onDelete: undefined | ((index: number) => void);
  provided: DraggableProvided;
  isDragging: boolean;
  onShowCourseInfoModal: any;
}) {
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
      // className={
      //   isDragging || highlighted
      //     ? "bg-gray-200"
      //     : alreadyAdded
      //     ? ""
      //     : "bg-white"
      // }
      className={isDragging ? "bg-gray-200" : "bg-white"}
      style={{
        ...getItemStyle(provided.draggableProps.style),
        height: "35px",
        justifyContent: "center",
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
            {onDelete !== undefined && (
              <IconButton
                onClick={() => onDelete(index)}
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
