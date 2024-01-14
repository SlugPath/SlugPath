import { Requirements } from "@/app/types/Requirements";
import { PlannerContext } from "@/app/contexts/PlannerProvider";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useContext } from "react";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";

export default function FulfillmentMark(requirements: Requirements) {
  const { isMajorRequirementsSatisfied } = useContext(MajorVerificationContext);
  const { courseState } = useContext(PlannerContext);

  return (
    <>
      {isMajorRequirementsSatisfied(requirements, courseState.courses) ? (
        <CheckCircleIcon color="success" />
      ) : (
        <ErrorIcon color="warning" />
      )}
    </>
  );
}
