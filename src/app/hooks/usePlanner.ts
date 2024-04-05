import {
  findTotalCredits,
  getGeSatisfied,
  isCustomCourse,
} from "@/lib/plannerUtils";
import { findQuarter } from "@/lib/quarterUtils";
import { StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
import { PlannerData } from "@customTypes/Planner";
import { Quarter } from "@customTypes/Quarter";
import { useCallback, useMemo } from "react";

interface PlannerInput {
  planner: PlannerData;
  setPlanner: (planner: PlannerData) => boolean;
}

export default function usePlanner({ planner, setPlanner }: PlannerInput) {
  // const planners = usePlannersStore((state) => state.planners);
  // const setPlanner = usePlannersStore((state) => state.setPlanner);

  // const getPlanner = useCallback(
  //   (id: string) => {
  //     if (!planners) throw new Error("Planners not loaded yet");

  //     const p = planners.find((planner) => planner.id === id);
  //     if (!p) throw new Error(`Planner not found with id '${id}'`);
  //     return p;
  //   },
  //   [planners],
  // );

  // // TODO: cursed
  // const courseState = getPlanner
  //   ? getPlanner(input.plannerId)
  //   : initialPlanner();

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

  /**
   * A function that is used to edit a custom course and reflect changes in
   * the entire planner state
   * @param cid id of custom course being edited
   * @param newTitle new title of custom course
   */
  const editCustomCourse = (course: StoredCourse) => {
    const cid = course.id;
    setPlanner({
      ...planner,
      courses: planner.courses.map((c) => {
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
    setPlanner({
      ...planner,
      years: planner.years + 1,
      quarters: [
        ...planner.quarters,
        // Add new quarters for the new year
        ...["Fall", "Winter", "Spring", "Summer"].map((t) => {
          return {
            year: planner.years,
            title: t,
            courses: [],
          } as Quarter;
        }),
      ],
    });
  };

  const deleteYear = (year: number) => {
    const quarters = [...planner.quarters];
    const idx = quarters.findIndex((q) => q.year === year);
    if (idx == -1) {
      throw new Error("Year not found"); // should not happen
    }

    const toRemoveCourses = quarters
      .slice(idx, idx + 4)
      .map((q) => q.courses)
      .flat();
    const newCourses = planner.courses.filter(
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
    setPlanner({
      ...planner,
      courses: newCourses,
      quarters,
      years: planner.years - 1,
    });
  };

  const getAllLabels = () => {
    return planner.labels;
  };

  const getCourseLabels = (course: StoredCourse): Label[] => {
    return course.labels.map((lid) => {
      const label = planner.labels.find((l) => l.id === lid);
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

  const replaceCustomCourse = (customId: string, courses: StoredCourse[]) => {
    const newCids = courses.map((c) => c.id);
    const newCourses = planner.courses.filter((c) => c.id != customId);
    newCourses.push(...courses);

    setPlanner({
      ...planner,
      courses: newCourses,
      quarters: planner.quarters.map((q) => {
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
