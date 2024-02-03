import { StoredCourse } from "@customTypes/Course";
import { Draggable } from "@hello-pangea/dnd";

import CourseCard from "./CourseCard";

export interface DraggableCourseCardProps {
  course: StoredCourse;
  index: number;
  draggableId: string;
  isCustom: boolean;
  quarterId?: string;
  customDeleteCourse?: () => void;
}
export default function DraggableCourseCard({
  course,
  index,
  draggableId,
  quarterId,
  isCustom = false,
  customDeleteCourse,
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
            customDeleteCourse={customDeleteCourse}
          />
        );
      }}
    </Draggable>
  );
}
