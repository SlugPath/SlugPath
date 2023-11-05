/**
 * `StoredCourse` is a type to represent how courses are stored.
 * `number` is stored as a string, as some course numbers are appended with letters.
 */
export interface StoredCourse {
  department: string;
  number: string;
}
