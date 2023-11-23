import { Draggable } from "@hello-pangea/dnd";
import { StoredCourse } from "../types/Course";
import CourseCard from "./CourseCard";

export default function DraggableCourseCard({
  course,
  index,
  draggableId,
  quarterId,
}: {
  course: StoredCourse;
  index: number;
  draggableId: string;
  quarterId?: string;
}) {
  return (
    <Draggable key={draggableId} draggableId={draggableId} index={index}>
      {(provided, snapshot) => {
        return (
          <CourseCard
            course={course}
            index={index}
            quarterId={quarterId}
            provided={provided}
            isDragging={snapshot.isDragging}
          />
        );
      }}
    </Draggable>
  );
}
