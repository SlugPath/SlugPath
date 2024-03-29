import { useUserPrograms } from "@/app/hooks/reactQuery";
import useMajorRequirements from "@/app/hooks/useMajorRequirements";
import useProgramVerification from "@/app/hooks/useProgramVerification";
import { StoredCourse } from "@customTypes/Course";
import { PlannerData } from "@customTypes/Planner";
import { RequirementList, Requirements } from "@customTypes/Requirements";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const {
    updateRequirementList,
    addRequirementList,
    removeRequirementList,
    handleSaveMajorRequirements,
    calculateMajorProgressPercentage,
    getRequirementsForMajor,
    findRequirementList,
    isMajorRequirementsSatisfied: isProgramRequirementsSatisfied,
  } = useProgramVerification();

  const { data: userPrograms } = useUserPrograms(session?.user.id);

  const { getLoadingSave, getIsSaved } = useMajorRequirements(
    userPrograms ?? [],
    session?.user.id,
  );

  return (
    <MajorVerificationContext.Provider
      value={{
        isMajorRequirementsSatisfied: isProgramRequirementsSatisfied,
        getRequirementsForMajor,
        getLoadingSave,
        getIsSaved,
        calculateMajorProgressPercentage: calculateMajorProgressPercentage,
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
