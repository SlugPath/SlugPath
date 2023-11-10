import { Card, Typography } from "@mui/joy";
import { Draggable } from "@hello-pangea/dnd";
import { StoredCourse } from "../types/Course";
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
  const margin = 4;
  const getItemStyle = (draggableStyle: any) => ({
    userSelect: "none",
    margin: `0 0 ${margin}px 0`,
    ...draggableStyle,
  });

  return (
    <Draggable
      key={draggableId}
      draggableId={draggableId}
      index={index}
      isDragDisabled={alreadyAdded}
    >
      {(provided, snapshot) => {
        return (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            size="sm"
            variant={alreadyAdded ? "soft" : "outlined"}
            className={snapshot.isDragging ? "bg-gray-200" : ""}
            style={getItemStyle(provided.draggableProps.style)}
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
