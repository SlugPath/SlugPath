import MajorSelection from "@/app/components/majorSelection/MajorSelection";
import { DefaultPlannerContext } from "@/app/contexts/DefaultPlannerProvider";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { PermissionsContext } from "@/app/contexts/PermissionsProvider";
import { PlannersContext } from "@/app/contexts/PlannersProvider";
import { Major } from "@/app/types/Major";
import { Card, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useContext } from "react";

import { RequirementsComponent } from "./RequirementsComponent";
import DefaultPlannerSelection from "@/app/components/majorSelection/defaultPlannerSelection/DefaultPlannerSelection";

export default function MajorsModal() {
  const {
    setShowMajorsModal: setShowModal,
    showMajorsModal: showModal,
    setShowMajorRequirementsEditModal,
    setMajorToEdit,
  } = useContext(ModalsContext);
  const { getRequirementsForMajor } = useContext(MajorVerificationContext);
  const { majorsAllowedToEdit } = useContext(PermissionsContext);
  const { userMajors } = useContext(DefaultPlannerContext);
  // const { addPlanner, replaceCurrentPlanner } = useContext(PlannersContext);

  function hasPermissionToEdit(major: Major) {
    return majorsAllowedToEdit.some(
      (m) => m.name == major.name && m.catalogYear == major.catalogYear,
    );
  }

  function handleClickEditRequirements(major: Major) {
    setMajorToEdit(major);
    setShowMajorRequirementsEditModal(true);
  }

  // function handleCreateNewPlanner() {
  //   addPlanner();
  //   setShowModal(false);
  // }

  // function handleReplaceCurrentPlanner() {
  //   replaceCurrentPlanner();
  //   setShowModal(false);
  // }

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
        <div className="flex flex-row space-x-3 grid grid-cols-4 w-full">
          <div className="flex flex-col overflow-y-scroll h-[80vh] col-span-2">
            <MajorSelection />
            <div className="space-y-2 w-full">
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
          </div>
          <Card variant="soft" className="col-span-2 overflow-y-scroll h-[80vh]">
            <Typography
              level="h4"
              className="flex flex-col space-y-2 justify-between mb-2"
            >
              My Default Planner
            </Typography>
            <DefaultPlannerSelection
              userMajors={userMajors}
              onSaved={() => {}}
              saveButtonName={"Save"}
              isInPlannerPage={true}
              
              // onCreateNewPlanner={handleCreateNewPlanner}
              // onReplaceCurrentPlanner={handleReplaceCurrentPlanner}
            />
          </Card>
        </div>
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}
