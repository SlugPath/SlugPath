import { StoredCourse } from "@/app/types/Course";
import { Label } from "@/app/types/Label";
import { PlannerData } from "@/app/types/Planner";
import { Quarter } from "@/app/types/Quarter";

import { isCustomCourse } from "./plannerUtils";

/**
 * Update a custom course by returning a new planner object
 * @param course a custom course to be updated
 * @param planner planner to update
 * @returns updated planner
 */
export const updateCustomCourse = (
  course: StoredCourse,
  planner: PlannerData,
): PlannerData => {
  const cid = course.id;
  return {
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
  };
};

/**
 * Replace a custom course with a list of courses by returning a new planner
 * object
 * @param customId id of custom course being replaced
 * @param replacementCourses list of courses to replace the custom course
 * @param planner planner to update
 * @returns updated planner
 */
export const replaceCustomCourse = (
  customId: string,
  replacementCourses: StoredCourse[],
  planner: PlannerData,
): PlannerData => {
  const replacementCourseIds = replacementCourses.map((c) => c.id);
  const _courses = planner.courses.filter((c) => c.id != customId);
  _courses.push(...replacementCourses);

  return {
    ...planner,
    courses: _courses,
    quarters: planner.quarters.map((q) => {
      const idx = q.courses.indexOf(customId);
      if (idx !== -1) {
        const quarterCourses = [...q.courses];
        quarterCourses.splice(idx, 1, ...replacementCourseIds);
        return {
          ...q,
          courses: quarterCourses,
        };
      }
      return q;
    }),
  };
};

/**
 * Add a year to a planner by returning a new planner object
 * @param planner planner to update
 * @returns updated planner
 */
export const addYear = (planner: PlannerData) => {
  return {
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
  };
};

/**
 * Delete a year from a planner by returning a new planner object
 * @param year year to be removed
 * @param planner planner to update
 * @returns updated planner
 */
export const deleteYear = (year: number, planner: PlannerData) => {
  const quarters = [...planner.quarters];
  const idx = quarters.findIndex((q) => q.year === year);
  if (idx == -1) throw new Error("Year not found"); // should not happen

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

  return {
    ...planner,
    courses: newCourses,
    quarters,
    years: planner.years - 1,
  };
};

/**
 * Find course labels from a course
 * @param course course to find labels for
 * @param planner planner to update
 * @returns list of labels
 */
export const findCourseLabels = (
  course: StoredCourse,
  planner: PlannerData,
): Label[] => {
  return course.labels.map((lid) => {
    const label = planner.labels.find((l) => l.id === lid);
    if (label === undefined) throw new Error("label not found");
    return label;
  });
};
