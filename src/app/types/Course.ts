import { Label } from "./Label";

export interface Course {
  departmentCode: string;
  number: string;
  title: string;
  id: string;
  credits: number;
}

/**
 * `StoredCourse` is a type to represent dummy courses for now
 */
export interface StoredCourse {
  departmentCode: string;
  number: string; // because some course numbers are 12L, 115A etc.
  credits: number;
  ge: string[];
  quartersOffered: string[];
  labels: Label[];
}
