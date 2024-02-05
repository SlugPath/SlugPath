import Search from "@/app/components/search/Search";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { PermissionsContext } from "@/app/contexts/PermissionsProvider";
import {
  Button,
  Card,
  Chip,
  Modal,
  ModalClose,
  Sheet,
  Tooltip,
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
    setShowReplaceRLModal,
  } = useContext(ModalsContext);
  const { loadingSave, majorRequirements, onSaveMajorRequirements } =
    useContext(MajorVerificationContext);
  const { hasPermissionToEdit } = useContext(PermissionsContext);

  const [editing, setEditing] = useState(false);

  function Title() {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <Typography level="h4">Major Progress</Typography>
          {hasPermissionToEdit && (
            <Chip color="success" variant="solid" className="mr-6">
              You have edit permission
            </Chip>
          )}
        </div>
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
        if (editing) {
          handleToggleEditButton();
        }
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
        <EditButtons
          editing={editing}
          loadingSave={loadingSave}
          hasPermissionToEdit={hasPermissionToEdit}
          handleToggleEditButton={handleToggleEditButton}
          handleClickReplaceButton={() => setShowReplaceRLModal(true)}
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
  return (
    <div className="overflow-y-scroll w-full" style={{ maxHeight: "80vh" }}>
      {editing ? (
        <RequirementsComponentEditing
          requirements={majorRequirements}
          parents={0}
        />
      ) : (
        <RequirementsComponent
          requirements={majorRequirements}
          parents={0}
          hideTitle={false}
        />
      )}
    </div>
  );
}

function EditButtons({
  editing,
  loadingSave,
  hasPermissionToEdit,
  handleToggleEditButton,
  handleClickReplaceButton,
}: {
  editing: boolean;
  loadingSave: boolean;
  hasPermissionToEdit: boolean;
  handleToggleEditButton: () => void;
  handleClickReplaceButton: () => void;
}) {
  if (!hasPermissionToEdit) {
    return null;
  }

  return (
    <div className="flex flex-row justify-end">
      {loadingSave ? (
        <CircularProgress />
      ) : (
        <div className="space-x-2">
          {editing && (
            <Tooltip title="Replace with a Requirement List from a different program">
              <Button color="warning" onClick={handleClickReplaceButton}>
                Replace
              </Button>
            </Tooltip>
          )}
          <Button onClick={handleToggleEditButton}>
            {editing ? "Done" : "Edit Requirement List"}
          </Button>
        </div>
      )}
    </div>
  );
}
