import { StoredCourse } from "@customTypes/Course";
import { PlannerData } from "@customTypes/Planner";
import { RequirementList, Requirements } from "@customTypes/Requirements";

export interface MajorVerificationContextProps {
  isMajorRequirementsSatisfied: (
    requirements: Requirements,
    courses: StoredCourse[],
  ) => boolean;
  getRequirementsForMajor: (majorId: number) => RequirementList | undefined;
  getLoadingSave: (majorId: number) => boolean;
  getIsSaved: (majorId: number) => boolean;
  calculateMajorProgressPercentage: (courseState: PlannerData) => number;
  errors: string;
  findRequirementList: (
    id: string,
    requirements: RequirementList,
  ) => RequirementList | null;
  addRequirementList: (
    majorId: number,
    parentRequirementListId: string,
  ) => void;
  removeRequirementList: (majorId: number, requirementListId: string) => void;
  updateRequirementList: (
    majorId: number,
    requirementListId: string,
    newRequirementList: RequirementList,
  ) => void;
  onSaveMajorRequirements: (majorId: number) => void;
}
