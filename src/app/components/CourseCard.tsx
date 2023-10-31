import { Card, Typography } from "@mui/joy";
import { Draggable } from "@hello-pangea/dnd";
import { StoredCourse } from "../ts-types/Course";
import { getTitle } from "../logic/Courses";

export default function CourseCard({
  course,
  index,
  draggableId,
}: {
  course: StoredCourse;
  index: number;
  draggableId: string;
}) {
  return (
    <Draggable key={draggableId} draggableId={draggableId} index={index}>
      {(provided) => {
        return (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            size="sm"
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
