import { getPlanner, upsertPlanner } from "@/app/actions/planner";
import { PlannerData } from "@/app/types/Planner";
import {
  emptyPlanner,
  findQuarter,
  getGeSatisfied,
  getTotalCredits,
  isCustomCourse,
} from "@/lib/plannerUtils";
import { StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
import { Term } from "@customTypes/Quarter";
import { useMemo, useState } from "react";
import { useReactQueryAutoSync } from "use-react-query-auto-sync";

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
  const {
    draft: courseState = emptyPlanner(),
    setDraft: setCourseState,
    saveStatus,
  } = useReactQueryAutoSync<PlannerData>({
    queryOptions: {
      queryKey: ["getPlanner", input],
      queryFn: async () => {
        return await getPlanner({
          userId: input.userId!,
          plannerId: input.plannerId,
        });
      },
      enabled: !skipLoad,
    },
    mutationOptions: {
      mutationKey: ["upsertPlanner", input],
      mutationFn: async (data: PlannerData) => {
        if (!input.userId) return;
        return await upsertPlanner({
          ...input,
          userId: input.userId!,
          plannerData: data,
        });
      },
    },
    autoSaveOptions: {
      wait: 1000,
    },
  });

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
