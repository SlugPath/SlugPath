import Search from "@/app/components/search/Search";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import useUserPermissions from "@/app/hooks/useUserPermissions";
import {
  Button,
  Card,
  Chip,
  Modal,
  ModalClose,
  Sheet,
  Typography,
} from "@mui/joy";
import { CircularProgress } from "@mui/material";
import { useContext, useState } from "react";

import {
  RequirementsComponent,
  RequirementsComponentEditing,
} from "./RequirementsComponent";

export default function MajorProgressModal() {
  const {
    setShowMajorProgressModal: setShowModal,
    showMajorProgressModal: showModal,
  } = useContext(ModalsContext);
  const { loadingSave, majorRequirements, onSaveMajorRequirements } =
    useContext(MajorVerificationContext);
  const { hasPermissionToEdit } = useUserPermissions();
  const [editing, setEditing] = useState(false);

  function Title() {
    return (
      <div className="flex flex-col space-y-2">
        <Typography level="h4">Major Progress</Typography>
        <Typography level="title-lg">{majorRequirements.title}</Typography>
      </div>
    );
  }

  function handleToggleEditButton() {
    setEditing(!editing);
    if (editing) {
      onSaveMajorRequirements();
    }
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
        <div className="flex flex-row mb-3">
          {editing && showModal && hasPermissionToEdit && (
            <div className="flex-initial pr-2">
              <Card variant="soft" size="sm">
                <Search displayCustomCourseSelection={false} />
              </Card>
            </div>
          )}
          <Requirements
            majorRequirements={majorRequirements}
            editing={editing}
          />
        </div>
        <EditPermissionLabelAndButton
          editing={editing}
          loadingSave={loadingSave}
          hasPermissionToEdit={hasPermissionToEdit}
          handleToggleEditButton={handleToggleEditButton}
        />
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}

// this component decides which RequirementsComponent to render based on the editing prop
// will also display if there are no requirements
function Requirements({
  majorRequirements,
  editing,
}: {
  majorRequirements: any;
  editing: boolean;
}) {
  const noRequirements = majorRequirements.requirements.length === 0;

  if (noRequirements && !editing) {
    return (
      <Card
        variant="soft"
        className="flex flex-row justify-center items-center w-full"
      >
        <Typography>
          There are no requirements for this degree program yet
        </Typography>
      </Card>
    );
  }

  return (
    <div className="overflow-y-scroll w-full" style={{ maxHeight: "80vh" }}>
      {editing ? (
        <RequirementsComponentEditing
          requirements={majorRequirements}
          parents={0}
        />
      ) : (
        <RequirementsComponent requirements={majorRequirements} parents={0} />
      )}
    </div>
  );
}

function EditPermissionLabelAndButton({
  editing,
  loadingSave,
  hasPermissionToEdit,
  handleToggleEditButton,
}: {
  editing: boolean;
  loadingSave: boolean;
  hasPermissionToEdit: boolean;
  handleToggleEditButton: () => void;
}) {
  return (
    <>
      {hasPermissionToEdit && (
        <div className="flex flex-row justify-end space-x-2">
          <Chip color="success" variant="solid">
            You have edit permission
          </Chip>
          {loadingSave ? (
            <CircularProgress />
          ) : (
            <Button onClick={handleToggleEditButton}>
              {editing ? "Done" : "Edit Requirement List"}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
