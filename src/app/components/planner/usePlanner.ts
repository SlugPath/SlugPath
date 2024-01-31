import { PlannerData } from "@/app/types/Planner";
import {
  getGeSatisfied,
  getTotalCredits,
  isCustomCourse,
} from "@/lib/plannerUtils";
import { StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
import { Term, findQuarter } from "@customTypes/Quarter";
import useAutosave from "@hooks/useAutosave";
import { useState } from "react";
import { useEffect } from "react";

import { useLoadUserPlanner } from "../planners/useLoad";

export default function usePlanner(
  input: {
    userId: string | undefined;
    plannerId: string;
    title: string;
    order: number;
  },
  skipLoad?: boolean,
) {
  const [courseState, setCourseState] = useLoadUserPlanner({
    plannerId: input.plannerId,
    userId: input.userId,
    skipLoad,
  });

  const handleCourseUpdate = (newState: PlannerData) => {
    setCourseState(newState);
  };

  const [totalCredits, setTotalCredits] = useState(
    getTotalCredits(courseState.courses),
  );
  const [geSatisfied, setGeSatisfied] = useState(getGeSatisfied(courseState));

  // Auto-saving
  const { loading: saveStatus, error: saveError } = useAutosave({
    ...input,
    plannerData: courseState,
  });

  const [displayCourse, setDisplayCourse] = useState<
    [StoredCourse, Term | undefined] | undefined
  >();

  // Update total credits
  useEffect(() => {
    setTotalCredits(getTotalCredits(courseState.courses));
  }, [courseState]);

  // Update list of GEs satisfied
  useEffect(() => {
    setGeSatisfied(getGeSatisfied(courseState));
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
      setTotalCredits(getTotalCredits(courseState.courses));
      setGeSatisfied(getGeSatisfied(courseState));
    };
  };

  /**
   * A function that is used to edit a custom course and reflect changes in
   * the entire planner state
   * @param cid id of custom course being edited
   * @param newTitle new title of custom course
   */
  const editCustomCourse = (course: StoredCourse) => {
    const cid = course.id;
    setCourseState((prev) => {
      return {
        ...prev,
        courses: prev.courses.map((c) => {
          if (c.id === cid && isCustomCourse(c)) {
            return {
              ...c,
              ...course,
            };
          }
          return c;
        }),
      };
    });
  };

  const getAllLabels = () => {
    return courseState.labels;
  };

  const getCourseLabels = (course: StoredCourse): Label[] => {
    if (course.labels === undefined) return [];
    return course.labels.map((lid) => {
      const label = courseState.labels.find((l) => l.id === lid);
      if (label === undefined) throw new Error("label not found");
      return label;
    });
  };

  const updatePlannerLabels = (newLabels: Label[]) => {
    setCourseState((prev) => {
      return {
        ...prev,
        labels: prev.labels.map((old) => {
          // Update only the labels that got updated (their names changed)
          const updated = newLabels.find((l) => l.id === old.id);
          if (updated === undefined) return old;
          return updated;
        }),
      };
    });
  };

  const editCourseLabels = (newCourse: StoredCourse) => {
    setCourseState((prev) => {
      return {
        ...prev,
        courses: prev.courses.map((c) => {
          return c.id === newCourse.id ? newCourse : c;
        }),
      };
    });
  };

  const updateNotes = (content: string) => {
    setCourseState((prev) => {
      return {
        ...prev,
        notes: content,
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
    displayCourse,
    setDisplayCourse,
    getCourseLabels,
    getAllLabels,
    updatePlannerLabels,
    editCourseLabels,
    updateNotes,
  };
}
