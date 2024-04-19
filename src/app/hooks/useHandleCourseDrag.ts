import { CUSTOM_DROPPABLE, SEARCH_DROPPABLE } from "@/lib/consts";
import {
  createCourseFromId,
  findQuarter,
  getCourseFromPlanner,
  isCustomCourse,
} from "@/lib/plannerUtils";
import { getQuarterId } from "@/lib/quarterUtils";
import { PlannerData } from "@customTypes/Planner";
import { Quarter } from "@customTypes/Quarter";
import { DraggableLocation, DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

import { StoredCourse } from "../types/Course";

// Helpers
const draggedFromSearch = (droppableId: string) => {
  return droppableId.includes(SEARCH_DROPPABLE);
};

const draggedFromCustom = (droppableId: string) => {
  return droppableId === CUSTOM_DROPPABLE;
};

export default function useHandleCourseDrag({
  courseState,
  handleCourseUpdate,
  handleRemoveCustom,
}: {
  courseState: PlannerData;
  handleCourseUpdate: (newState: PlannerData) => void;
  handleRemoveCustom: (idx: number) => void;
}) {
  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    // ensure that drag is valid
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;

    if (
      draggedFromSearch(source.droppableId) ||
      draggedFromCustom(source.droppableId)
    ) {
      addCourseFromSearch(draggableId, destination);
      // Remove from the custom course selection
      if (draggedFromCustom(source.droppableId)) {
        handleRemoveCustom(source.index);
      }
      return;
    }
    moveCourse(source, destination);
  }

  function addCourseFromSearch(
    draggableId: string,
    destination: DraggableLocation,
  ) {
    const { quarter, idx } = findQuarter(
      courseState.quarters,
      destination.droppableId,
    );
    const newStoredCourses = Array.from(quarter.courses);
    const cid = uuidv4();
    newStoredCourses.splice(destination.index, 0, cid);
    const course = createCourseFromId(draggableId);

    // Don't add the same course twice to a particular quarter
    if (isCourseInQuarter(quarter, { id: cid, ...course })) return;
    const newQuarter = {
      ...quarter,
      courses: newStoredCourses,
    };

    const newState = {
      ...courseState,
      quarters: [
        ...courseState.quarters.slice(0, idx),
        newQuarter,
        ...courseState.quarters.slice(idx + 1),
      ],
      courses: [...courseState.courses, { id: cid, ...course }],
    };

    handleCourseUpdate(newState);
  }

  function moveCourse(
    source: DraggableLocation,
    destination: DraggableLocation,
  ) {
    const { quarter: startQuarter, idx } = findQuarter(
      courseState.quarters,
      source.droppableId,
    );
    const { quarter: finishQuarter, idx: idx2 } = findQuarter(
      courseState.quarters,
      destination.droppableId,
    );

    function isSameQuarter(startQuarter: Quarter, finishQuarter: Quarter) {
      return getQuarterId(startQuarter) === getQuarterId(finishQuarter);
    }

    if (isSameQuarter(startQuarter, finishQuarter)) {
      moveCourseWithinQuarter(startQuarter, source, destination, idx);
    } else {
      moveCourseToNewQuarter(
        startQuarter,
        finishQuarter,
        source,
        destination,
        idx,
        idx2,
      );
    }
  }

  function moveCourseWithinQuarter(
    quarter: Quarter,
    source: DraggableLocation,
    destination: DraggableLocation,
    idx: number,
  ) {
    const newStoredCourses = Array.from(quarter.courses);
    newStoredCourses.splice(source.index, 1);
    newStoredCourses.splice(
      destination.index,
      0,
      quarter.courses[source.index],
    );

    const newQuarter = {
      ...quarter,
      courses: newStoredCourses,
    };

    const newState = {
      ...courseState,
      quarters: [
        ...courseState.quarters.slice(0, idx),
        newQuarter,
        ...courseState.quarters.slice(idx + 1),
      ],
    };

    handleCourseUpdate(newState);
  }

  function isCourseInQuarter(quarter: Quarter, course: StoredCourse): boolean {
    // Ignore custom courses
    if (isCustomCourse(course)) return false;
    const _courses = quarter.courses.map((cid) =>
      getCourseFromPlanner(cid, courseState),
    );
    const exists = _courses.find(
      (c) =>
        c.departmentCode === course.departmentCode &&
        c.number === course.number,
    );
    return exists !== undefined;
  }

  function moveCourseToNewQuarter(
    startQuarter: Quarter,
    finishQuarter: Quarter,
    source: DraggableLocation,
    destination: DraggableLocation,
    idx: number,
    idx2: number,
  ) {
    const movedCid = startQuarter.courses[source.index];
    // Don't add the same course twice to a particular quarter
    if (
      isCourseInQuarter(
        finishQuarter,
        getCourseFromPlanner(movedCid, courseState),
      )
    )
      return;

    const startStoredCourses = Array.from(startQuarter.courses);
    startStoredCourses.splice(source.index, 1);
    const newStart = {
      ...startQuarter,
      courses: startStoredCourses,
    };

    const finishStoredCourses = Array.from(finishQuarter.courses);
    finishStoredCourses.splice(destination.index, 0, movedCid);
    const newFinish = {
      ...finishQuarter,
      courses: finishStoredCourses,
    };

    let newState: PlannerData = {
      ...courseState,
      quarters: [
        ...courseState.quarters.slice(0, idx),
        newStart,
        ...courseState.quarters.slice(idx + 1),
      ],
    };
    newState = {
      ...newState,
      quarters: [
        ...newState.quarters.slice(0, idx2),
        newFinish,
        ...newState.quarters.slice(idx2 + 1),
      ],
    };

    handleCourseUpdate(newState);
  }

  return {
    handleDragEnd,
  };
}
