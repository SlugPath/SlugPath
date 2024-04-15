import { Requirements } from "@/app/(site)/planner/majors/Requirements";
import { getAllRequirementLists } from "@actions/majorRequirements";
import StyledAccordion from "@components/planner/StyledAccordion";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { ModalsContext } from "@contexts/ModalsProvider";
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

export default function ReplaceRequirementsModal() {
  const {
    majorToEdit: major,
    setShowReplaceRLModal: setShowModal,
    showReplaceRLModal: showModal,
  } = useContext(ModalsContext);
  const { getRequirementsForMajor, updateRequirementList } = useContext(
    MajorVerificationContext,
  );

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
    major !== undefined ? getRequirementsForMajor(major.id) : undefined;

  // keeps the same id, title, and binder, but replaces the requirements
  function handleReplaceRL(requirementList: RequirementList) {
    if (major === undefined || majorRequirements === undefined) return;
    updateRequirementList(major.id, majorRequirements.id, {
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
            Choose a requirement list to replace `{majorRequirements?.title}`
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
          {loadingRequirementLists && <CircularProgress />}
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
  const { majorToEdit: major } = useContext(ModalsContext);

  if (major === undefined) return <div>Could not load major.</div>;

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
            <Requirements
              requirements={requirementList}
              parents={0}
              hideTitle={true}
              major={major}
            />
          </AccordionDetails>
        </StyledAccordion>
      ))}
    </>
  );
}
