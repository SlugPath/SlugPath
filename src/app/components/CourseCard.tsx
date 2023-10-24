import { Card, Typography } from "@mui/joy";
import { Draggable } from "@hello-pangea/dnd";
import { DummyCourse } from "../ts-types/Course";

export default function CourseCard({
  course,
  index,
}: {
  course: DummyCourse;
  index: number;
}) {
  function getTitle() {
    return `${course.department} ${course.number}`;
  }

  return (
    <Draggable key={course.id} draggableId={course.id} index={index}>
      {(provided) => {
        return (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            size="sm"
          >
            <Typography level="body-md">
              {course ? getTitle() : "No course"}
            </Typography>
          </Card>
        );
      }}
    </Draggable>
  );
}
