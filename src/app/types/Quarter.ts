import { StoredCourse } from "./Course";

/**
 * `Quarter` is a composite type that contains multiple courses a student might take in a quarter
 */
export interface Quarter {
  id: string;
  title: string;
  courses: StoredCourse[];
}

export type Term = "Fall" | "Winter" | "Spring" | "Summer";

/**
 * Finds a quarter with a given id in an array of `Quarter`
 * @param quarters array of quarters in a `CourseState` instance
 * @param id quarter id
 * @returns quarter and index where it was located
 */
export const findQuarter = (
  quarters: Quarter[],
  id: string,
): { quarter: Quarter; idx: number } => {
  const quarter = quarters.find((q) => q.id == id);
  const idx = quarters.findIndex((q) => q.id == id);
  if (quarter === undefined) throw new Error(`invalid quarter id: ${id}`);
  return { quarter, idx };
};
