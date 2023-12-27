import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import MajorSelection from "./MajorSelection";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { useContext } from "react";
import { PlannersContext } from "@/app/contexts/PlannersProvider";

export default function MajorSelectionModal() {
  const { showMajorSelectionModal, setShowMajorSelectionModal } =
    useContext(ModalsContext);
  const { addPlanner, replaceCurrentPlanner } = useContext(PlannersContext);

  function handleCreateNewPlanner() {
    addPlanner();
    setShowMajorSelectionModal(false);
  }

  function handleReplaceCurrentPlanner() {
    replaceCurrentPlanner();
  }

  return (
    <Modal
      open={showMajorSelectionModal}
      onClose={() => setShowMajorSelectionModal(false)}
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
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          Edit Major
        </Typography>
        <div className="flex overflow-y-scroll h-[80vh]">
          <MajorSelection
            saveButtonName="Save"
            onSaved={() => setShowMajorSelectionModal(false)}
            isInPlannerPage={true}
            onCreateNewPlanner={handleCreateNewPlanner}
            onReplaceCurrentPlanner={handleReplaceCurrentPlanner}
          />
        </div>
        <ModalClose variant="plain" sx={{ m: 1 }} />
      </Sheet>
    </Modal>
  );
}
