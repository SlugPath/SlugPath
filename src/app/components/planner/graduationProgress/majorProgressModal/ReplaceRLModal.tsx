import { getAllRequirementLists } from "@/app/actions/majorRequirements";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { RequirementList } from "@/app/types/Requirements";
import {
  AccordionDetails,
  AccordionSummary,
  Button,
  Modal,
  ModalClose,
  Sheet,
  Typography,
} from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import StyledAccordion from "../../StyledAccordion";
import { RequirementsComponent } from "./RequirementsComponent";

// RL = Requirement List
export default function ReplaceRLModal() {
  const { setShowReplaceRLModal: setShowModal, showReplaceRLModal: showModal } =
    useContext(ModalsContext);
  const { majorRequirements, updateRequirementList } = useContext(
    MajorVerificationContext,
  );

  const { data: requirementLists, refetch: refetchRequirementLists } = useQuery(
    {
      queryKey: ["getAllRequirementLists"],
      queryFn: () => getAllRequirementLists(),
    },
  );

  // keeps the same id, title, and binder, but replaces the requirements
  function handleReplaceRL(requirementList: RequirementList) {
    updateRequirementList(majorRequirements.id, {
      ...majorRequirements,
      requirements: requirementList.requirements,
    });
    setShowModal(false);
  }

  // refetch the requirement lists when the modal is shown
  // which ensures that recently added requirement lists are shown
  useEffect(() => {
    if (showModal) {
      refetchRequirementLists();
    }
  }, [refetchRequirementLists, showModal]);

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
          width: "60%",
          height: "95%",
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <div className="mb-4">
          <Typography level="h4">Replace Current Requirement List</Typography>
          <Typography>
            Choose a requirement list to replace the current one for `
            {majorRequirements.title}`
          </Typography>
        </div>
        <div
          className="overflow-y-scroll w-full space-y-2"
          style={{ maxHeight: "80vh" }}
        >
          <RequirementLists
            requirementLists={requirementLists}
            handleReplaceRL={handleReplaceRL}
            setShowModal={setShowModal}
          />
        </div>
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}

function RequirementLists({
  requirementLists,
  handleReplaceRL,
  setShowModal,
}: {
  requirementLists: RequirementList[] | undefined;
  handleReplaceRL: (requirementList: RequirementList) => void;
  setShowModal: (show: boolean) => void;
}) {
  return (
    <>
      {requirementLists?.map((requirementList, index) => (
        <StyledAccordion key={index} defaultExpanded={false}>
          <AccordionSummary>
            <div className="flex flex-row gap-1 items-center justify-between w-full">
              <Typography level="title-lg">{requirementList.title}</Typography>
              <Button
                color="warning"
                onClick={() => {
                  handleReplaceRL(requirementList);
                  setShowModal(false);
                }}
              >
                Replace
              </Button>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <RequirementsComponent
              requirements={requirementList}
              parents={0}
              hideTitle={true}
            />
          </AccordionDetails>
        </StyledAccordion>
      ))}
    </>
  );
}
