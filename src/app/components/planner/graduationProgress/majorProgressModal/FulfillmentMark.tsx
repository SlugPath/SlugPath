import IsSatisfiedMark from "@/app/components/miscellaneous/IsSatisfiedMark";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { PlannerContext } from "@/app/contexts/PlannerProvider";
import { Requirements } from "@/app/types/Requirements";
import { useContext } from "react";

export default function FulfillmentMark(requirements: Requirements) {
  const { isMajorRequirementsSatisfied } = useContext(MajorVerificationContext);
  const { courseState } = useContext(PlannerContext);

  return (
    <IsSatisfiedMark
      isSatisfied={isMajorRequirementsSatisfied(
        requirements,
        courseState.courses,
      )}
    />
  );
}
