import DefaultPlannerSelection from "@/app/components/modals/majorsModal/defaultPlannerSelection/DefaultPlannerSelection";
import UserProgramsEditor from "@/app/components/modals/majorsModal/majorSelection/MajorSelection";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { useUserPermissions, useUserPrograms } from "@/app/hooks/reactQuery";
import { ModalProps } from "@/app/types/Modal";
import {
  extractUnexpiredPrograms,
  hasPermissionToEditProgram,
} from "@/lib/permissionsUtils";
import { Card, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useContext, useMemo, useState } from "react";

import EditMajorRequirementsModal from "./EditMajorRequirementsModal";
import { Requirements } from "./Requirements";

export default function MajorsModal({ showModal, setShowModal }: ModalProps) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [showMajorRequirementsEditModal, setShowMajorRequirementsEditModal] =
    useState(false);

  const { getRequirementsForMajor } = useContext(MajorVerificationContext);

  // Fetch programsAllowedToEdit
  const { data: userPermissions } = useUserPermissions(userId);

  const programsAllowedToEdit = useMemo(
    () => extractUnexpiredPrograms(userPermissions),
    [userPermissions],
  );

  // Fetch user programs
  const { data: userPrograms } = useUserPrograms(userId);

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
                    <>
                      <EditMajorRequirementsModal
                        showModal={showMajorRequirementsEditModal}
                        setShowModal={setShowMajorRequirementsEditModal}
                        program={program}
                      />
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
                        onClickEdit={() =>
                          setShowMajorRequirementsEditModal(true)
                        }
                      />
                    </>
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
              onSaved={() => setShowModal(false)}
              saveButtonName={"Save"}
              isInPlannerPage={true}
            />
          </Card>
        </div>
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}
