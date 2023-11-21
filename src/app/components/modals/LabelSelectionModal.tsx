import {
  Checkbox,
  List,
  ListItem,
  Modal,
  Sheet,
  Typography,
  DialogActions,
  Button,
} from "@mui/joy";
import { Label } from "../../types/Label";
import LabelButton from "../CourseLabel";
import { useState } from "react";

interface LabelsSelectionModalProps {
  setShowModal: (showModal: boolean) => void;
  showModal: boolean;
  labels: Label[];
  selectedLabels: Label[];
  onUpdateLabels: (labels: Label[]) => void;
}

export default function LabelsSelectionModal({
  setShowModal,
  showModal,
  labels,
  selectedLabels,
  onUpdateLabels,
}: LabelsSelectionModalProps) {
  const [checkedLabels, setCheckedLabels] = useState(selectedLabels);

  function handleToggle(label: Label) {
    const currentIndex = checkedLabels.findIndex(
      (checkedLabel) => checkedLabel.id === label.id,
    );
    const newChecked = [...checkedLabels];

    if (currentIndex === -1) {
      newChecked.push(label);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedLabels(newChecked);
  }

  function handleSave() {
    onUpdateLabels(checkedLabels);
    setShowModal(false);
  }

  function isChecked(label: Label) {
    return (
      checkedLabels.findIndex(
        (checkedLabel) => checkedLabel.id === label.id,
      ) !== -1
    );
  }

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: "30%",
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
          Edit Labels
          <List>
            {labels.map((label: Label, index: number) => (
              <ListItem key={index}>
                <Checkbox
                  onChange={() => handleToggle(label)}
                  checked={isChecked(label)}
                />
                <LabelButton label={label}>
                  {/* <Input
                    variant="soft"
                    value={label.name}
                    autoFocus
                    error={label.name.length < 2}
                    size="md"
                    placeholder="Label name"
                  /> */}
                </LabelButton>
              </ListItem>
            ))}
          </List>
        </Typography>
        <DialogActions>
          <Button variant="solid" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Sheet>
    </Modal>
  );
}
