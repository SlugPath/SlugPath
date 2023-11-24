import {
  getTotalCredits,
  getGeSatisfied,
  serializePlanner,
  isCustomCourse,
} from "@/lib/plannerUtils";
import { useState } from "react";
import { gql } from "@apollo/client";
import useAutosave from "./useAutosave";
import { useEffect } from "react";
import { findQuarter } from "../types/Quarter";
import { useLoadPlanner } from "./useLoad";
import { PlannerData } from "../types/PlannerData";

const SAVE_PLANNER = gql`
  mutation SavePlanner($input: PlannerCreateInput!) {
    upsertPlanner(input: $input) {
      plannerId
    }
  }
`;

export default function usePlanner(input: {
  userId: string | undefined;
  plannerId: string;
  title: string;
  order: number;
}) {
  const [courseState, setCourseState] = useLoadPlanner(
    input.plannerId,
    input.userId,
  );

  const handleCourseUpdate = (newState: PlannerData) => {
    setCourseState(newState);
  };

  const [totalCredits, setTotalCredits] = useState(
    getTotalCredits(courseState),
  );
  const [geSatisfied, setGeSatisfied] = useState(getGeSatisfied(courseState));
  const [saveData, { loading: saveStatus, error: saveError }] = useAutosave(
    SAVE_PLANNER,
    {},
  );

  // Auto-saving
  useEffect(() => {
    if (
      input.userId !== undefined &&
      input.title.length > 1 &&
      input.title.length < 20
    ) {
      const variables = {
        input: {
          ...input,
          plannerData: serializePlanner(courseState),
        },
      };
      saveData({
        variables,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(input), JSON.stringify(courseState)]);

  // Update total credits
  useEffect(() => {
    setTotalCredits(getTotalCredits(courseState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseState]);

  // Update list of GEs satisfied
  useEffect(() => {
    setGeSatisfied(getGeSatisfied(courseState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseState]);

  /**
   * A curried function that returns a callback to be invoked upon deleting a course
   * @param quarterId id of the quarter card
   * @returns a callback
   */
  const deleteCourse = (quarterId: string) => {
    const { quarter, idx } = findQuarter(courseState.quarters, quarterId);
    return (deleteIdx: number) => {
      const quarterCourses = quarter.courses;
      const deleteCid = quarter.courses[deleteIdx];
      const newCourses = [
        ...quarterCourses.slice(0, deleteIdx),
        ...quarterCourses.slice(deleteIdx + 1),
      ];
      setCourseState((prev) => {
        return {
          ...prev,
          courses: prev.courses.filter((c) => c.id !== deleteCid),
          quarters: [
            ...prev.quarters.slice(0, idx),
            {
              id: quarter.id,
              title: quarter.title,
              courses: newCourses,
            },
            ...prev.quarters.slice(idx + 1),
          ],
        };
      });
      setTotalCredits(getTotalCredits(courseState));
      setGeSatisfied(getGeSatisfied(courseState));
    };
  };

  /**
   * A function that is used to edit a custom course and reflect changes in
   * the entire planner state
   * @param cid id of custom course being edited
   * @param newTitle new title of custom course
   */
  const editCustomCourse = (cid: string, newTitle: string) => {
    setCourseState((prev) => {
      return {
        ...prev,
        courses: prev.courses.map((c) => {
          if (c.id === cid && isCustomCourse(c)) {
            return {
              ...c,
              title: newTitle,
            };
          }
          return c;
        }),
      };
    });
  };

  return {
    courseState,
    totalCredits,
    geSatisfied,
    saveStatus,
    saveError,
    deleteCourse,
    editCustomCourse,
    handleCourseUpdate,
  };
}
