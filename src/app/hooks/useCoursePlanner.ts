import { createCourseFromId } from "../../lib/courseUtils";
import { StoredCourse } from "../ts-types/Course";
import { DropResult } from "@hello-pangea/dnd";
import { initialPlanner } from "../../lib/initialPlanner";
import { PlannerData } from "../ts-types/PlannerData";
import useLocalState from "./useLocalState";
import { gql } from "@apollo/client";
import useAutosave from "./useAutosave";
import { useEffect } from "react";

const SAVE_PLANNER = gql`
  mutation SavePlanner($input: UpsertInput) {
    upsertPlanner(input: $input) {
      plannerId
    }
  }
`;

export default function useCoursePlanner(input: {
  userId: string | undefined;
  plannerId: string;
  title: string;
  order: number;
}) {
  const [courseState, setCourseState] = useLocalState<PlannerData>(
    `planner${input.plannerId}`,
    initialPlanner(input.title),
  );

  const [saveData, { loading: saving }] = useAutosave(SAVE_PLANNER, {});

  useEffect(() => {
    saveData({
      variables: {
        ...input,
        plannerData: courseState,
      },
    });
  }, [input, courseState, saveData]);

  const handleCourseUpdate = (courseState: PlannerData) => {
    setCourseState(courseState);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
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
          [destination.droppableId]: newQuarter,
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
          [result.source.droppableId]: newQuarter,
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
          [source.droppableId]: newQuarter,
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
          [source.droppableId]: newStart,
          [destination.droppableId]: newFinish,
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
    saving,
  };
}
