import { Draggable } from "@hello-pangea/dnd";
import { StoredCourse } from "../types/Course";
import CourseCard from "./CourseCard";

export default function DraggableCourseCard({
  course,
  index,
  draggableId,
  alreadyAdded,
  quarterId,
  onShowCourseInfoModal,
}: {
  course: StoredCourse;
  index: number;
  draggableId: string;
  alreadyAdded?: boolean;
  quarterId?: string;
  onShowCourseInfoModal: any;
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
            quarterId={quarterId}
            provided={provided}
            isDragging={snapshot.isDragging}
            onShowCourseInfoModal={onShowCourseInfoModal}
          />
        );
      }}
    </Draggable>
  );
}
