import { Card } from "@mui/joy";
import { Draggable } from "react-beautiful-dnd";
import { DummyCourse } from "../ts-types/Course";

export default function CourseCard({
  course,
  index,
}: {
  course: DummyCourse;
  index: number;
}) {
  return (
    <Draggable key={course.id} draggableId={course.id} index={index}>
      {(provided) => {
        return (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {course.name}
          </Card>
        );
      }}
    </Draggable>
  );
}
