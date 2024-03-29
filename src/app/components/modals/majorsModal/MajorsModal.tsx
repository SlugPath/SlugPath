import DefaultPlannerSelection from "@/app/components/modals/majorsModal/defaultPlannerSelection/DefaultPlannerSelection";
import UserProgramsEditor from "@/app/components/modals/majorsModal/majorSelection/MajorSelection";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { useUserPermissions, useUserPrograms } from "@/app/hooks/reactQuery";
import { Program } from "@/app/types/Program";
import {
  extractUnexpiredPrograms,
  hasPermissionToEditProgram,
} from "@/lib/permissionsUtils";
import { Card, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useContext, useMemo } from "react";

import { Requirements } from "./Requirements";

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

// TODO: Loading states from react-query
export function MajorAndPlannerSelection({
  isInPlannerPage,
  onSavedDefaultPlanner,
}: {
  isInPlannerPage: boolean;
  onSavedDefaultPlanner?: () => void;
}) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const {
    setShowMajorsModal,
    setShowMajorRequirementsEditModal,
    setMajorToEdit,
  } = useContext(ModalsContext);
  const { getRequirementsForMajor } = useContext(MajorVerificationContext);

  // Fetch programsAllowedToEdit
  const { data: userPermissions } = useUserPermissions(userId);

  const programsAllowedToEdit = useMemo(
    () => extractUnexpiredPrograms(userPermissions),
    [userPermissions],
  );

  // Fetch user programs
  const { data: userPrograms } = useUserPrograms(userId);

  function handleClickEditRequirements(major: Program) {
    setMajorToEdit(major);
    setShowMajorRequirementsEditModal(true);
  }

  const handleSave = () => {
    setShowMajorsModal(false);
    if (onSavedDefaultPlanner) onSavedDefaultPlanner();
  };

  return (
    <div className="flex-row space-x-3 grid grid-cols-7 w-full">
      <div className="flex flex-col overflow-y-scroll h-[80vh] col-span-3">
        <UserProgramsEditor />
        <div className="space-y-2 w-full">
          {userPrograms &&
            userPrograms.map((program, index) => {
              const majorRequirements = getRequirementsForMajor(program.id);

              if (majorRequirements === undefined) {
                return (
                  <Card key={index}>
                    Missing requirements for {program.name}{" "}
                    {program.catalogYear}. Reloading the page may help.
                  </Card>
                );
              }

              return (
                <Requirements
                  key={index}
                  major={program}
                  requirements={majorRequirements}
                  parents={0}
                  hideTitle={false}
                  hasEditPermission={hasPermissionToEditProgram(
                    program,
                    programsAllowedToEdit,
                  )}
                  onClickEdit={handleClickEditRequirements}
                />
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
          onSaved={handleSave}
          saveButtonName={isInPlannerPage ? "Save" : "Next"}
          isInPlannerPage={isInPlannerPage}
        />
      </Card>
    </div>
  );
}
