import { upsertPlanner } from "@/app/actions/planner";
import { PlannerData } from "@/app/types/Planner";
import {
  findQuarter,
  getGeSatisfied,
  getTotalCredits,
  isCustomCourse,
} from "@/lib/plannerUtils";
import { StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
import { Term } from "@customTypes/Quarter";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { useLoadUserPlanner } from "../../hooks/useLoad";

export default function usePlanner(
  input: {
    userId: string | undefined;
    plannerId: string;
    title: string;
    order: number;
  },
  skipLoad?: boolean,
) {
  // Auto-saving
  const [courseState, setCourseState] = useLoadUserPlanner({
    userId: input.userId,
    plannerId: input.plannerId,
    skipLoad,
  });

  const {
    mutate,
    isPending: saveStatus,
    isError: saveError,
  } = useMutation({
    mutationFn: async (input: {
      userId: string;
      plannerId: string;
      plannerData: PlannerData;
      title: string;
      order: number;
    }) => {
      await upsertPlanner(input);
    },
    onSuccess: () => {
      console.log("Planner saved");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const savePlanner = useCallback(() => {
    mutate({
      userId: input.userId!,
      plannerId: input.plannerId,
      plannerData: courseState,
      title: input.title,
      order: input.order,
    });
  }, [
    courseState,
    input.order,
    input.plannerId,
    input.title,
    input.userId,
    mutate,
  ]);

  const handleCourseUpdate = (newState: PlannerData) => {
    setCourseState(newState);
  };

  const totalCredits = useMemo(
    () => getTotalCredits(courseState.courses!),
    [courseState],
  );
  const geSatisfied = useMemo(() => getGeSatisfied(courseState), [courseState]);

  const [displayCourse, setDisplayCourse] = useState<
    [StoredCourse, Term | undefined] | undefined
  >();

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
      setCourseState({
        ...courseState,
        courses: courseState.courses.filter((c) => c.id !== deleteCid),
        quarters: [
          ...courseState.quarters.slice(0, idx),
          {
            id: quarter.id,
            title: quarter.title,
            courses: newCourses,
          },
          ...courseState.quarters.slice(idx + 1),
        ],
      });
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
    if (!courseState) return;
    setCourseState({
      ...courseState!,
      courses: courseState!.courses.map((c) => {
        if (c.id === cid && isCustomCourse(c)) {
          return {
            ...c,
            ...course,
          };
        }
        return c;
      }),
    });
  };

  const getAllLabels = () => {
    return courseState?.labels ?? [];
  };

  const getCourseLabels = (course: StoredCourse): Label[] => {
    if (course.labels === undefined) return [];
    return course.labels.map((lid) => {
      const label = courseState?.labels.find((l) => l.id === lid);
      if (label === undefined) throw new Error("label not found");
      return label;
    });
  };

  const updatePlannerLabels = (newLabels: Label[]) => {
    if (!courseState) return;
    setCourseState({
      ...courseState!,
      labels: courseState!.labels.map((old) => {
        // Update only the labels that got updated (their names changed)
        const updated = newLabels.find((l) => l.id === old.id);
        if (updated === undefined) return old;
        return updated;
      }),
    });
  };

  const editCourseLabels = (newCourse: StoredCourse) => {
    if (!courseState) return;
    setCourseState({
      ...courseState,
      courses: courseState.courses.map((c) => {
        return c.id === newCourse.id ? newCourse : c;
      }),
    });
  };

  const updateNotes = (content: string) => {
    if (!courseState) return;
    setCourseState({
      ...courseState,
      notes: content,
    });
  };

  return {
    courseState,
    totalCredits,
    geSatisfied,
    saveStatus,
    saveError,
    savePlanner,
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
