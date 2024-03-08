import { MAX_LABEL_NAME } from "@/lib/consts";
import { truncateTitle } from "@/lib/utils";
import { Label } from "@customTypes/Label";
import { Edit } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  DialogActions,
  IconButton,
  Input,
  List,
  ListItem,
  Modal,
  Sheet,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";

import CourseLabel from "../../planner/quarters/courses/CourseLabel";

interface LabelsSelectionModalProps {
  setShowModal: (showModal: boolean) => void;
  showModal: boolean;
  labels: Label[];
  selectedLabels: Label[];
  onUpdateLabels: (labels: Label[]) => void;
  showLabelChecks?: boolean;
}

export default function LabelsSelectionModal({
  setShowModal,
  showModal,
  labels,
  selectedLabels,
  onUpdateLabels,
  showLabelChecks = true,
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

  function handleCancel() {
    setCheckedLabels(selectedLabels);
    setShowModal(false);
  }

  function isChecked(label: Label) {
    return (
      checkedLabels.findIndex(
        (checkedLabel) => checkedLabel.id === label.id,
      ) !== -1
    );
  }

  function handleLabelChanged(label: Label) {
    const currentIndex = checkedLabels.findIndex(
      (checkedLabel) => checkedLabel.id === label.id,
    );
    const newChecked = [...checkedLabels];
    newChecked[currentIndex] = label;
    setCheckedLabels(newChecked);
  }

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sheet
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
            {labels.map((label: Label, index: number) => {
              let displayLabel = selectedLabels.find(
                (selectedLabel) => selectedLabel.id === label.id,
              );
              if (!displayLabel) {
                displayLabel = label;
              }
              return (
                <LabelListItem
                  key={index}
                  label={displayLabel}
                  index={index}
                  handleToggle={handleToggle}
                  isChecked={isChecked(displayLabel)}
                  onLabelChanged={handleLabelChanged}
                  showCheck={showLabelChecks}
                />
              );
            })}
          </List>
        </Typography>
        <DialogActions>
          <Button variant="solid" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="plain" color="neutral" onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Sheet>
    </Modal>
  );
}

function LabelListItem({
  label,
  index,
  handleToggle,
  isChecked,
  onLabelChanged,
  showCheck,
}: {
  label: Label;
  index: number;
  handleToggle: (label: Label) => void;
  isChecked: boolean;
  onLabelChanged: (label: Label) => void;
  showCheck: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [labelName, setLabelName] = useState(label.name);
  const [updatedLabel, setUpdatedLabel] = useState(label);

  // stop editing if label becomes unchecked
  useEffect(() => {
    if (isChecked == false && editing) {
      setEditing(false);
    }
  }, [editing, isChecked]);

  const handleEndEditing = () => {
    if (editing) {
      setEditing(false);
      const newLabel = { ...label };
      newLabel.name = truncateTitle(labelName, MAX_LABEL_NAME);
      onLabelChanged(newLabel);
      setUpdatedLabel(newLabel);
    }
  };

  function displayText(): boolean {
    return labelName.length > 0 && !editing;
  }

  return (
    <ListItem key={index}>
      {showCheck && ( // Conditionally render checkbox based on showCheck
        <Checkbox onChange={() => handleToggle(label)} checked={isChecked} />
      )}
      <CourseLabel label={updatedLabel} displayText={displayText()} inMenu>
        {editing ? (
          <Input
            variant="soft"
            value={labelName}
            autoFocus
            size="sm"
            placeholder="Label name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEndEditing();
              }
            }}
            onChange={(e) => setLabelName(e.target.value)}
          />
        ) : null}
      </CourseLabel>
      <IconButton
        onClick={() => {
          editing ? handleEndEditing() : setEditing(true);
        }}
        disabled={!isChecked}
      >
        <Edit />
      </IconButton>
    </ListItem>
  );
}
