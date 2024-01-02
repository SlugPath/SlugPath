/**
 * `StoredCourse` is a type to represent courses
 */
export interface StoredCourse {
  id: string;
  departmentCode: string;
  number: string; // because some course numbers are 12L, 115A etc.
  credits: number;
  title: string;
  ge: string[];
  quartersOffered: string[];
  description: string;
  labels: string[];
}
