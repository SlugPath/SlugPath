import { REPLACE_CUSTOM_DROPPABLE } from "@/lib/consts";
import { createCourseFromId, isCustomCourse } from "@/lib/plannerUtils";
import { truncateTitle } from "@/lib/utils";
import DraggableCourseCard from "@components/planner/quarters/courses/DraggableCourseCard";
import Search from "@components/search/Search";
import SearchResults from "@components/search/SearchResults";
import { CourseInfoProvider } from "@contexts/CourseInfoProvider";
import { PlannerContext } from "@contexts/PlannerProvider";
import { StoredCourse } from "@customTypes/Course";
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { useSuggestedCourses, useTransferCourses } from "@hooks/reactQuery";
import { OpenInNew } from "@mui/icons-material";
import { Button, Card, Modal, ModalClose, Sheet } from "@mui/joy";
import Fuse from "fuse.js";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import CourseInfoModal from "./CourseInfoModal";

const courseNumberRegex = /[A-Z]{2,6} [0-9]{1,3}[A-Z]*/g;

export interface ReplaceCourseModalProps {
  onClose: () => void;
  onSave: () => void;
  isOpen: boolean;
  toReplace: StoredCourse;
}

export default function ReplaceCourseModal({
  onClose,
  onSave,
  isOpen,
  toReplace,
}: ReplaceCourseModalProps) {
  // Get the title(s) of the custom course if we are replacing a custom course
  const isTransfer = !isCustomCourse(toReplace);
  const titles = Array.from(
    toReplace.title.toUpperCase().matchAll(courseNumberRegex),
  ).map((m) => m[0]);

  // Fetch the suggested classes from the database (to replace this course)
  const {
    data: initialSuggestedCourses,
    isLoading: initialSuggestedCoursesLoading,
  } = useSuggestedCourses(titles);

  const [replacements, setReplacements] = useState<StoredCourse[]>([]);

  useEffect(() => {
    setReplacements(initialSuggestedCourses ?? []);
  }, [initialSuggestedCourses]);

  const { replaceCourse } = useContext(PlannerContext);
  const droppableId = REPLACE_CUSTOM_DROPPABLE + toReplace.id;

  function handleDragEnd(result: DropResult) {
    const { draggableId, destination } = result;
    if (!destination) return;
    addCourseFromSearch(draggableId, destination);
  }

  function title(course: StoredCourse) {
    if (isCustomCourse(course)) return course.title;
    return `${course.departmentCode} ${course.number} - ${truncateTitle(
      course.title,
      40,
    )}`;
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
    if (
      !replacements!.find(
        (c) =>
          c.number === course.number &&
          c.departmentCode === course.departmentCode,
      )
    ) {
      setReplacements((prev) => [
        ...prev,
        {
          ...course,
          id: uuidv4(),
        },
      ]);
    }
  }

  function removeCourse(index: number) {
    setReplacements((prev) => {
      const newClasses = [...prev];
      newClasses.splice(index, 1);
      return newClasses;
    });
  }

  function handleSave() {
    if (!replacements || replacements.length === 0) {
      return;
    }
    replaceCourse(toReplace.id, replacements);
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
          <h2 className="truncate text-ellipsis text-xl font-bold">
            Replacing &quot;{title(toReplace)}&quot;
          </h2>
          <div className="flex flex-row items-start gap-2 flex-1">
            <DragDropContext onDragEnd={handleDragEnd}>
              {isTransfer ? (
                <TransferCoursesList course={toReplace} />
              ) : (
                <Card
                  variant="soft"
                  size="sm"
                  sx={{
                    height: "100%",
                    width: "100%",
                    flex: "1 1 0%",
                    paddingRight: "0.5rem",
                  }}
                >
                  <Search displayCustomCourseSelection={false} />
                </Card>
              )}
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
                        {replacements.map((course, index) => {
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
                        {replacements.length === 0 && (
                          <p className="text-gray-400 text-center text-lg">
                            Drag courses here
                          </p>
                        )}
                        {provided.placeholder}
                      </Card>
                      <div className="flex flex-row justify-center gap-2">
                        <Button onClick={onClose} variant="plain">
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
                          <p className="text-md text-white">Confirm</p>
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

function TransferCoursesList({ course }: { course: StoredCourse }) {
  const { data: courses, isPending: loading } = useTransferCourses(course);
  const [schoolFilter, setSchoolFilter] = useState("");

  // Fuzzy search for courses by school
  const filteredCourses = useMemo(() => {
    if (schoolFilter === "") return courses;
    const fuse = new Fuse(courses ?? [], {
      keys: ["school"],
      threshold: 0.2,
    });
    return fuse.search(schoolFilter).map((result) => result.item);
  }, [schoolFilter, courses]);

  return (
    <Card variant="soft" className="h-full w-full">
      <div className="ml-2 h-5/6">
        <div className="mb-2 ml-2 gap-2 flex-col flex">
          <p className="text-xl font-semibold">Transfer Alternatives</p>
          <div className="text-lg rounded-lg p-2 bg-orange-200 dark:bg-orange-900">
            <strong>Disclaimer:</strong> always check
            <a
              className="ml-1 inline-block underline text-blue-500 hover:text-blue-700 cursor-pointer"
              aria-label="Open ASSIST.org in new tab"
              href="https://assist.org"
              target="_blank"
            >
              assist.org
              <OpenInNew color="primary" />
            </a>
            for the most up to date information
          </div>
          <input
            className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-800 bg-blue-400 placeholder-slate-800 dark:placeholder-slate-200 font-medium placeholder:font-medium"
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            placeholder="Filter by School"
          />
        </div>
        <div className="h-3/4">
          <SearchResults
            courses={filteredCourses ?? []}
            loading={loading}
            droppableId="transfer-search"
          />
        </div>
      </div>
    </Card>
  );
}
