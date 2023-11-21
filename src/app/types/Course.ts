import { Label } from "./Label";

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
  number: string; // because some course numbers are 12L, 115A etc.
  quartersOffered: string[];
  credits: number;
  labels: Label[];
}
