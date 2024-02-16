import { PlannersContext } from "@/app/contexts/PlannersProvider";
import { PlannerData } from "@/app/types/Planner";
import {
  findQuarter,
  getGeSatisfied,
  getTotalCredits,
  initialPlanner,
  isCustomCourse,
} from "@/lib/plannerUtils";
import { StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
import { useContext, useMemo } from "react";

export default function usePlanner(input: {
  userId: string | undefined;
  plannerId: string;
  title: string;
  order: number;
}) {
  const { getPlanner, setPlanner } = useContext(PlannersContext);
  const courseState = getPlanner
    ? getPlanner(input.plannerId)
    : initialPlanner();

  const handleCourseUpdate = (newState: PlannerData) => {
    setPlanner(input.plannerId, input.title, newState);
  };

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
    courseState.quarters.push(
      {
        id: "quarter-" + courseState.years + "-Fall",
        title: "Fall",
        courses: [],
      },
      {
        id: "quarter-" + courseState.years + "-Winter",
        title: "Winter",
        courses: [],
      },
      {
        id: "quarter-" + courseState.years + "-Spring",
        title: "Spring",
        courses: [],
      },
      {
        id: "quarter-" + courseState.years + "-Summer",
        title: "Summer",
        courses: [],
      },
    );
    handleCourseUpdate({ ...courseState, years: courseState.years + 1 });
  };

  const deleteYear = (year: number) => {
    console.log(year);
    for (let i = 0; i < courseState.quarters.length; i++) {
      if (year == parseInt(courseState.quarters[i].id[8])) {
        //console.log(courseState.quarters)
        //console.log(i)
        courseState.quarters.splice(i, 4);
        console.log(courseState.quarters);
        break;
      }
    }
    handleCourseUpdate({ ...courseState, years: courseState.years - 1 });
    //console.log(courseState.quarters)
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

  const updateNotes = (content: string) => {
    handleCourseUpdate({
      ...courseState,
      notes: content,
    });
  };

  return {
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
