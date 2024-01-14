import { Modal, ModalClose, Sheet, Typography, Button } from "@mui/joy";
import { useContext, useState } from "react";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import {
  RequirementsComponent,
  RequirementsComponentEditing,
} from "./RequirementsComponent";

export default function MajorProgressModal() {
  const {
    setShowMajorProgressModal: setShowModal,
    showMajorProgressModal: showModal,
  } = useContext(ModalsContext);
  const { majorRequirements } = useContext(MajorVerificationContext);
  const [editing, setEditing] = useState(false);

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
          width: "50%",
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <div
          className="flex flex-row justify-between items-center"
          style={{ marginBottom: 10 }}
        >
          <Typography level="title-lg">Major Progress</Typography>
          <Button onClick={() => setEditing(!editing)}>
            {editing ? "Done" : "Edit"}
          </Button>
        </div>
        <div className="overflow-y-scroll" style={{ maxHeight: "80vh" }}>
          {editing ? (
            <RequirementsComponentEditing requirements={majorRequirements} />
          ) : (
            <RequirementsComponent {...majorRequirements} />
          )}
        </div>
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}
