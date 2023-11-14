import { Draggable } from "@hello-pangea/dnd";
import { StoredCourse } from "../types/Course";
import CourseCard from "./CourseCard";

export default function DraggableCourseCard({
  course,
  index,
  draggableId,
  alreadyAdded,
  onDelete,
}: {
  course: StoredCourse;
  index: number;
  draggableId: string;
  alreadyAdded?: boolean;
  onDelete: undefined | ((index: number) => void);
}) {
  return (
    <Draggable
      key={draggableId}
      draggableId={draggableId}
      index={index}
      isDragDisabled={alreadyAdded}
    >
      {(provided, snapshot) => {
        return (
          <CourseCard
            course={course}
            index={index}
            alreadyAdded={alreadyAdded}
            onDelete={onDelete}
            provided={provided}
            isDragging={snapshot.isDragging}
          />
        );
      }}
    </Draggable>
  );
}
