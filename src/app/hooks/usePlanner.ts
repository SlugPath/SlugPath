import {
  addYear as addYearFunc,
  deleteYear as deleteYearFunc,
  findCourseLabels,
  replaceCustomCourse as replaceCustomCourseFunc,
  updateCustomCourse,
} from "@/lib/courseUtils";
import { findTotalCredits, getGeSatisfied } from "@/lib/plannerUtils";
import { findQuarter } from "@/lib/quarterUtils";
import { StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
import { PlannerData } from "@customTypes/Planner";
import { useCallback, useMemo } from "react";

interface PlannerInput {
  planner: PlannerData;
  setPlanner: (planner: PlannerData) => boolean;
}

export default function usePlanner({ planner, setPlanner }: PlannerInput) {
  const totalCredits = useMemo(
    () => findTotalCredits(planner.courses),
    [planner],
  );

  const geSatisfied = useMemo(() => getGeSatisfied(planner), [planner]);

  /**
   * A curried function that returns a callback to be invoked upon deleting a course
   * @param quarterId id of the quarter card
   * @returns a callback
   */
  const deleteCourse = (quarterId: string) => {
    const { quarter, idx } = findQuarter(planner.quarters, quarterId);
    return (deleteIdx: number) => {
      const quarterCourses = quarter.courses;
      const deleteCid = quarter.courses[deleteIdx];
      const newCourses = [
        ...quarterCourses.slice(0, deleteIdx),
        ...quarterCourses.slice(deleteIdx + 1),
      ];
      setPlanner({
        ...planner,
        courses: planner.courses.filter((c) => c.id !== deleteCid),
        quarters: [
          ...planner.quarters.slice(0, idx),
          {
            ...quarter,
            courses: newCourses,
          },
          ...planner.quarters.slice(idx + 1),
        ],
      });
    };
  };

  const editCustomCourse = (course: StoredCourse) => {
    const _planner = updateCustomCourse(course, planner);
    setPlanner(_planner);
  };

  const replaceCustomCourse = (customId: string, courses: StoredCourse[]) => {
    const _planner = replaceCustomCourseFunc(customId, courses, planner);
    setPlanner(_planner);
  };

  const addYear = () => {
    const _planner = addYearFunc(planner);
    setPlanner(_planner);
  };

  const deleteYear = (year: number) => {
    const _planner = deleteYearFunc(year, planner);
    setPlanner(_planner);
  };

  const getAllLabels = () => {
    return planner.labels;
  };

  const getCourseLabels = (course: StoredCourse): Label[] => {
    return findCourseLabels(course, planner);
  };

  // Updates the planner state with new labels as well as any course
  // that may have been updated with new labels
  const updatePlannerLabels = ({
    labels,
    newCourse,
  }: {
    labels: Label[];
    newCourse?: StoredCourse;
  }) => {
    setPlanner({
      ...planner,
      labels: planner.labels.map((old) => {
        // Update only the labels that got updated (their names changed)
        const updated = labels.find((l) => l.id === old.id);
        if (updated === undefined) return old;
        return updated;
      }),
      courses: planner.courses.map((c) => {
        return c.id === newCourse?.id ? newCourse : c;
      }),
    });
  };

  const updateNotes = useCallback(
    (content: string) => {
      setPlanner({
        ...planner,
        notes: content,
      });
    },
    [planner, setPlanner],
  );

  return {
    replaceCustomCourse,
    courseState: planner,
    totalCredits,
    geSatisfied,
    deleteCourse,
    editCustomCourse,
    handleCourseUpdate: setPlanner,
    getCourseLabels,
    getAllLabels,
    updatePlannerLabels,
    updateNotes,
    addYear,
    deleteYear,
  };
}
