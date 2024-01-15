import { Modal, ModalClose, Sheet, Typography, Button, Card } from "@mui/joy";
import { useContext, useState } from "react";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import {
  RequirementsComponent,
  RequirementsComponentEditing,
} from "./RequirementsComponent";
import Search from "@/app/components/search/Search";

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
          width: "60%",
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <div className="mb-4">
          <Typography level="title-lg">Major Progress</Typography>
        </div>
        <div className="flex flex-row">
          <div className="flex-initial pr-2">
            <Card variant="soft" size="sm">
              <Search displayCustomCourseSelection={false} />
            </Card>
          </div>
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
        <div className="flex flex-row justify-end">
          <Button onClick={() => setEditing(!editing)}>
            {editing ? "Done" : "Edit"}
          </Button>
        </div>
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}
