import { createIdFromCourse } from "../../lib/courseUtils";
import { StoredCourse } from "../ts-types/Course";
import { useState } from "react";
import { initialPlanner } from "../../lib/initialPlanner";
import { PlannerData } from "../ts-types/PlannerData";
import useHandleCourseDrag from "./useHandleCourseDrag";
import { DragStart } from "@hello-pangea/dnd";

const quarters = {
  "0": "Fall",
  "1": "Winter",
  "2": "Spring",
  "3": "Summer",
};

export default function useCoursePlanner() {
  const [unavailableQuarters, setUnavailableQuarters] = useState<string[]>([]);
  const [courseState, setCourseState] = useState(initialPlanner);
  const { handleDragEnd } = useHandleCourseDrag({
    courseState,
    handleCourseUpdate,
  });

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
  // result contains information about the current drag event of the array of unavailable quarters.
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

  function handleCourseUpdate(courseState: PlannerData) {
    setUnavailableQuarters([]);
    setCourseState(courseState);
  }

  function coursesInPlanner() {
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
    coursesInPlanner,
    handleOnDragStart,
    unavailableQuarters,
  };
}
