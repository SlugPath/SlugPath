import { Modal, Sheet, DialogActions, Typography } from "@mui/joy";
import { Button } from "@mui/joy";
import MajorSelection from "../MajorSelection";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { useContext } from "react";

export default function MajorSelectionModal() {
  const { showMajorSelectionModal, setShowMajorSelectionModal } =
    useContext(ModalsContext);

  return (
    <Modal
      open={showMajorSelectionModal}
      onClose={() => setShowMajorSelectionModal(false)}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        variant="outlined"
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
        <MajorSelection
          saveButtonName="Save"
          handleSave={() => setShowMajorSelectionModal(false)}
        />
        <DialogActions>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => setShowMajorSelectionModal(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Sheet>
    </Modal>
  );
}
