import { Draggable } from "@hello-pangea/dnd";
import { StoredCourse } from "../../../../types/Course";
import CourseCard from "./CourseCard";

export interface DraggableCourseCardProps {
  course: StoredCourse;
  index: number;
  draggableId: string;
  quarterId?: string;
  isCustom: boolean;
}
export default function DraggableCourseCard({
  course,
  index,
  draggableId,
  quarterId,
  isCustom = false,
}: DraggableCourseCardProps) {
  return (
    <Draggable key={draggableId} draggableId={draggableId} index={index}>
      {(provided) => {
        return (
          <CourseCard
            course={course}
            index={index}
            quarterId={quarterId}
            provided={provided}
            isCustom={isCustom}
          />
        );
      }}
    </Draggable>
  );
}
