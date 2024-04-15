import IsSatisfiedMark from "@components/miscellaneous/IsSatisfiedMark";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { PlannersContext } from "@contexts/PlannersProvider";
import { Requirements } from "@customTypes/Requirements";
import { useContext } from "react";

export default function FulfillmentMark(requirements: Requirements) {
  const { isMajorRequirementsSatisfied } = useContext(MajorVerificationContext);
  const { getPlanner, activePlanner } = useContext(PlannersContext);

  const isSatisfied = isMajorRequirementsSatisfied(
    requirements,
    getPlanner(activePlanner!).courses,
  );

  return <IsSatisfiedMark isSatisfied={isSatisfied} />;
}
