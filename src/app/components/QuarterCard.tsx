import { Button, Card } from "@mui/joy";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";
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

export default function QuarterCard(
  { title, id, courses, onOpenCourseSelectionModal }: { title: string, id: string, courses: Course[], onOpenCourseSelectionModal: any }
) {
  return (
    <Card className="w-64">
      {title}
      <StrictModeDroppable droppableId={id} >
        {(provided) => { return (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ height: "100%" , minHeight: "64px" }}
          >
            {courses.map((course, index) =>
              <CourseCard key={index} course={course} index={index} />
            )}
            {provided.placeholder}
          </div>
        )}}
      </StrictModeDroppable>
      <Button
        variant="plain"
        startDecorator={<AddIcon />}
        onClick={onOpenCourseSelectionModal}
        size="sm"
      >Course</Button>
    </Card>
  );
}