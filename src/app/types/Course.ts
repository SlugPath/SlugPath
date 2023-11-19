export interface Course {
  department: string;
  number: string;
  name: string;
  id: string;
  credits: number;
}

/**
 * `StoredCourse` is a type to represent dummy courses for now
 */
export interface StoredCourse {
  department: string;
  departmentCode: string;
  title: string;
  number: string; // because some course numbers are 12L, 115A etc.
  credits: number;
  ge: string[];
  quartersOffered: string[];
}
