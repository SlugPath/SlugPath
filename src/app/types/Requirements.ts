import { StoredCourse } from "./Course";

export enum Binder {
  AND,
  OR,
  AT_LEAST,
}

export type Requirement = StoredCourse;

export type RequirementList = {
  binder: Binder;
  requirements: Requirements[];
  id: string;
  atLeast?: number; // for Binder.AT_LEAST, where atLeast there is the minimum number of requirements to be satisfied
  title?: string;
  notes?: string;
};

export type Requirements = Requirement | RequirementList;
