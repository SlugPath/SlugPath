export enum Binder {
  AND,
  OR,
}
export type Requirement = string;
export type RequirementGroup = {
  binder: Binder;
  requirements: Requirements[];
};
export type Requirements = Requirement | RequirementGroup;
