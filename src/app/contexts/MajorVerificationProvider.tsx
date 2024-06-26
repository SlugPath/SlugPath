import { StoredCourse } from "@customTypes/Course";
import { PlannerData } from "@customTypes/Planner";
import { RequirementList, Requirements } from "@customTypes/Requirements";
import useProgramVerification from "@hooks/useProgramVerification";
import { createContext } from "react";

export interface MajorVerificationContextProps {
  isMajorRequirementsSatisfied: (
    requirements: Requirements,
    courses: StoredCourse[],
  ) => boolean;
  getRequirementsForMajor: (majorId: number) => RequirementList | undefined;
  getLoadingSave: (majorId: number) => boolean;
  getIsSaved: (majorId: number) => boolean;
  calculateMajorProgressPercentage: (courseState: PlannerData) => number;
  calculateAllMajorProgressPercentages: (courseState: PlannerData) => {
    [key: string]: number;
  };
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

export const MajorVerificationContext = createContext(
  {} as MajorVerificationContextProps,
);

export function MajorVerificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    updateRequirementList,
    addRequirementList,
    removeRequirementList,
    handleSaveMajorRequirements,
    calculateMajorProgressPercentage,
    calculateAllMajorProgressPercentages,
    getRequirementsForMajor,
    findRequirementList,
    isMajorRequirementsSatisfied: isProgramRequirementsSatisfied,
    getIsSaved,
    getLoadingSave,
  } = useProgramVerification();

  return (
    <MajorVerificationContext.Provider
      value={{
        isMajorRequirementsSatisfied: isProgramRequirementsSatisfied,
        getRequirementsForMajor,
        getLoadingSave,
        getIsSaved,
        calculateMajorProgressPercentage: calculateMajorProgressPercentage,
        calculateAllMajorProgressPercentages:
          calculateAllMajorProgressPercentages,
        errors: "",
        findRequirementList,
        addRequirementList,
        removeRequirementList,
        updateRequirementList,
        onSaveMajorRequirements: handleSaveMajorRequirements,
      }}
    >
      {children}
    </MajorVerificationContext.Provider>
  );
}
