import { CUSTOM_DROPPABLE } from "@/lib/consts";
import { createCourseDraggableId } from "@/lib/plannerUtils";
import { PlannerContext } from "@contexts/PlannerProvider";
import { StoredCourse } from "@customTypes/Course";
import { Droppable } from "@hello-pangea/dnd";
import { Add } from "@mui/icons-material";
import { Button, Card, Typography } from "@mui/joy";
import { useContext, useEffect, useMemo, useState } from "react";

import CustomCourseModal from "../modals/courseInfoModal/CustomCourseModal";
import DraggableCourseCard from "../planner/quarters/courses/DraggableCourseCard";

const MAX_CUSTOM_COURSES = 3;

export default function CustomCourseSelection() {
  const [tooManyError, setTooManyError] = useState(false);
  const { customCourses, handleAddCustom } = useContext(PlannerContext);
  const numCourses = useMemo(() => customCourses.length, [customCourses]);

  const [open, setOpen] = useState(false);

  // Handlers
  const handleAdd = ({
    description,
    title,
    credits,
    quartersOffered,
  }: StoredCourse) => {
    if (
      description === undefined ||
      title === undefined ||
      credits === undefined ||
      quartersOffered === undefined
    ) {
      setOpen(false);
      return;
    }
    handleAddCustom({ description, title, credits, quartersOffered });
    setOpen(false);
  };

  const handleOpen = () => {
    if (numCourses > MAX_CUSTOM_COURSES) {
      setTooManyError(true);
      return;
    }
    setOpen(true);
  };

  useEffect(() => {
    if (numCourses <= MAX_CUSTOM_COURSES) setTooManyError(false);
  }, [numCourses]);

  return (
    <Card className="w-80 mb-2 mr-2" variant="plain">
      <Button onClick={handleOpen} startDecorator={<Add />}>
        <Typography
          level="body-md"
          fontWeight="lg"
          sx={{
            color: "white",
          }}
        >
          Add Custom Course
        </Typography>
      </Button>
      <CustomCourseModal isOpen={open} onClose={handleAdd} />
      {tooManyError && (
        <div className="text-red-500 text-center text-md">
          Too many courses. Drag or delete one.
        </div>
      )}
      {customCourses.length > 0 && (
        <Droppable droppableId={CUSTOM_DROPPABLE}>
          {(provided) => {
            return (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ height: "100%" }}
              >
                {customCourses.map((course, index) => (
                  <DraggableCourseCard
                    key={index}
                    course={course}
                    index={index}
                    draggableId={createCourseDraggableId({
                      ...course,
                      suffix: "custom",
                    })}
                    isCustom
                  />
                ))}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      )}
    </Card>
  );
}
