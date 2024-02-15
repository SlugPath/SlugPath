import { getSuggestedClasses } from "@/app/actions/course";
import { REPLACE_CUSTOM_DROPPABLE } from "@/lib/consts";
import { createCourseFromId } from "@/lib/plannerUtils";
import { truncateTitle } from "@/lib/utils";
import DraggableCourseCard from "@components/planner/quarters/courses/DraggableCourseCard";
import Search from "@components/search/Search";
import { CourseInfoProvider } from "@contexts/CourseInfoProvider";
import { PlannerContext } from "@contexts/PlannerProvider";
import { StoredCourse } from "@customTypes/Course";
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { Button, Card, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import CourseInfoModal from "./CourseInfoModal";

const courseNumberRegex = /[A-Z]{2,6} [0-9]{1,3}[A-Z]*/g;

export interface ReplaceCustomModalProps {
  onClose: () => void;
  onSave: () => void;
  isOpen: boolean;
  customCourse: StoredCourse;
}

export default function ReplaceCustomModal({
  onClose,
  isOpen,
  onSave,
  customCourse,
}: ReplaceCustomModalProps) {
  const suggestedClasses = Array.from(
    customCourse.title.toUpperCase().matchAll(courseNumberRegex),
  ).map((m) => m[0]);
  const [classes, setClasses] = useState<StoredCourse[]>([]);

  const { isLoading: suggestedLoading } = useQuery({
    queryKey: ["suggestedClasses", suggestedClasses],
    queryFn: async () => {
      const suggested = await getSuggestedClasses(suggestedClasses);
      setClasses(suggested);
      return suggested;
    },
    enabled: isOpen && suggestedClasses.length > 0,
  });

  const { replaceCustomCourse } = useContext(PlannerContext);
  const droppableId = REPLACE_CUSTOM_DROPPABLE + customCourse.id;

  function handleDragEnd(result: DropResult) {
    const { draggableId, destination } = result;
    if (!destination) return;
    addCourseFromSearch(draggableId, destination);
  }

  function addCourseFromSearch(
    draggableId: string,
    destination: DraggableLocation,
  ) {
    const course = createCourseFromId(draggableId);
    if (destination.droppableId === droppableId) {
      // Prevent duplicates
      if (!classes.find((c) => c.number === course.number)) {
        setClasses((prev) => [
          ...prev,
          {
            ...course,
            id: uuidv4(),
          },
        ]);
      }
    }
  }

  function removeCourse(index: number) {
    setClasses((prev) => {
      const newClasses = [...prev];
      newClasses.splice(index, 1);
      return newClasses;
    });
  }

  function handleSave() {
    if (classes.length === 0) {
      return;
    }
    replaceCustomCourse(customCourse.id, classes);
    onSave();
  }

  return (
    <CourseInfoProvider>
      <CourseInfoModal viewOnly />
      <Modal
        onClose={onClose}
        open={isOpen}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet
          sx={{
            width: "50%",
            margin: 10,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <Typography level="title-lg">
            Replacing &quot;{truncateTitle(customCourse.title)}&quot;
          </Typography>
          <div className="flex flex-row items-start gap-2">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Search displayCustomCourseSelection={false} />
              <Droppable
                droppableId={droppableId}
                isDropDisabled={suggestedLoading}
              >
                {(provided) => {
                  return (
                    <div className="flex flex-col w-1/2 gap-2 h-48">
                      <Card
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        variant="soft"
                        size="sm"
                        className="rounded-md mt-5 min-h-48"
                      >
                        {classes.map((course, index) => {
                          return (
                            <DraggableCourseCard
                              key={index}
                              course={course}
                              index={index}
                              draggableId={course.id}
                              quarterId={droppableId}
                              isCustom={false}
                              customDeleteCourse={() => removeCourse(index)}
                            />
                          );
                        })}
                        {classes.length === 0 && (
                          <Typography className="text-gray-400 text-center">
                            Drag official courses here
                          </Typography>
                        )}
                        {provided.placeholder}
                      </Card>
                      <div className="flex flex-row justify-center gap-2">
                        <Button onClick={onClose} variant="plain">
                          <Typography
                            level="body-lg"
                            sx={{
                              color: "white",
                            }}
                          >
                            Cancel
                          </Typography>
                        </Button>
                        <Button onClick={handleSave} color="success">
                          <Typography
                            level="body-md"
                            sx={{
                              color: "white",
                            }}
                          >
                            Confirm
                          </Typography>
                        </Button>
                      </div>
                    </div>
                  );
                }}
              </Droppable>
            </DragDropContext>
          </div>
          <ModalClose variant="plain" />
        </Sheet>
      </Modal>
    </CourseInfoProvider>
  );
}
