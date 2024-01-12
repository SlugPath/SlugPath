type Course = {
  departmentCode: string;
  number: string;
};

export enum Binder {
  AND,
  OR,
  AT_LEAST,
}

export type Requirement = Course;

export type RequirementList = {
  binder: Binder;
  requirements: Requirements[];
  atLeast?: number; // for Binder.AT_LEAST, where atLeast there is the minimum number of requirements to be satisfied
  title?: string;
};

export type Requirements = Requirement | RequirementList;
