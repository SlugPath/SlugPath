import { Card, Typography } from "@mui/joy";
import { Draggable } from "@hello-pangea/dnd";
import { StoredCourse } from "../ts-types/Course";
import { getTitle } from "../../lib/courseUtils";

export default function CourseCard({
  course,
  index,
  draggableId,
  alreadyAdded,
}: {
  course: StoredCourse;
  index: number;
  draggableId: string;
  alreadyAdded?: boolean;
}) {
  return (
    <Draggable
      key={draggableId}
      draggableId={draggableId}
      index={index}
      isDragDisabled={alreadyAdded}
    >
      {(provided) => {
        return (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            size="sm"
            variant={alreadyAdded ? "soft" : "outlined"}
          >
            <Typography level="body-md">
              {course
                ? getTitle(course.department, course.number)
                : "No course"}
            </Typography>
          </Card>
        );
      }}
    </Draggable>
  );
}
