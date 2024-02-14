import { REPLACE_CUSTOM_DROPPABLE } from "@/lib/consts";
import { createCourseFromId } from "@/lib/plannerUtils";
import DraggableCourseCard from "@components/planner/quarters/courses/DraggableCourseCard";
import Search from "@components/search/Search";
import { PlannerContext } from "@contexts/PlannerProvider";
import { StoredCourse } from "@customTypes/Course";
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { Button, Card, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface ReplaceCustomModalProps {
  onClose: () => void;
  isOpen: boolean;
  customCourse: StoredCourse;
}

export default function ReplaceCustomModal({
  onClose,
  isOpen,
  customCourse,
}: ReplaceCustomModalProps) {
  const [classes, setClasses] = useState<StoredCourse[]>([]);
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
      setClasses((prev) => [
        ...prev,
        {
          ...course,
          id: uuidv4(),
        },
      ]);
    }
  }

  function removeCourse(index: number) {
    setClasses((prev) => {
      const newClasses = [...prev];
      newClasses.splice(index, 1);
      return newClasses;
    });
  }

  function onSave() {
    replaceCustomCourse(customCourse.id, classes);
    onClose();
  }

  return (
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
          Replacing &quot;{customCourse.title}&quot;
        </Typography>
        <div className="flex flex-row items-start">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Search displayCustomCourseSelection={false} />
            <Droppable droppableId={droppableId}>
              {(provided) => {
                return (
                  <div className="flex flex-col w-1/2 gap-2">
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
                        <Typography className="text-gray-400">
                          Drag classes here
                        </Typography>
                      )}
                      {provided.placeholder}
                    </Card>
                    <Button onClick={onSave}>
                      <Typography level="body-md">
                        Confirm Replacement
                      </Typography>
                    </Button>
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        </div>
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}
