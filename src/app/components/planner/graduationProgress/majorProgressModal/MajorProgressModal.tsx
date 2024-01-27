import {
  Modal,
  ModalClose,
  Sheet,
  Typography,
  Button,
  Card,
  Chip,
} from "@mui/joy";
import { useContext, useState } from "react";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import {
  RequirementsComponent,
  RequirementsComponentEditing,
} from "./RequirementsComponent";
import Search from "@/app/components/search/Search";
import useUserPermissions from "@/app/hooks/useUserPermissions";
import { CircularProgress } from "@mui/material";

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
        <Typography level="title-lg">Major Progress</Typography>
        <Typography level="title-lg">{majorRequirements.title}</Typography>
        <Typography>
          Edit permission: {hasPermissionToEdit ? "True" : "false"}
        </Typography>
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
        <div className="flex flex-row">
          {showModal && hasPermissionToEdit && (
            <div className="flex-initial pr-2">
              <Card variant="soft" size="sm">
                <Search
                  displayCustomCourseSelection={false}
                  searchComponentId="majorprogress"
                />
              </Card>
            </div>
          )}
          <div
            className="overflow-y-scroll w-full"
            style={{ maxHeight: "80vh" }}
          >
            {editing ? (
              <RequirementsComponentEditing
                requirements={majorRequirements}
                parents={0}
              />
            ) : (
              <RequirementsComponent
                requirements={majorRequirements}
                parents={0}
              />
            )}
          </div>
        </div>
        {hasPermissionToEdit && (
          <div className="flex flex-row justify-end space-x-2">
            <Chip color="success" variant="solid">
              You have edit permission
            </Chip>
            {loadingSave ? (
              <CircularProgress />
            ) : (
              <Button onClick={handleToggleEditButton}>
                {editing ? "Done" : "Edit"}
              </Button>
            )}
          </div>
        )}
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}
