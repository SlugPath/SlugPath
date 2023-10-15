import { Card } from "@mui/joy";
import { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";
import CourseCard from "./CourseCard";
import { Course } from "../ts-types/Course";

// KEEP THIS! This is a workaround for a bug with Droppable in react-beautiful-dnd
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

export default function QuarterCard({
  title,
  id,
  courses,
}: {
  title: string;
  id: string;
  courses: Course[];
}) {
  return (
    <Card className="w-96" style={{ minHeight: "96px" }}>
      {title}
      <StrictModeDroppable droppableId={id}>
        {(provided) => {
          return (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </StrictModeDroppable>
    </Card>
  );
}
