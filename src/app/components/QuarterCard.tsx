import { Card } from "@mui/joy";
import CourseCard from "./CourseCard";
import { StoredCourse } from "../ts-types/Course";
import { Droppable } from "@hello-pangea/dnd";

export default function QuarterCard({
  title,
  id,
  courses,
}: {
  title: string;
  id: string;
  courses: StoredCourse[];
}) {
  return (
    <Card className="w-64">
      {title}
      <Droppable droppableId={id}>
        {(provided) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ height: "100%", minHeight: "48px" }}
            >
              {courses.map((course, index) => (
                <CourseCard
                  key={index}
                  course={course}
                  index={index}
                  draggableId={course.uuid}
                />
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </Card>
  );
}
