import usePlannersStore from "@/store/planner";
import IsSatisfiedMark from "@components/miscellaneous/IsSatisfiedMark";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { Requirements } from "@customTypes/Requirements";
import { useContext, useMemo } from "react";

export default function FulfillmentMark(requirements: Requirements) {
  const { isMajorRequirementsSatisfied } = useContext(MajorVerificationContext);
  const planners = usePlannersStore((state) => state.planners);
  const activePlannerId = usePlannersStore((state) => state.activePlannerId);

  const activePlanner = useMemo(
    () => planners.find((planner) => planner.id === activePlannerId),
    [planners, activePlannerId],
  );

  const isSatisfied = isMajorRequirementsSatisfied(
    requirements,
    activePlanner?.courses ?? [],
  );

  return <IsSatisfiedMark isSatisfied={isSatisfied} />;
}
