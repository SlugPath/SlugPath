import { Card, Chip } from "@mui/joy";
import DraggableCourseCard from "./courses/DraggableCourseCard";
import { StoredCourse } from "../../../types/Course";
import { Droppable } from "@hello-pangea/dnd";
import { getTotalCredits } from "@/lib/plannerUtils";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { useContext } from "react";

export default function QuarterCard({
  title,
  id,
  courses,
}: {
  title: string;
  id: string;
  courses: StoredCourse[];
}) {
  const totalCredits = getTotalCredits(courses);
  const { showMajorProgressModal } = useContext(ModalsContext);

  return (
    <Card size="md" className="min-w-[130px] w-full" variant="plain">
      <div className="flex justify-between items-center">
        {title}
        <Chip component="span" size="sm">
          {totalCredits} Credits
        </Chip>
      </div>
      {/* disable quarterCard droppable when majorProgressModal droppable may be active, prevents dnd issues */}
      <Droppable droppableId={id} isDropDisabled={showMajorProgressModal}>
        {(provided) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ height: "100%", minHeight: "112px" }}
            >
              {courses.map((course, index) => (
                <DraggableCourseCard
                  key={index}
                  course={course}
                  index={index}
                  draggableId={course.id}
                  quarterId={id}
                  isCustom={false}
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
