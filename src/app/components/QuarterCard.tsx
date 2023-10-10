import { Card } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import CourseCard from "./CourseCard";
import { Course } from "../ts-types/Course"

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

export default function QuarterCard({ title, id, courses }: { title: string, id: string, courses: Course[] }) {
  return (
    <Card className="w-96">
      {title}
      <StrictModeDroppable droppableId={id} >
        {(provided, snapshot) => { return (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {courses.map((course, index) =>
              <CourseCard key={course.id} course={course} index={index} />
            )}
            {provided.placeholder}
          </div>
        )}}
      </StrictModeDroppable>
    </Card>
  );
}