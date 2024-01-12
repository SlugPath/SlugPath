import { Card, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useContext } from "react";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { RequirementList, Requirements } from "@/app/types/Requirements";
import { isANDRequirement } from "@/lib/requirementsUtils";
import { PlannerContext } from "@/app/contexts/PlannerProvider";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function CourseInfoModal() {
  const {
    setShowMajorProgressModal: setShowModal,
    showMajorProgressModal: showModal,
  } = useContext(ModalsContext);

  const { majorRequirements } = useContext(MajorVerificationContext);

  return (
    <Modal
      open={showModal}
      onClose={() => {
        setShowModal(false);
      }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        sx={{
          width: "50%",
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <Typography level="title-lg">Major Progress</Typography>
        <div className="overflow-y-scroll" style={{ maxHeight: "80vh" }}>
          <RequirementsComponent {...majorRequirements} />
        </div>
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}

function RequirementsComponent(requirements: RequirementList) {
  return (
    <Card>
      {requirements.title ? (
        <div className="flex flex-row items-center space-x-1">
          <Typography level="title-lg">{requirements.title}</Typography>
          <FulfillmentMark {...requirements} />
        </div>
      ) : null}
      <Typography>{BinderTitle(requirements)}</Typography>
      {requirements.requirements.map((requirement, index) => {
        if ("requirements" in requirement) {
          return <RequirementsComponent key={index} {...requirement} />;
        } else {
          return (
            <div key={index} className="flex flex-row items-center space-x-1">
              <Typography>
                {requirement.departmentCode} {requirement.number}
              </Typography>
              <FulfillmentMark {...requirement} />
            </div>
          );
        }
      })}
    </Card>
  );
}

function BinderTitle(requirements: RequirementList): string {
  if (isANDRequirement(requirements)) {
    return "All of the following";
  } else {
    return "One of the following";
  }
}

function FulfillmentMark(requirements: Requirements) {
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
