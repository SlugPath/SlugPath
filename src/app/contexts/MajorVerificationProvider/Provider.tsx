import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";

import { DefaultPlannerContext } from "../DefaultPlannerProvider";
import { MajorVerificationContextProps } from "./Types";
import useMajorRequirements from "./useMajorRequirements";
import useMajorVerification from "./useMajorVerification";

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
    isMajorRequirementsSatisfied,
  } = useMajorVerification();
  const { userMajors } = useContext(DefaultPlannerContext);
  const { getLoadingSave, getIsSaved } = useMajorRequirements(
    userMajors,
    session?.user.id,
  );

  return (
    <MajorVerificationContext.Provider
      value={{
        isMajorRequirementsSatisfied,
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
