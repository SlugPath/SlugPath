import { useSuggestedCourses } from "@/app/hooks/reactQuery";
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
import { useContext, useEffect, useState } from "react";
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
  // Get all the course numbers from the custom course title
  const suggestedTitles = Array.from(
    customCourse.title.toUpperCase().matchAll(courseNumberRegex),
  ).map((m) => m[0]);

  // Fetch the suggested classes from the database (to replace custom courses)
  const {
    data: initialSuggestedCourses,
    isLoading: initialSuggestedCoursesLoading,
  } = useSuggestedCourses(suggestedTitles);

  const [suggestedCourses, setSuggestedCourses] = useState<StoredCourse[]>([]);

  useEffect(() => {
    setSuggestedCourses(initialSuggestedCourses ?? []);
  }, [initialSuggestedCourses]);

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
    if (destination.droppableId !== droppableId) {
      return;
    }

    // Prevent duplicates
    if (!suggestedCourses!.find((c) => c.number === course.number)) {
      setSuggestedCourses((prev) => [
        ...prev,
        {
          ...course,
          id: uuidv4(),
        },
      ]);
    }
  }

  function removeCourse(index: number) {
    setSuggestedCourses((prev) => {
      const newClasses = [...prev];
      newClasses.splice(index, 1);
      return newClasses;
    });
  }

  function handleSave() {
    if (!suggestedCourses || suggestedCourses.length === 0) {
      return;
    }
    replaceCustomCourse(customCourse.id, suggestedCourses);
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
            minWidth: "50rem",
            margin: 10,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            minHeight: "30rem",
            height: "70%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Typography level="title-lg">
            Replacing &quot;{truncateTitle(customCourse.title)}&quot;
          </Typography>
          <div className="flex flex-row items-start gap-2 flex-1">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Card
                variant="soft"
                size="sm"
                sx={{
                  height: "100%",
                  flex: "1 1 0%",
                  paddingRight: "0.5rem",
                }}
              >
                <Search displayCustomCourseSelection={false} />
              </Card>
              <Droppable
                droppableId={droppableId}
                isDropDisabled={initialSuggestedCoursesLoading}
              >
                {(provided) => {
                  return (
                    <div className="flex flex-col w-full gap-2 h-fit px-5">
                      <Card
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        variant="soft"
                        size="sm"
                        className="rounded-md min-h-48"
                      >
                        {suggestedCourses &&
                          suggestedCourses.map((course, index) => {
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
                        {suggestedCourses && suggestedCourses.length === 0 && (
                          <Typography className="text-gray-400 text-center">
                            Drag official courses here
                          </Typography>
                        )}
                        {provided.placeholder}
                      </Card>
                      <div className="flex flex-row justify-center gap-2">
                        <Button onClick={onClose} variant="plain">
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
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
