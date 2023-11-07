import { DraggableLocation, DropResult } from "@hello-pangea/dnd";
import { createCourseFromId } from "../../lib/courseUtils";
import { PlannerData } from "../ts-types/PlannerData";
import { Quarter } from "../ts-types/Quarter";

const REMOVE_COURSE_AREA1 = "remove-course-area1";
const REMOVE_COURSE_AREA2 = "remove-course-area2";
const SEARCH_DROPPABLE = "search-droppable";

export default function useHandleCourseDrag({
  courseState,
  handleCourseUpdate,
}: {
  courseState: PlannerData;
  handleCourseUpdate: any;
}) {
  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    function draggedFromSearch(droppableId: string) {
      return droppableId === "search-droppable";
    }

    // ensure that drag is valid
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;

    if (draggedFromSearch(source.droppableId)) {
      addCourseFromSearch(draggableId, destination);
      return;
    }

    if (shouldDeleteCourse(destination)) {
      deleteCourse(source);
      return;
    }

    moveCourse(source, destination);
  }

  function addCourseFromSearch(
    draggableId: string,
    destination: DraggableLocation,
  ) {
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
  }

  function shouldDeleteCourse(destination: DraggableLocation) {
    return (
      destination.droppableId == REMOVE_COURSE_AREA1 ||
      destination.droppableId == REMOVE_COURSE_AREA2 ||
      destination.droppableId == SEARCH_DROPPABLE
    );
  }

  function deleteCourse(source: DraggableLocation) {
    const startQuarter = courseState.quarters[source.droppableId];
    const newStoredCourses = Array.from(startQuarter.courses);
    newStoredCourses.splice(source.index, 1);

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
  }

  function moveCourse(
    source: DraggableLocation,
    destination: DraggableLocation,
  ) {
    const startQuarter = courseState.quarters[source.droppableId];
    const finishQuarter = courseState.quarters[destination.droppableId];

    function isSameQuarter(startQuarter: Quarter, finishQuarter: Quarter) {
      return startQuarter.id === finishQuarter.id;
    }

    if (isSameQuarter(startQuarter, finishQuarter)) {
      moveCourseWithinQuarter(startQuarter, source, destination);
    } else {
      moveCourseToNewQuarter(startQuarter, finishQuarter, source, destination);
    }
  }

  function moveCourseWithinQuarter(
    quarter: Quarter,
    source: DraggableLocation,
    destination: DraggableLocation,
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
      quarters: {
        ...courseState.quarters,
        [newQuarter.id]: newQuarter,
      },
    };

    handleCourseUpdate(newState);
  }

  function moveCourseToNewQuarter(
    startQuarter: Quarter,
    finishQuarter: Quarter,
    source: DraggableLocation,
    destination: DraggableLocation,
  ) {
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

  return {
    handleDragEnd,
  };
}
