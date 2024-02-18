import { StoredCourse } from "@customTypes/Course";
import { PlannerData } from "@customTypes/Planner";
import { RequirementList, Requirements } from "@customTypes/Requirements";

export interface MajorVerificationContextProps {
  isMajorRequirementsSatisfied: (
    requirements: Requirements,
    courses: StoredCourse[],
  ) => boolean;
  majorRequirements: RequirementList;
  calculateMajorProgressPercentage: (courseState: PlannerData) => number;
  errors: string;
  loadingSave: boolean;
  isSaved: boolean;
  findRequirementList: (
    id: string,
    requirements: RequirementList,
  ) => RequirementList | null;
  addRequirementList: (parentRequirementListId: string) => void;
  removeRequirementList: (requirementListId: string) => void;
  updateRequirementList: (
    requirementListId: string,
    newRequirementList: RequirementList,
  ) => void;
  onSaveMajorRequirements: () => void;
}
