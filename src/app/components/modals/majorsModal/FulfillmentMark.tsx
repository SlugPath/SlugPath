import IsSatisfiedMark from "@components/miscellaneous/IsSatisfiedMark";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { PlannerContext } from "@contexts/PlannerProvider";
import { Requirements } from "@customTypes/Requirements";
import { useContext } from "react";

export default function FulfillmentMark(requirements: Requirements) {
  const { isMajorRequirementsSatisfied } = useContext(MajorVerificationContext);
  const { courseState } = useContext(PlannerContext);

  const isSatisfied = isMajorRequirementsSatisfied(
    requirements,
    courseState.courses,
  );

  return <IsSatisfiedMark isSatisfied={isSatisfied} />;
}
