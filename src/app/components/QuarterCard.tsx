import { Button, Card } from "@mui/joy";
import AddIcon from '@mui/icons-material/Add';
import CourseCard from "./CourseCard";
import { Course } from "../ts-types/Course"
import { StrictModeDroppable } from "./StrictModeDroppable";

export default function QuarterCard(
  {title, id, courses, onOpenCourseSelectionModal }: { title: string, id: string, courses: Course[], onOpenCourseSelectionModal: any }
) {
  return (
    <Card className="w-64">
      {title}
      <StrictModeDroppable droppableId={id} >
        {(provided) => { return (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ height: "100%" , minHeight: "48px" }}
          >
            {courses.map((course, index) =>
              <CourseCard key={index} course={course} index={index} />
            )}
            {provided.placeholder}
          </div>
        )}}
      </StrictModeDroppable>
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
