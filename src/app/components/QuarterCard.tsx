import { Card } from "@mui/joy";
import DraggableCourseCard from "./DraggableCourseCard";
import { StoredCourse } from "../types/Course";
import { Droppable } from "@hello-pangea/dnd";
import { createIdFromCourse } from "../../lib/courseUtils";
import { PlannerContext } from "../contexts/PlannerProvider";
import { useContext } from "react";

export default function QuarterCard({
  title,
  id,
  courses,
  onShowCourseInfoModal,
}: {
  title: string;
  id: string;
  courses: StoredCourse[];
  onShowCourseInfoModal: any;
}) {
  const { unavailableQuarters } = useContext(PlannerContext);

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
                <DraggableCourseCard
                  key={index}
                  course={course}
                  index={index}
                  draggableId={createIdFromCourse(course)}
                  quarterId={id}
                  onShowCourseInfoModal={onShowCourseInfoModal}
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
