import { StoredCourse } from "@/app/types/Course";
import { REPLACE_CUSTOM_DROPPABLE } from "@/lib/consts";
import { createCourseFromId } from "@/lib/plannerUtils";
import DraggableCourseCard from "@components/planner/quarters/courses/DraggableCourseCard";
import Search from "@components/search/Search";
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { Card, Modal, Sheet, Typography } from "@mui/joy";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface ReplaceCustomModalProps {
  onClose: () => void;
  isOpen: boolean;
  customCourseId: string;
}

export default function ReplaceCustomModal({
  onClose,
  isOpen,
  customCourseId,
}: ReplaceCustomModalProps) {
  const [classes, setClasses] = useState<StoredCourse[]>([]);

  const droppableId = REPLACE_CUSTOM_DROPPABLE + customCourseId;

  function handleDragEnd(result: DropResult) {
    const { draggableId, destination } = result;
    if (!destination) return;
    addCourseFromSearch(draggableId, destination);
  }

  const addCourseFromSearch = (
    draggableId: string,
    destination: DraggableLocation,
  ) => {
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
  };

  const removeCourse = (index: number) => {
    setClasses((prev) => {
      const newClasses = [...prev];
      newClasses.splice(index, 1);
      return newClasses;
    });
  };
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
        <Typography level="title-lg">Replace Custom Course</Typography>
        <div className="flex flex-row items-start">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Search displayCustomCourseSelection={false} />
            <Droppable droppableId={droppableId}>
              {(provided) => {
                return (
                  <Card
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    variant="soft"
                    size="sm"
                    className="rounded-md w-1/2 mt-5 min-h-48"
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
                );
              }}
            </Droppable>
          </DragDropContext>
        </div>
      </Sheet>
    </Modal>
  );
}
