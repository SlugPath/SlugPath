import { StoredCourse } from "./Course";

export enum Binder {
  AND,
  OR,
  AT_LEAST,
}

// Requirement is a course that has a departmentCode and number, but may have other fields
export type Requirement = Pick<StoredCourse, "departmentCode" | "number"> &
  Partial<Omit<StoredCourse, "departmentCode" | "number">>;

export type RequirementList = {
  binder: Binder;
  requirements: Requirements[];
  id: string;
  atLeast?: number; // for Binder.AT_LEAST, where atLeast there is the minimum number of requirements to be satisfied
  title?: string;
  notes?: string;
};

export type Requirements = Requirement | RequirementList;
