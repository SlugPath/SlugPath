import { DefaultPlannerContext } from "@/app/contexts/DefaultPlannerProvider";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { PermissionsContext } from "@/app/contexts/PermissionsProvider";
import { Major } from "@/app/types/Major";
import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useContext } from "react";

import { RequirementsComponent } from "./RequirementsComponent";

export default function MajorProgressModal() {
  const {
    setShowMajorProgressModal: setShowModal,
    showMajorProgressModal: showModal,
    setShowMajorRequirementsEditModal,
    setMajorToEdit,
  } = useContext(ModalsContext);
  const { getRequirementsForMajor } = useContext(MajorVerificationContext);
  const { majorsAllowedToEdit } = useContext(PermissionsContext);
  const { userMajors } = useContext(DefaultPlannerContext);

  function hasPermissionToEdit(major: Major) {
    return majorsAllowedToEdit.some(
      (m) => m.name == major.name && m.catalogYear == major.catalogYear,
    );
  }

  function Title() {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <Typography level="h4">Major Progress</Typography>
        </div>
      </div>
    );
  }

  function handleClickEditRequirements(major: Major) {
    setMajorToEdit(major);
    setShowMajorRequirementsEditModal(true);
  }

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
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <div className="mb-4">
          <Title />
        </div>
        <div className="space-y-2 overflow-y-scroll w-full h-[80vh]">
          {userMajors.map((major, index) => {
            const majorRequirements = getRequirementsForMajor(major.id);

            if (majorRequirements === undefined) {
              return (
                <div key={index}>
                  Missing requirements for {major.name} {major.catalogYear}
                </div>
              );
            }

            return (
              <RequirementsComponent
                key={index}
                major={major}
                requirements={majorRequirements}
                parents={0}
                hideTitle={false}
                hasEditPermission={hasPermissionToEdit(major)}
                onClickEdit={handleClickEditRequirements}
              />
            );
          })}
        </div>
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}
