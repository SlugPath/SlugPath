import useMajorRequirements from "@/app/hooks/useMajorRequirements";
import useProgramVerification from "@/app/hooks/useProgramVerification";
import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";

import { DefaultPlannerContext } from "../DefaultPlannerProvider";
import { MajorVerificationContextProps } from "./Types";

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
  const { userMajors } = useContext(DefaultPlannerContext);
  const { getLoadingSave, getIsSaved } = useMajorRequirements(
    userMajors,
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
