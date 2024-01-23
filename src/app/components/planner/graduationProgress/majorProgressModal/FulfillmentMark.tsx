import { Requirements } from "@/app/types/Requirements";
import { PlannerContext } from "@/app/contexts/PlannerProvider";
import { useContext } from "react";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import IsSatisfiedMark from "@/app/components/IsSatisfiedMark";

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
