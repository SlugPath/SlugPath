import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { Program } from "@/app/types/Program";
import { getAllRequirementLists } from "@actions/majorRequirements";
import { RequirementList } from "@customTypes/Requirements";
import {
  AccordionDetails,
  AccordionSummary,
  Button,
  Modal,
  ModalClose,
  Sheet,
  Typography,
} from "@mui/joy";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import StyledAccordion from "../../planner/StyledAccordion";
import { Requirements } from "./Requirements";

// TODO: Update this to use react-query
export default function ReplaceRequirementsModal({
  showModal,
  setShowModal,
  program,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  program: Program;
}) {
  const { getRequirementsForMajor, updateRequirementList } = useContext(
    MajorVerificationContext,
  );

  // TODO: Extract out to `reactQuery.ts`
  const {
    isLoading: loadingRequirementLists,
    data: requirementLists,
    refetch: refetchRequirementLists,
  } = useQuery({
    queryKey: ["getAllRequirementLists", showModal],
    queryFn: async () => await getAllRequirementLists(),
    enabled: showModal,
  });

  const majorRequirements =
    program !== undefined ? getRequirementsForMajor(program.id) : undefined;

  // TODO: Fix this, useMutation from react-query and place in `reactQuery.ts`
  // keeps the same id, title, and binder, but replaces the requirements
  function handleReplaceRL(requirementList: RequirementList) {
    if (program === undefined || majorRequirements === undefined) return;
    updateRequirementList(program.id, majorRequirements.id, {
      ...majorRequirements,
      requirements: requirementList.requirements,
    });
    setShowModal(false);
  }

  // TODO: fix this with react-query
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
            Choose a requirement list to replace `{majorRequirements?.title}`
          </Typography>
        </div>
        <div
          className="overflow-y-scroll w-full space-y-2"
          style={{ maxHeight: "80vh" }}
        >
          {requirementLists?.map((requirementList, index) => (
            <StyledAccordion key={index} defaultExpanded={false}>
              <AccordionSummary>
                <div className="flex flex-row gap-1 items-center justify-between w-full">
                  <Typography level="title-lg">
                    {requirementList.title}
                  </Typography>
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
                <Requirements
                  requirements={requirementList}
                  parents={0}
                  hideTitle={true}
                  major={program}
                />
              </AccordionDetails>
            </StyledAccordion>
          ))}
          {loadingRequirementLists && <CircularProgress />}
        </div>
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}
