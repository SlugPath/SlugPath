import { Card } from "@mui/joy";
import CourseCard from "./CourseCard";
import { StoredCourse } from "../types/Course";
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
      className="w-64"
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
              style={{ height: "100%", minHeight: "48px" }}
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
