import { StoredCourse } from "./Course";

/**
 * `Quarter` is a composite type that contains multiple courses a student might take in a quarter
 */
export interface Quarter {
  title: string;
  courses: StoredCourse[];
}
