import DefaultPlannerSelection from "@/app/components/modals/majorsModal/defaultPlannerSelection/DefaultPlannerSelection";
import MajorSelection from "@/app/components/modals/majorsModal/majorSelection/MajorSelection";
import { DefaultPlannerContext } from "@/app/contexts/DefaultPlannerProvider";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { PermissionsContext } from "@/app/contexts/PermissionsProvider";
import { Major } from "@/app/types/Major";
import { hasPermissionToEditMajor } from "@/lib/permissionsUtils";
import { Card, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useContext } from "react";

import { Requirements } from "./Requirements";

//import useMajorRequirementLists from "@/app/hooks/useMajorRequirementLists";

export default function MajorsModal() {
  const { setShowMajorsModal: setShowModal, showMajorsModal: showModal } =
    useContext(ModalsContext);

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
          width: "100%",
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <MajorAndPlannerSelection isInPlannerPage={true} />
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}

export function MajorAndPlannerSelection({
  isInPlannerPage,
  onSavedDefaultPlanner,
}: {
  isInPlannerPage: boolean;
  onSavedDefaultPlanner?: () => void;
}) {
  const {
    setShowMajorsModal,
    setShowMajorRequirementsEditModal,
    setMajorToEdit,
    setMajorToSuggest,
    setShowSuggestionsModal,
  } = useContext(ModalsContext);
  const { getRequirementsForMajor } = useContext(MajorVerificationContext);
  const { majorsAllowedToEdit } = useContext(PermissionsContext);
  const { userMajors } = useContext(DefaultPlannerContext);

  function handleClickEditRequirements(major: Major) {
    setMajorToEdit(major);
    setShowMajorRequirementsEditModal(true);
  }

  function handleClickSuggest(major: Major) {
    setMajorToSuggest(major);
    setShowSuggestionsModal(true);
  }

  return (
    <div className="flex-row space-x-3 grid grid-cols-7 w-full">
      <div className="flex flex-col overflow-y-scroll h-[80vh] col-span-3">
        <MajorSelection />
        <div className="space-y-2 w-full">
          {userMajors.map((major, index) => {
            const majorRequirements = getRequirementsForMajor(major.id);

            if (majorRequirements === null || majorRequirements === undefined) {
              return (
                <div key={index}>
                  Missing requirements for {major.name} {major.catalogYear}.
                  Reloading the page may help.
                </div>
              );
            }

            return (
              <div key={index} className="relative">
                <Requirements
                  major={major}
                  requirements={majorRequirements}
                  parents={0}
                  hideTitle={false}
                  hasEditPermission={hasPermissionToEditMajor(
                    major,
                    majorsAllowedToEdit,
                  )}
                  onClickEdit={handleClickEditRequirements}
                />
                <button
                  className="absolute top-0 right-0 p-2 bg-blue-500 text-white rounded"
                  onClick={() => handleClickSuggest(major)}
                >
                  Suggest
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <Card variant="soft" className="col-span-4">
        <Typography
          level="h4"
          className="flex flex-col space-y-2 justify-between mb-2"
        >
          My Default Planner
        </Typography>
        <DefaultPlannerSelection
          onSaved={onSavedDefaultPlanner ?? (() => {})}
          saveButtonName={isInPlannerPage ? "Save" : "Next"}
          isInPlannerPage={isInPlannerPage}
          onReplacePlanner={() => setShowMajorsModal(false)}
        />
      </Card>
    </div>
  );
}
