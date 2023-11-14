import { Card } from "@mui/joy";
import CourseCard from "./CourseCard";
import { StoredCourse } from "../ts-types/Course";
import { Droppable } from "@hello-pangea/dnd";
import { createIdFromCourse } from "../../lib/courseUtils";

export default function QuarterCard({
  title,
  id,
  courses,
  unavailableQuarters,
}: {
  title: string;
  id: string;
  courses: StoredCourse[];
  unavailableQuarters: string[];
}) {
  return (
    <Card
      size="sm"
      className="w-64 min-w-[130px]"
      style={{
        backgroundColor: unavailableQuarters.includes(id)
          ? "#FEE2E2"
          : "#FFFFFF",
      }}
    >
      {title}
      <Droppable droppableId={id}>
        {(provided) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ height: "100%", minHeight: "112px" }}
            >
              {courses.map((course, index) => (
                <CourseCard
                  key={index}
                  course={course}
                  index={index}
                  draggableId={createIdFromCourse(course)}
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
