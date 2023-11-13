import { createCourseFromId, createIdFromCourse } from "../../lib/courseUtils";
import { StoredCourse } from "../ts-types/Course";
import { DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import { initialPlanner } from "../../lib/initialPlanner";
import { PlannerData } from "../ts-types/PlannerData";
import { DragStart } from "@hello-pangea/dnd";

export default function useCoursePlanner() {
  const [unavailableQuarters, setUnavailableQuarters] = useState<string[]>([]);
  const [courseState, setCourseState] = useState(initialPlanner);

  const handleCourseUpdate = (courseState: PlannerData) => {
    setCourseState(courseState);
  };

  const quarters = {
    "0": "Summer",
    "1": "Fall",
    "2": "Winter",
    "3": "Spring",
  };

  // Check if the dragged course is available in the destination quarter
  const getQuarterFromId = (droppableId: string) => {
    const quarterId = droppableId.split("-")[2];
    return quarters[quarterId as keyof typeof quarters];
  };

  const getCourseFromQuarters = (cid: string): StoredCourse | undefined => {
    let allCourses: StoredCourse[] = [];
    Object.values(courseState.quarters).forEach((quarter) => {
      allCourses = allCourses.concat(quarter.courses);
    });
    return allCourses.find((c) => {
      return createIdFromCourse(c) === cid;
    });
  };

  // Handle the drag start event for course items.
  // result Contains information about the current drag event of the array of unavailable quarters.
  const handleOnDragStart = (start: DragStart) => {
    const courseBeingDragged = getCourseFromQuarters(start.draggableId);

    if (courseBeingDragged) {
      const unavailable = Object.values(courseState.quarters)
        .filter((quarter) => {
          const quarterName = getQuarterFromId(quarter.id);
          return !courseBeingDragged?.quartersOffered.includes(quarterName);
        })
        .map((quarter) => quarter.id);

      setUnavailableQuarters(unavailable);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    setUnavailableQuarters([]);
    const { destination, source, draggableId } = result;

    if (!destination) return;

    /*
    const draggedCourse = getCourseFromQuarters(draggableId);
    const quarterName = getQuarterFromId(destination.droppableId);
    const isAvailable = draggedCourse?.quartersOffered.includes(quarterName);

    // FIXME: add additional logic to add a warning to the course if it is not offered then
    if (!isAvailable) return
    */

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // add course dragged from 'search-droppable' to quarter
    if (source.droppableId === "search-droppable") {
      const quarter = courseState.quarters[destination.droppableId];
      const newStoredCourses = Array.from(quarter.courses);
      newStoredCourses.splice(
        destination.index,
        0,
        createCourseFromId(draggableId),
      );
      const newQuarter = {
        ...quarter,
        courses: newStoredCourses,
      };

      const newState = {
        ...courseState,
        quarters: {
          ...courseState.quarters,
          [newQuarter.id]: newQuarter,
        },
      };

      handleCourseUpdate(newState);
      return;
    }

    // delete course dragged into delete area or search-droppable
    if (
      destination.droppableId == "remove-course-area1" ||
      destination.droppableId == "remove-course-area2" ||
      destination.droppableId == "search-droppable"
    ) {
      const startQuarter = courseState.quarters[result.source.droppableId];
      const newStoredCourses = Array.from(startQuarter.courses);
      newStoredCourses.splice(result.source.index, 1);

      const newQuarter = {
        ...startQuarter,
        courses: newStoredCourses,
      };

      const newState = {
        ...courseState,
        quarters: {
          ...courseState.quarters,
          [newQuarter.id]: newQuarter,
        },
      };

      handleCourseUpdate(newState);
      return;
    }

    const startQuarter = courseState.quarters[source.droppableId];
    const finishQuarter = courseState.quarters[destination.droppableId];
    if (startQuarter === finishQuarter) {
      // moving course within startQuarter
      const newStoredCourses = Array.from(startQuarter.courses);
      newStoredCourses.splice(source.index, 1);
      newStoredCourses.splice(
        destination.index,
        0,
        startQuarter.courses[source.index],
      );

      const newQuarter = {
        ...startQuarter,
        courses: newStoredCourses,
      };

      const newState = {
        ...courseState,
        quarters: {
          ...courseState.quarters,
          [newQuarter.id]: newQuarter,
        },
      };

      handleCourseUpdate(newState);
    } else {
      // moving course from startQuarter to finishQuarter
      const movedStoredCourse = startQuarter.courses[source.index];
      const startStoredCourses = Array.from(startQuarter.courses);
      startStoredCourses.splice(source.index, 1);
      const newStart = {
        ...startQuarter,
        courses: startStoredCourses,
      };

      const finishStoredCourses = Array.from(finishQuarter.courses);
      finishStoredCourses.splice(destination.index, 0, movedStoredCourse);
      const newFinish = {
        ...finishQuarter,
        courses: finishStoredCourses,
      };

      const newState = {
        ...courseState,
        quarters: {
          ...courseState.quarters,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };

      handleCourseUpdate(newState);
    }
  };

  function coursesAlreadyAdded() {
    const coursesAlreadyAdded: StoredCourse[] = [];
    Object.values(courseState.quarters).forEach((quarter) => {
      quarter.courses.forEach((course) => {
        coursesAlreadyAdded.push(course);
      });
    });
    return coursesAlreadyAdded;
  }

  return {
    courseState,
    handleDragEnd,
    coursesAlreadyAdded,
    handleOnDragStart,
    unavailableQuarters,
  };
}
