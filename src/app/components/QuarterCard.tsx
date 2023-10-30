import { Button, Card } from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import CourseCard from "./CourseCard";
import { Course } from "../ts-types/Course";
import { Droppable } from "@hello-pangea/dnd";
import { useRef } from "react";

export default function QuarterCard({
  title,
  id,
  courses,
  onOpenCourseSelectionModal,
  draggedCourse,
}: {
  title: string;
  id: string;
  courses: Course[];
  onOpenCourseSelectionModal: any;
  draggedCourse: Course | null;
}) {
  const myRef = useRef(null)
  // Function to determine if a course is available in a specific quarter
  const isCourseAvailable = (course: Course | null) => {;
    if (!course) return false;
    console.log(title);
    return course.quartersOffered.includes(title);
  };

  // Event handler for when a course is dragged over a quarter card
  const handleOnDragOver = (e: React.DragEvent) => {
    console.log("h");
    e.preventDefault();
    const target = myRef.current;
    console.log(`${JSON.stringify(target)}`);
    if (target) {
      if (isCourseAvailable(draggedCourse)) {
        target.style.backgroundColor = "green";
      } else {
        target.style.backgroundColor = "red";
      }
    }
  };
  
  // Event handler for when a dragged course leaves the area of a quarter card
  const handleOnDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget.closest(".w-64");
    if (target) {
      target.style.backgroundColor = "";  // Reset background color
    }
  };

  return (
    <Card className="w-64"
      ref={myRef}
    >
      {title}
      <Droppable droppableId={id}>
        {(provided) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ height: "100%", minHeight: "48px" }}
              onDragOver={handleOnDragOver}   // Attach the drag over event to the droppable div
              onDragLeave={handleOnDragLeave} // Attach the drag leave event to the droppable div
            >
              {courses.map((course, index) => (
                <CourseCard key={index} course={course} index={index} />
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
      <div className="flex justify-end">
        <Button
          variant="plain"
          startDecorator={<AddIcon />}
          onClick={onOpenCourseSelectionModal}
          size="sm"
        />
      </div>
    </Card>
  );
}
