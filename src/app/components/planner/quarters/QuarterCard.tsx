import { getTotalCredits } from "@/lib/plannerUtils";
import { StoredCourse } from "@customTypes/Course";
import { Droppable } from "@hello-pangea/dnd";
import { Card, Chip } from "@mui/joy";

import DraggableCourseCard from "./courses/DraggableCourseCard";

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

  return (
    <Card size="md" className="min-w-[130px] w-full" variant="plain">
      <div className="flex justify-between items-center">
        {title}
        <Chip component="span" size="sm">
          {totalCredits} Credits
        </Chip>
      </div>
      <Droppable droppableId={id}>
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
