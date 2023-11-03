import { Button, Card } from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import CourseCard from "./CourseCard";
import { Course } from "../ts-types/Course";
import { Droppable } from "@hello-pangea/dnd";

export default function QuarterCard({
  title,
  id,
  courses,
  onOpenCourseSelectionModal,
  unavailableQuarters
}: {
  title: string;
  id: string;
  courses: Course[];
  onOpenCourseSelectionModal: any;
  unavailableQuarters: string[];
}) {

  return (
    <Card className="w-64" style={{backgroundColor: unavailableQuarters.includes(id) ? '#FEE2E2' : '#FFFFFF'}}>
      {title}
      <Droppable droppableId={id}>
        {(provided) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ height: "100%", minHeight: "48px"}}
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
