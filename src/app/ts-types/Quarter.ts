import { StoredCourse } from "./Course";

/**
 * `Quarter` is a composite type that contains multiple courses a student might take in a quarter
 */
export interface Quarter {
  id: string;
  title: string;
  courses: StoredCourse[];
}

export const findQuarter = (quarters: Quarter[], id: string): Quarter => {
  const res = quarters.filter((q) => q.id == id);
  if (res.length == 0) throw new Error("invalid quarter id");
  return res[0];
};
