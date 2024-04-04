import {
  findQuarter,
  getGeSatisfied,
  getTotalCredits,
  initialPlanner,
  isCustomCourse,
} from "@/lib/plannerUtils";
import usePlannersStore from "@/store/planners";
import { StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
import { PlannerData } from "@customTypes/Planner";
import { Quarter } from "@customTypes/Quarter";
import { useCallback, useMemo } from "react";

export default function usePlanner(input: {
  userId: string | undefined;
  plannerId: string;
  title: string;
  order: number;
}) {
  const planners = usePlannersStore((state) => state.planners);
  const setPlanner = usePlannersStore((state) => state.setPlanner);

  const getPlanner = useCallback(
    (id: string) => {
      if (!planners) throw new Error("Planners not loaded yet");

      const p = planners.find((planner) => planner.id === id);
      if (!p) throw new Error(`Planner not found with id '${id}'`);
      return p;
    },
    [planners],
  );

  // TODO: cursed
  const courseState = getPlanner
    ? getPlanner(input.plannerId)
    : initialPlanner();

  const handleCourseUpdate = useCallback(
    (newState: PlannerData) => {
      setPlanner(input.plannerId, newState);
    },
    [input.plannerId, setPlanner],
  );

  const totalCredits = useMemo(
    () => getTotalCredits(courseState.courses!),
    [courseState],
  );

  const geSatisfied = useMemo(() => getGeSatisfied(courseState), [courseState]);

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
      handleCourseUpdate({
        ...courseState,
        courses: courseState.courses.filter((c) => c.id !== deleteCid),
        quarters: [
          ...courseState.quarters.slice(0, idx),
          {
            ...quarter,
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
    handleCourseUpdate({
      ...courseState,
      courses: courseState.courses.map((c) => {
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

  const addYear = () => {
    handleCourseUpdate({
      ...courseState,
      years: courseState.years + 1,
      quarters: [
        ...courseState.quarters,
        // Add new quarters for the new year
        ...["Fall", "Winter", "Spring", "Summer"].map((t) => {
          return {
            year: courseState.years,
            title: t,
            courses: [],
          } as Quarter;
        }),
      ],
    });
  };

  const deleteYear = (year: number) => {
    const quarters = [...courseState.quarters];
    const idx = quarters.findIndex((q) => q.year === year);
    if (idx == -1) {
      throw new Error("Year not found"); // should not happen
    }

    const toRemoveCourses = quarters
      .slice(idx, idx + 4)
      .map((q) => q.courses)
      .flat();
    const newCourses = courseState.courses.filter(
      (c) => !toRemoveCourses.includes(c.id),
    );

    quarters.splice(idx, 4);

    for (let j = idx; j < quarters.length; j++) {
      const quarterToChange = quarters[j];
      const newYear = quarterToChange.year - 1;
      quarters[j] = {
        ...quarterToChange,
        year: newYear,
      };
    }
    handleCourseUpdate({
      ...courseState,
      courses: newCourses,
      quarters,
      years: courseState.years - 1,
    });
  };

  const getAllLabels = () => {
    return courseState.labels;
  };

  const getCourseLabels = (course: StoredCourse): Label[] => {
    return course.labels.map((lid) => {
      const label = courseState.labels.find((l) => l.id === lid);
      if (label === undefined) throw new Error("label not found");
      return label;
    });
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
    handleCourseUpdate({
      ...courseState,
      labels: courseState.labels.map((old) => {
        // Update only the labels that got updated (their names changed)
        const updated = labels.find((l) => l.id === old.id);
        if (updated === undefined) return old;
        return updated;
      }),
      courses: courseState.courses.map((c) => {
        return c.id === newCourse?.id ? newCourse : c;
      }),
    });
  };

  const updateNotes = useCallback(
    (content: string) => {
      handleCourseUpdate({
        ...courseState,
        notes: content,
      });
    },
    [courseState, handleCourseUpdate],
  );

  const replaceCustomCourse = (customId: string, courses: StoredCourse[]) => {
    const newCids = courses.map((c) => c.id);
    const newCourses = courseState.courses.filter((c) => c.id != customId);
    newCourses.push(...courses);

    handleCourseUpdate({
      ...courseState,
      courses: newCourses,
      quarters: courseState.quarters.map((q) => {
        const idx = q.courses.indexOf(customId);
        if (idx !== -1) {
          const quarterCourses = [...q.courses];
          quarterCourses.splice(idx, 1, ...newCids);
          return {
            ...q,
            courses: quarterCourses,
          };
        }
        return q;
      }),
    });
  };

  return {
    replaceCustomCourse,
    courseState,
    totalCredits,
    geSatisfied,
    deleteCourse,
    editCustomCourse,
    handleCourseUpdate,
    getCourseLabels,
    getAllLabels,
    updatePlannerLabels,
    updateNotes,
    addYear,
    deleteYear,
  };
}
