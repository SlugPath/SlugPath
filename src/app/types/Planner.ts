import { StoredCourse } from "./Course";
import { Label } from "./Label";
import { Quarter } from "./Quarter";

/**
 * `PlannerData` is a type used to store courses, quarters, and other fields
 */
export type PlannerData = {
  quarters: Quarter[];
  years: number;
  courses: StoredCourse[];
  labels: Label[];
  notes: string;
  title: string;
  id: string;
};

// Deprecated: Use PlannerData instead
export type PlannerTitle = {
  title: string;
  id: string;
};
